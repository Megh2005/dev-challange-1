"use client";

import { useState, useRef, useEffect, useCallback } from "react";

export function useTextToSpeech() {
  const [playingMsgId, setPlayingMsgId] = useState<string | null>(null);
  const [loadingAudioId, setLoadingAudioId] = useState<string | null>(null);

  const audioCacheRef = useRef<Record<string, HTMLAudioElement>>({});
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  const stopAudio = useCallback(() => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
      currentAudioRef.current = null;
    }
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setPlayingMsgId(null);
    setLoadingAudioId(null);
  }, []);

  const toggleSpeak = useCallback(
    async (messageId: string, rawText: string, lang?: string) => {
      // If currently playing this specific message, stop it
      if (playingMsgId === messageId) {
        stopAudio();
        return;
      }

      // Stop any other currently playing audio
      stopAudio();

      const cacheKey = `${messageId}_${lang || "orig"}`;

      // Check if we already have the audio cached for this message and language
      const cachedAudio = audioCacheRef.current[cacheKey];
      if (cachedAudio) {
        currentAudioRef.current = cachedAudio;
        cachedAudio.currentTime = 0;
        setPlayingMsgId(messageId);
        try {
          await cachedAudio.play();
        } catch (err) {
          console.error("Playback error:", err);
          setPlayingMsgId(null);
        }
        return;
      }

      // Fetch synthesized speech from Google Cloud Text-to-Speech API
      setLoadingAudioId(messageId);
      try {
        const res = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: rawText, lang }),
        });

        const data = await res.json();

        if (data.success && data.audioContent) {
          const audio = new Audio("data:audio/mp3;base64," + data.audioContent);
          audioCacheRef.current[cacheKey] = audio;
          currentAudioRef.current = audio;

          audio.onended = () => {
            setPlayingMsgId(null);
            currentAudioRef.current = null;
          };

          audio.onerror = (e) => {
            console.error("Audio error:", e);
            setPlayingMsgId(null);
            currentAudioRef.current = null;
          };

          setPlayingMsgId(messageId);
          await audio.play();
        } else if (data.fallback && typeof window !== "undefined" && window.speechSynthesis) {
          // Native browser TTS fallback with male voice preference
          const textToSpeak = data.cleanedText || rawText;
          const utterance = new SpeechSynthesisUtterance(textToSpeak);
          utterance.rate = 0.95;
          utterance.pitch = 0.85; // Masculine deeper pitch

          if (lang) {
            utterance.lang =
              lang === "bn"
                ? "bn-IN"
                : lang === "hi"
                ? "hi-IN"
                : lang === "ta"
                ? "ta-IN"
                : lang === "ml"
                ? "ml-IN"
                : lang === "en"
                ? "en-IN"
                : lang;
          }

          try {
            const availableVoices = window.speechSynthesis.getVoices();
            const maleVoice = availableVoices.find(
              (v) =>
                (v.name.toLowerCase().includes("male") ||
                  v.name.toLowerCase().includes("david") ||
                  v.name.toLowerCase().includes("george") ||
                  v.name.toLowerCase().includes("rishi") ||
                  v.name.toLowerCase().includes("guy") ||
                  v.name.toLowerCase().includes("madhav") ||
                  v.name.toLowerCase().includes("ravi"))
            );
            if (maleVoice) {
              utterance.voice = maleVoice;
            }
          } catch {
            // fallback to default with low pitch
          }

          utterance.onend = () => {
            setPlayingMsgId(null);
          };

          utterance.onerror = () => {
            setPlayingMsgId(null);
          };

          setPlayingMsgId(messageId);
          window.speechSynthesis.speak(utterance);
        } else {
          throw new Error(data.error || "Failed to synthesize speech.");
        }
      } catch (err) {
        console.error("Failed to read aloud:", err);
      } finally {
        setLoadingAudioId(null);
      }
    },
    [playingMsgId, stopAudio]
  );

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, [stopAudio]);

  return {
    playingMsgId,
    loadingAudioId,
    toggleSpeak,
    stopAudio,
  };
}
