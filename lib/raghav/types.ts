export type ModelState =
  | "unloaded"
  | "downloading"
  | "loading"
  | "ready"
  | "generating"
  | "error";

export interface DownloadProgress {
  receivedBytes: number;
  totalBytes: number;
  percentage: number;
}

export interface SearchSource {
  title: string;
  url: string;
  snippet?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  sources?: SearchSource[];
}

export const RAGHAV_MODEL_CONFIG = {
  name: "Gemma 4 E2B",
  filename: "gemma-4-E2B-it-web.litertlm",
  // Direct Hugging Face resolved binary URL (publicly accessible, no credentials needed)
  huggingFaceUrl:
    "https://huggingface.co/litert-community/gemma-4-E2B-it-litert-lm/resolve/main/gemma-4-E2B-it-web.litertlm",
  cacheName: "litert-raghav-cache-v1",
  cacheUrl: "https://local-cache/litert/gemma-4-E2B-it-web.litertlm",
};
