export interface SiteEnvironmentData {
  city: string;
  state?: string;
  country: string;
  latitude: number;
  longitude: number;
  temperature: number; // Celsius
  feelsLike: number; // Celsius
  humidity: number; // Percentage
  windSpeed: number; // m/s
  windSpeedKmH: number; // km/h
  windDirection?: number; // degrees
  pressure: number; // hPa
  condition: string; // e.g. "scattered clouds"
  timestamp: number;
}

const WEATHER_API_KEY =
  process.env.NEXT_PUBLIC_WEATHER_API_KEY 

/**
 * Fetches current weather and location data from OpenWeatherMap given latitude and longitude.
 */
export async function fetchSiteEnvironment(
  latitude: number,
  longitude: number
): Promise<SiteEnvironmentData> {
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}&units=metric`;
  const geoUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${WEATHER_API_KEY}`;

  const [weatherRes, geoRes] = await Promise.all([
    fetch(weatherUrl),
    fetch(geoUrl).catch(() => null),
  ]);

  if (!weatherRes.ok) {
    throw new Error(
      `Weather service error: HTTP ${weatherRes.status} ${weatherRes.statusText}`
    );
  }

  const weatherData = await weatherRes.json();
  let state: string | undefined;
  let cityName = weatherData.name || "Unknown Location";
  let country = weatherData.sys?.country || "IN";

  if (geoRes && geoRes.ok) {
    try {
      const geoData = await geoRes.json();
      if (Array.isArray(geoData) && geoData.length > 0) {
        if (geoData[0].name) cityName = geoData[0].name;
        if (geoData[0].state) state = geoData[0].state;
        if (geoData[0].country) country = geoData[0].country;
      }
    } catch {
      // Use standard weatherData fallback
    }
  }

  const windMps = Number(weatherData.wind?.speed || 0);
  const windKmH = Math.round(windMps * 3.6 * 10) / 10;

  return {
    city: cityName,
    state,
    country,
    latitude: Math.round(latitude * 10000) / 10000,
    longitude: Math.round(longitude * 10000) / 10000,
    temperature: Math.round(Number(weatherData.main?.temp || 0) * 10) / 10,
    feelsLike: Math.round(Number(weatherData.main?.feels_like || 0) * 10) / 10,
    humidity: Number(weatherData.main?.humidity || 0),
    windSpeed: Math.round(windMps * 10) / 10,
    windSpeedKmH: windKmH,
    windDirection: weatherData.wind?.deg,
    pressure: Number(weatherData.main?.pressure || 0),
    condition: weatherData.weather?.[0]?.description || "clear sky",
    timestamp: Date.now(),
  };
}

/**
 * Requests browser geolocation permission and returns the site environment data.
 */
export async function requestUserLocationAndWeather(): Promise<SiteEnvironmentData> {
  if (typeof window === "undefined" || !("geolocation" in navigator)) {
    throw new Error("Geolocation is not supported by your browser.");
  }

  const position = await new Promise<GeolocationPosition>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000, // cache for 5 minutes
    });
  });

  const { latitude, longitude } = position.coords;
  return await fetchSiteEnvironment(latitude, longitude);
}

/**
 * Formats site environment data into an engineering context block to feed into the prompt.
 */
export function formatEnvironmentContextPrompt(env: SiteEnvironmentData): string {
  const locationLabel = [env.city, env.state, env.country]
    .filter(Boolean)
    .join(", ");

  return `[User On-Site Location & Environmental Context]:
- Location: ${locationLabel} (Coordinates: ${env.latitude}° N, ${env.longitude}° E)
- Ambient Temperature: ${env.temperature}°C (Feels like: ${env.feelsLike}°C)
- Relative Humidity / Moisture: ${env.humidity}%
- Wind / Air Speed: ${env.windSpeed} m/s (${env.windSpeedKmH} km/h) (Wind Direction: ${env.windDirection ?? "N/A"}°)
- Atmospheric Pressure: ${env.pressure} hPa
- Prevailing Sky Condition: ${env.condition}
- Engineering Implications: Ensure calculations, concrete curing considerations (IS 456 / IS 7861), regional seismic zone parameters (IS 1893), and basic wind speed $V_b$ (IS 875 Part 3) reflect this specific location and site environment.`;
}
