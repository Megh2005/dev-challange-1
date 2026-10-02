// Supported 5 Indian languages for translation and speech across the platform
export const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English", label: "English" },
  { code: "hi", name: "Hindi", label: "हिन्दी" },
  { code: "bn", name: "Bengali", label: "বাংলা" },
  { code: "ta", name: "Tamil", label: "தமிழ்" },
  { code: "ml", name: "Malayalam", label: "മലയാളം" },
] as const;

export type SupportedLanguageCode = (typeof SUPPORTED_LANGUAGES)[number]["code"];
