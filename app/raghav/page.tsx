"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { FaHardHat, FaVolumeUp, FaStop } from "react-icons/fa";
import { MdEngineering } from "react-icons/md";
import { useTextToSpeech } from "@/lib/useTextToSpeech";
import {
  FiSend,
  FiStopCircle,
  FiDownload,
  FiFolder,
  FiHardDrive,
  FiAlertTriangle,
  FiExternalLink,
  FiRotateCcw,
  FiTrash2,
  FiCheckCircle,
  FiMapPin,
  FiSun,
  FiDroplet,
  FiWind,
  FiFileText,
} from "react-icons/fi";
import {
  exportSingleResponsePdf,
  exportFullChatPdf,
} from "@/lib/raghavPdfExport";
import {
  ChatMessage,
  DownloadProgress,
  ModelState,
  RAGHAV_MODEL_CONFIG,
} from "@/lib/raghav/types";
import {
  checkWebGPUSupport,
  downloadModelToUserPath,
  pickLocalModelFile,
  loadFromSavedFileHandle,
  validateLocalModelFile,
} from "@/lib/raghav/download";
import {
  initRaghavEngine,
  streamRaghavChat,
  cancelRaghavGeneration,
  cleanupRaghavEngine,
  resetRaghavConversation,
  isRaghavEngineLoaded,
} from "@/lib/raghav/engine";
import { RaghavMarkdown } from "@/components/raghav/RaghavMarkdown";
import {
  SiteEnvironmentData,
  requestUserLocationAndWeather,
} from "@/lib/raghav/weather";

export default function RaghavPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  // Guard: Raghav AI is exclusively accessible by users with the Engineer role
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth?callbackUrl=/raghav");
    } else if (status === "authenticated") {
      const role = ((session?.user as any)?.role || "").toLowerCase();
      if (!role) {
        router.push("/onboarding");
      } else if (role !== "engineer") {
        router.push("/profile");
      }
    }
  }, [session, status, router]);

  const [modelState, setModelState] = useState<ModelState>("unloaded");
  const [downloadProgress, setDownloadProgress] = useState<DownloadProgress | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [gpuInfo, setGpuInfo] = useState<string | null>(null);
  const [savedFileName, setSavedFileName] = useState<string | null>(null);

  // Site location and weather state
  const [siteEnvironment, setSiteEnvironment] = useState<SiteEnvironmentData | null>(null);
  const [locationStatus, setLocationStatus] = useState<"idle" | "requesting" | "granted" | "denied">("idle");

  // Chat conversation state (strictly ephemeral session in memory - no persistence)
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputPrompt, setInputPrompt] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const { playingMsgId, loadingAudioId, toggleSpeak, stopAudio } = useTextToSpeech();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const downloadAbortController = useRef<AbortController | null>(null);

  // Requests user geolocation and fetches real-time weather parameters
  const fetchSiteWeather = async (): Promise<SiteEnvironmentData | null> => {
    try {
      setLocationStatus("requesting");
      const env = await requestUserLocationAndWeather();
      setSiteEnvironment(env);
      setLocationStatus("granted");
      return env;
    } catch (err) {
      console.warn("Location permission or weather fetch failed:", err);
      setLocationStatus("denied");
      return null;
    }
  };

  // Instant check on mount/reload: WebGPU detection & instant model loaded status verification
  useEffect(() => {
    let mounted = true;

    async function checkEnvironment() {
      const gpu = await checkWebGPUSupport();
      if (!mounted) return;

      if (!gpu.supported) {
        setModelState("error");
        setErrorMessage(
          gpu.error ||
            "WebGPU is not available in this browser. Please enable hardware acceleration or use a compatible browser."
        );
        return;
      }

      setGpuInfo(gpu.adapterName || "WebGPU Ready");

      // Check if user previously saved a model file handle
      const saved = await loadFromSavedFileHandle();
      if (!mounted) return;

      if (saved.fileName) {
        setSavedFileName(saved.fileName);
      }

      // If handle has permission already, auto-load immediately
      if (saved.file) {
        try {
          setModelState("loading");
          await initRaghavEngine(saved.file);
          if (!mounted) return;
          setModelState("ready");
          setMessages([
            {
              id: "welcome-1",
              role: "assistant",
              content:
                "Hello! I am **Raghav**, your civil engineering colleague. What engineering problem or structural question are we looking at today?",
              timestamp: Date.now(),
            },
          ]);
          return;
        } catch (e) {
          console.warn("Auto-load from saved file handle failed:", e);
        }
      }

      // Check if model is loaded right now; if not, instantly notify user
      if (!isRaghavEngineLoaded()) {
        setModelState("unloaded");
        setMessages([
          {
            id: "notice-load-required",
            role: "assistant",
            content: saved.fileName
              ? `**Notice - Model Not Loaded**: The AI model is not in memory after reload. You have a saved model file (**${saved.fileName}**). Please click **'Reconnect Saved File'** or select your model file in the setup card above to begin.`
              : "**Notice - Model Not Loaded**: The AI model is not loaded in memory after reload. Please download the model or select your `.litertlm` file in the setup card above before asking questions.",
            timestamp: Date.now(),
          },
        ]);
      }
    }

    checkEnvironment();
    // Proactively request site location and live weather for engineering context
    fetchSiteWeather();

    return () => {
      mounted = false;
      cleanupRaghavEngine();
    };
  }, []);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isGenerating]);

  // Download model to user-chosen path with progress bar
  const handleDownloadToCustomPath = async () => {
    try {
      setErrorMessage(null);
      setModelState("downloading");
      setDownloadProgress(null);

      downloadAbortController.current = new AbortController();

      const file = await downloadModelToUserPath((progress) => {
        setDownloadProgress(progress);
      }, downloadAbortController.current.signal);

      setSavedFileName(file.name);

      // Now initialize LiteRT WebGPU Engine with the saved file
      setModelState("loading");
      await initRaghavEngine(file);
      setModelState("ready");

      if (messages.length === 0 || messages[0]?.id.startsWith("notice-")) {
        setMessages([
          {
            id: "welcome-1",
            role: "assistant",
            content:
              "Hello! I am **Raghav**, your colleague. What engineering problem are we looking at today?",
            timestamp: Date.now(),
          },
        ]);
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") {
        setModelState("unloaded");
        setDownloadProgress(null);
        return;
      }
      const message = err instanceof Error ? err.message : String(err);
      setModelState("error");
      setErrorMessage(message);
    }
  };

  // Select an existing .litertlm file from disk
  const handlePickExistingFile = async () => {
    try {
      setErrorMessage(null);
      const file = await pickLocalModelFile();
      if (!file) return;

      setSavedFileName(file.name);
      setModelState("loading");
      await initRaghavEngine(file);
      setModelState("ready");

      if (messages.length === 0 || messages[0]?.id.startsWith("notice-")) {
        setMessages([
          {
            id: "welcome-1",
            role: "assistant",
            content:
              "Hello! I am **Raghav**, your civil engineering colleague. What engineering problem or structural question are we looking at today?",
            timestamp: Date.now(),
          },
        ]);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setModelState("error");
      setErrorMessage(`Failed to load selected model: ${message}`);
    }
  };

  // Load from previously saved file handle in user's path
  const handleLoadFromSavedHandle = async () => {
    try {
      setErrorMessage(null);
      setModelState("loading");
      const { file, fileName } = await loadFromSavedFileHandle();
      if (!file) {
        throw new Error(
          `Permission to access '${fileName || "saved model"}' was not granted or file was moved. Please re-select the file.`
        );
      }

      await initRaghavEngine(file);
      setModelState("ready");

      if (messages.length === 0 || messages[0]?.id.startsWith("notice-")) {
        setMessages([
          {
            id: "welcome-1",
            role: "assistant",
            content:
              "Hello! I am **Raghav**, your civil engineering colleague. How can I assist you today?",
            timestamp: Date.now(),
          },
        ]);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setModelState("error");
      setErrorMessage(message);
    }
  };

  // Fallback file input change
  const handleFileInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateLocalModelFile(file);
    if (!validation.valid) {
      setErrorMessage(validation.error || "Invalid file format.");
      return;
    }

    try {
      setErrorMessage(null);
      setModelState("loading");
      await initRaghavEngine(file);
      setModelState("ready");

      if (messages.length === 0 || messages[0]?.id.startsWith("notice-")) {
        setMessages([
          {
            id: "welcome-1",
            role: "assistant",
            content:
              "Hello! I am **Raghav**, your civil engineering colleague. What engineering problem or structural question are we looking at today?",
            timestamp: Date.now(),
          },
        ]);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setModelState("error");
      setErrorMessage(`Failed to load file: ${message}`);
    }
  };

  // Send message to Raghav
  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const prompt = inputPrompt.trim();
    if (!prompt || isGenerating) return;

    // Check instantly if model is loaded before sending
    if (modelState !== "ready" || !isRaghavEngineLoaded()) {
      setMessages((prev) => [
        ...prev,
        {
          id: `user-${Date.now()}`,
          role: "user",
          content: prompt,
          timestamp: Date.now(),
        },
        {
          id: `notice-load-${Date.now()}`,
          role: "assistant",
          content:
            "**Notice - Model Not Loaded**: The AI model is not loaded in memory. Please download or select your model file in the setup card above before chatting with Raghav.",
          timestamp: Date.now(),
        },
      ]);
      setInputPrompt("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
      return;
    }

    const userMessageId = `user-${Date.now()}`;
    const assistantMessageId = `raghav-${Date.now()}`;

    // Add user message to in-memory list
    const newMessages: ChatMessage[] = [
      ...messages,
      {
        id: userMessageId,
        role: "user",
        content: prompt,
        timestamp: Date.now(),
      },
    ];

    setMessages(newMessages);
    setInputPrompt("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    setIsGenerating(true);

    // Placeholder for streamed response
    setMessages((prev) => [
      ...prev,
      {
        id: assistantMessageId,
        role: "assistant",
        content: "...",
        timestamp: Date.now(),
      },
    ]);

    // Ensure site environment data is available
    let currentEnv = siteEnvironment;
    if (!currentEnv && locationStatus !== "denied") {
      try {
        currentEnv = await fetchSiteWeather();
      } catch {
        // proceed without env if denied or timeout
      }
    }

    try {
      // Stream tokens directly from local Gemma 4 E2B LiteRT engine with site environment context
      for await (const chunk of streamRaghavChat(prompt, currentEnv)) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? {
                  ...msg,
                  content: chunk.text,
                  sources: chunk.sources || msg.sources,
                }
              : msg
          )
        );
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? {
                ...msg,
                content: `An error occurred during inference: ${message}`,
              }
            : msg
        )
      );

      // If the GPU device was lost, reset to error state so user can re-load
      if (
        message.includes("GPU") ||
        message.includes("device was lost") ||
        message.includes("reload the model")
      ) {
        setModelState("error");
        setErrorMessage(message);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  // Cancel generation
  const handleStopGeneration = () => {
    cancelRaghavGeneration();
    setIsGenerating(false);
  };

  // Clear session chat and reset conversation KV cache on WebGPU
  const handleClearChat = async () => {
    setMessages([]);
    await resetRaghavConversation();
  };

  // If session is loading or user is not an engineer, prevent rendering Raghav workspace
  if (status === "loading") {
    return (
      <div className="w-full flex-1 flex flex-col items-center justify-center p-6 text-sm font-semibold text-[#8C93A0]">
        Verifying engineer credentials...
      </div>
    );
  }

  const currentRole = ((session?.user as any)?.role || "").toLowerCase();
  if (status === "authenticated" && currentRole !== "engineer") {
    return (
      <div className="w-full flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-sm p-8 rounded-[28px] bg-white border border-[#F06529]/15 shadow-[0_16px_36px_rgba(240,101,41,0.1)] flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-[20px] bg-[#FFF4EE] text-[#F06529] flex items-center justify-center text-2xl border border-[#F06529]/20">
            <MdEngineering />
          </div>
          <h2 className="text-lg font-black text-[#181A1E]">Engineer Access Only</h2>
          <p className="text-xs text-[#555A64] font-medium leading-relaxed">
            The Raghav AI structural workspace is strictly reserved for users with the Engineer role.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex-1 flex flex-col items-center px-3 pt-2 pb-3 sm:px-6 lg:px-8 antialiased">
      <main className="w-full max-w-7xl mx-auto flex-1 flex flex-col gap-3 min-h-0">
        {/* 1. TOP RESPONSIVE HEADER CARD */}
        <section className="w-full bg-white rounded-[24px] p-4 lg:px-6 shadow-[0_8px_20px_rgba(240,101,41,0.07),inset_2px_2px_4px_#FFFFFF,inset_-2px_-2px_4px_rgba(240,101,41,0.05)] border border-[#F06529]/15 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-[14px] bg-[#F06529] shadow-[3px_6px_14px_rgba(240,101,41,0.35),inset_1.5px_1.5px_3px_rgba(255,255,255,0.55),inset_-1.5px_-1.5px_3px_rgba(160,45,10,0.35)] flex items-center justify-center text-white text-xl shrink-0">
              <MdEngineering className="drop-shadow-sm" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-[#181A1E] leading-tight">
                  Raghav AI
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-[#FFF5EE] text-[#F06529] font-extrabold text-[10px] border border-[#F06529]/20 uppercase">
                  IS Code Co-Pilot
                </span>
              </div>
              <p className="text-[11px] text-[#555A64] font-medium hidden sm:block">
                On-device civil &amp; structural engineering assistant powered by local WebGPU
              </p>
            </div>
          </div>

          {/* Model Status Indicator & Controls */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFF5EE] border border-[#F06529]/20">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  modelState === "ready"
                    ? "bg-emerald-500 animate-pulse"
                    : modelState === "downloading" || modelState === "loading"
                    ? "bg-amber-500 animate-ping"
                    : "bg-gray-400"
                }`}
              />
              <span className="text-xs font-bold text-[#181A1E] capitalize">
                {modelState === "ready" ? "Ready" : modelState}
              </span>
            </div>

            {messages.length > 0 && !isGenerating && (
              <button
                type="button"
                onClick={handleClearChat}
                className="hidden sm:flex text-xs font-bold text-[#8C939F] hover:text-[#F06529] items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-[#FFF5EE] border border-[#F06529]/20 shadow-sm transition-all cursor-pointer"
              >
                <FiTrash2 className="text-xs" />
                <span>Reset Session</span>
              </button>
            )}
          </div>
        </section>

        {/* WORKBENCH BODY: 2-COLUMN ON LAPTOP (lg:), STACKED ON MOBILE */}
        <div className="w-full flex-1 flex flex-col lg:flex-row gap-4 min-h-0">
          {/* LEFT PANEL / SIDEBAR (CONTROL & TELEMETRY COCKPIT) */}
          <aside className="w-full lg:w-80 lg:shrink-0 flex flex-col gap-3">
            {/* Real-time Site Location & Weather Card */}
            <div className="w-full bg-white rounded-[22px] p-4 shadow-[0_6px_18px_rgba(240,101,41,0.06),inset_1.5px_1.5px_3px_#FFFFFF,inset_-1.5px_-1.5px_3px_rgba(240,101,41,0.04)] border border-[#F06529]/15 flex flex-col gap-2.5">
              <div className="flex items-center justify-between text-xs font-black text-[#181A1E]">
                <div className="flex items-center gap-1.5 text-[#F06529]">
                  <FiMapPin className="text-sm shrink-0" />
                  <span>Site Environment</span>
                </div>
                {locationStatus !== "granted" && (
                  <button
                    type="button"
                    onClick={() => fetchSiteWeather()}
                    disabled={locationStatus === "requesting"}
                    className="px-2 py-0.5 rounded-full bg-[#FFF5EE] hover:bg-[#FFEADA] text-[#F06529] font-bold text-[10px] border border-[#F06529]/25 cursor-pointer transition-all disabled:opacity-50"
                  >
                    {locationStatus === "requesting" ? "Detecting..." : "Detect"}
                  </button>
                )}
              </div>

              {siteEnvironment ? (
                <div className="flex flex-col gap-2 pt-1 text-xs">
                  <div className="font-extrabold text-[#181A1E] text-sm">
                    {siteEnvironment.city}
                    {siteEnvironment.state ? `, ${siteEnvironment.state}` : ""}
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 text-center text-[11px] pt-1">
                    <div className="p-2 rounded-xl bg-[#FFF5EE] flex flex-col items-center">
                      <FiSun className="text-amber-500 mb-0.5" />
                      <span className="font-black text-[#181A1E]">{siteEnvironment.temperature}°C</span>
                      <span className="text-[9px] text-[#8C939F]">Temp</span>
                    </div>
                    <div className="p-2 rounded-xl bg-[#FFF5EE] flex flex-col items-center">
                      <FiDroplet className="text-sky-500 mb-0.5" />
                      <span className="font-black text-[#181A1E]">{siteEnvironment.humidity}%</span>
                      <span className="text-[9px] text-[#8C939F]">Humidity</span>
                    </div>
                    <div className="p-2 rounded-xl bg-[#FFF5EE] flex flex-col items-center">
                      <FiWind className="text-teal-600 mb-0.5" />
                      <span className="font-black text-[#181A1E]">{siteEnvironment.windSpeed}m/s</span>
                      <span className="text-[9px] text-[#8C939F]">Wind</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-[11px] text-[#8C939F] font-medium leading-relaxed">
                  {locationStatus === "requesting"
                    ? "Acquiring site GPS location & local weather..."
                    : "Enable location to factor live curing temperature and humidity into calculations."}
                </div>
              )}
            </div>

            {/* Model Setup & Storage Card */}
            <div className="w-full bg-white rounded-[22px] p-4 shadow-[0_6px_18px_rgba(240,101,41,0.06),inset_1.5px_1.5px_3px_#FFFFFF,inset_-1.5px_-1.5px_3px_rgba(240,101,41,0.04)] border border-[#F06529]/15 flex flex-col gap-3">
              <div className="flex items-center justify-between text-xs font-black text-[#181A1E]">
                <div className="flex items-center gap-1.5 text-[#F06529]">
                  <FiHardDrive className="text-sm shrink-0" />
                  <span>Model Engine</span>
                </div>
                <span className="text-[10px] font-bold text-[#8C939F] truncate max-w-[120px]">
                  {gpuInfo || "WebGPU"}
                </span>
              </div>

              {savedFileName && (
                <div className="p-2.5 rounded-xl bg-[#FFF5EE] border border-[#F06529]/20 flex items-center justify-between gap-2">
                  <div className="truncate">
                    <span className="text-[10px] font-bold text-[#8C939F] block">Saved File</span>
                    <span className="text-xs font-mono font-bold text-[#181A1E] truncate block">
                      {savedFileName}
                    </span>
                  </div>
                  {modelState !== "ready" && (
                    <button
                      type="button"
                      onClick={handleLoadFromSavedHandle}
                      className="px-2.5 py-1 rounded-lg bg-[#F06529] hover:bg-[#DF5316] text-white text-xs font-bold transition-all cursor-pointer shrink-0"
                    >
                      Connect
                    </button>
                  )}
                </div>
              )}

              {/* Download / Select Buttons */}
              {modelState !== "downloading" && modelState !== "loading" ? (
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={handleDownloadToCustomPath}
                    className="w-full py-2.5 px-3 rounded-xl bg-[#F06529] hover:bg-[#DF5316] text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
                  >
                    <FiDownload className="text-sm" />
                    <span>Download Model (~1.87 GB)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handlePickExistingFile}
                    className="w-full py-2 px-3 rounded-xl bg-[#FFF5EE] hover:bg-[#FFEADA] text-[#181A1E] font-bold text-xs border border-[#F06529]/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <FiFolder className="text-sm text-[#F06529]" />
                    <span>Select Existing .litertlm</span>
                  </button>
                </div>
              ) : modelState === "downloading" && downloadProgress ? (
                <div className="flex flex-col gap-1.5 pt-1">
                  <div className="flex justify-between text-xs font-bold text-[#555A64]">
                    <span>Downloading...</span>
                    <span>{downloadProgress.percentage}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#FFF5EE] overflow-hidden border border-[#F06529]/20">
                    <div
                      className="h-full bg-[#F06529] transition-all duration-200 rounded-full"
                      style={{ width: `${downloadProgress.percentage}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs font-bold text-[#F06529] animate-pulse py-1">
                  <FiRotateCcw className="animate-spin text-sm" />
                  <span>Compiling WebGPU shaders...</span>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept=".litertlm"
                onChange={handleFileInputChange}
                className="hidden"
              />
            </div>

            {/* Quick IS Code Formula Shortcuts (Hidden on mobile if cramped, expansive on laptop) */}
            <div className="hidden lg:flex w-full bg-white rounded-[22px] p-4 shadow-[0_6px_18px_rgba(240,101,41,0.06),inset_1.5px_1.5px_3px_#FFFFFF,inset_-1.5px_-1.5px_3px_rgba(240,101,41,0.04)] border border-[#F06529]/15 flex-col gap-2.5">
              <span className="text-xs font-black text-[#181A1E]">IS Code Calculations</span>
              <div className="flex flex-col gap-1.5 text-xs">
                {[
                  "Calculate Development Length Ld for 16mm Fe500 in M25 concrete",
                  "Explain minimum clear cover requirements as per IS 456 Table 16",
                  "Verify shear stirrup spacing limits for a 300x500mm beam",
                  "Calculate moment of resistance for a singly reinforced beam",
                ].map((prompt, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setInputPrompt(prompt);
                      if (textareaRef.current) {
                        textareaRef.current.focus();
                      }
                    }}
                    className="p-2 rounded-xl bg-[#FFF5EE] hover:bg-[#FFEADA] text-[#181A1E] font-medium text-[11px] text-left border border-[#F06529]/15 transition-all cursor-pointer leading-snug"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* RIGHT MAIN WORKBENCH: EXPANSIVE CHAT & PROMPT CONSOLE */}
          <section className="flex-1 bg-white rounded-[24px] p-4 lg:p-6 shadow-[0_8px_20px_rgba(240,101,41,0.07),inset_2px_2px_4px_#FFFFFF,inset_-2px_-2px_4px_rgba(240,101,41,0.05)] border border-[#F06529]/15 flex flex-col min-h-[460px] lg:min-h-0 min-w-0">
            {/* Console Toolbar with Research Paper PDF Export */}
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#F06529]/10 shrink-0">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${modelState === "ready" ? "bg-green-500 animate-pulse" : "bg-[#F06529]"}`} />
                <h2 className="text-xs font-black uppercase tracking-wider text-[#181A1E]">
                  Raghav Engineering Console
                </h2>
              </div>

              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={() => exportFullChatPdf(messages, siteEnvironment, "Gemma-2B-IT WebGPU")}
                  title="Export complete session as black-and-white research paper PDF (monospace, 1-inch margins)"
                  className="px-3 py-1.5 rounded-xl bg-black hover:bg-neutral-800 active:scale-95 text-white font-mono text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                >
                  <FiFileText className="text-xs" />
                  <span>Export Chat (PDF)</span>
                </button>
              )}
            </div>

            {modelState !== "ready" && (
              <div className="w-full px-4 py-3 rounded-[16px] bg-[#FFF5EE] border border-[#F06529]/25 flex items-center justify-between text-xs text-[#F06529] font-bold mb-3 shrink-0 shadow-[inset_1px_1px_2px_rgba(240,101,41,0.06)]">
                <div className="flex items-center gap-2">
                  <FiAlertTriangle className="text-base shrink-0 animate-pulse text-[#F06529]" />
                  <span>
                    Model is not loaded into memory. Download or load the model file on the left panel to begin.
                  </span>
                </div>
              </div>
            )}

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto pr-1 sm:pr-2 flex flex-col gap-4">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 text-[#8C939F] gap-3 my-auto">
                  <div className="w-14 h-14 rounded-2xl bg-[#FFF5EE] text-[#F06529] flex items-center justify-center text-3xl shadow-sm">
                    <FaHardHat />
                  </div>
                  <div className="max-w-md flex flex-col gap-1">
                    <h3 className="text-base font-black text-[#181A1E]">Raghav Structural Assistant</h3>
                    <p className="text-xs text-[#555A64] font-medium leading-relaxed">
                      Ask structural engineering questions, verify IS 456 calculations, concrete mix designs, and rebar detailing.
                    </p>
                  </div>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col gap-1 ${
                      msg.role === "user" ? "items-end" : "items-start"
                    }`}
                  >
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#8C939F] px-1">
                      {msg.role === "user" ? "You" : "Raghav"}
                    </span>

                    <div
                      className={`max-w-[94%] lg:max-w-[85%] p-4 rounded-[22px] ${
                        msg.role === "user"
                          ? "bg-[#F06529] text-white shadow-[3px_5px_14px_rgba(240,101,41,0.25),inset_1.5px_1.5px_3px_rgba(255,255,255,0.45),inset_-1.5px_-1.5px_3px_rgba(160,45,10,0.3)] text-xs sm:text-sm font-medium"
                          : "bg-[#FFFDFB] text-[#181A1E] shadow-[2px_4px_12px_rgba(240,101,41,0.06),inset_1.5px_1.5px_3px_#FFFFFF,inset_-1.5px_-1.5px_3px_rgba(240,101,41,0.05)] border border-[#F06529]/15 text-xs sm:text-sm"
                      }`}
                    >
                      {msg.role === "user" ? (
                        <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                      ) : msg.content === "..." ? (
                        <div className="flex items-center gap-2.5 py-1 px-1">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#F06529] animate-bounce [animation-delay:-0.3s]" />
                            <span className="w-2 h-2 rounded-full bg-[#F06529] animate-bounce [animation-delay:-0.15s]" />
                            <span className="w-2 h-2 rounded-full bg-[#F06529] animate-bounce" />
                          </div>
                          <span className="text-xs font-bold text-[#F06529] animate-pulse">
                            Raghav is calculating &amp; solving...
                          </span>
                        </div>
                      ) : (
                        <div className="relative">
                          <RaghavMarkdown content={msg.content} />
                          {isGenerating &&
                            msg.id === messages[messages.length - 1]?.id && (
                              <span className="inline-block w-1.5 h-3.5 bg-[#F06529] ml-1 animate-pulse align-baseline rounded-sm" />
                            )}
                        </div>
                      )}

                      {msg.sources && msg.sources.length > 0 && (
                        <div className="mt-3 pt-2.5 border-t border-[#F06529]/15 flex flex-col gap-1 text-[11px]">
                          <span className="font-extrabold text-[#F06529]">
                            Referenced IS Standards &amp; Docs:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {msg.sources.map((s, idx) => (
                              <a
                                key={idx}
                                href={s.url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FFF5EE] text-[#F06529] border border-[#F06529]/20 hover:underline"
                              >
                                <span>{s.title}</span>
                                <FiExternalLink className="text-[10px]" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Download Individual Response as Research Paper PDF & Audio Read Aloud */}
                      {msg.role === "assistant" && msg.content !== "..." && (
                        <div className="mt-3 pt-2 border-t border-[#F06529]/15 flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => toggleSpeak(msg.id, msg.content, "en-IN")}
                              className={`px-2.5 py-1 rounded-[10px] text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                                playingMsgId === msg.id
                                  ? "bg-[#F06529] text-white animate-pulse"
                                  : "bg-[#FFF5EE] hover:bg-[#FFEADA] text-[#F06529] border border-[#F06529]/20"
                              }`}
                              title={playingMsgId === msg.id ? "Stop Audio" : "Read Aloud"}
                            >
                              {loadingAudioId === msg.id ? (
                                <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                              ) : playingMsgId === msg.id ? (
                                <>
                                  <FaStop className="text-[10px]" />
                                  <span>Stop</span>
                                </>
                              ) : (
                                <>
                                  <FaVolumeUp className="text-[11px]" />
                                  <span>Read Aloud</span>
                                </>
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                const msgIndex = messages.findIndex((m) => m.id === msg.id);
                                let userPrompt = "";
                                for (let pIdx = msgIndex - 1; pIdx >= 0; pIdx--) {
                                  if (messages[pIdx].role === "user") {
                                    userPrompt = messages[pIdx].content;
                                    break;
                                  }
                                }
                                exportSingleResponsePdf(
                                  userPrompt,
                                  msg.content,
                                  siteEnvironment,
                                  "Gemma-2B-IT WebGPU"
                                );
                              }}
                              title="Download this response as a black-and-white research paper PDF (monospace, 1-inch margins)"
                              className="px-2.5 py-1 rounded-[10px] bg-black hover:bg-neutral-800 active:scale-95 text-white font-mono text-[10px] font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                            >
                              <FiFileText className="text-[11px]" />
                              <span>Download Response (PDF)</span>
                            </button>
                          </div>

                          <span className="text-[9px] font-mono text-[#8C939F] uppercase">
                            Monospace • 1in Margins
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Action Bar (Stop, Clear & Export) */}
            <div className="flex items-center justify-between pt-2 border-t border-[#F06529]/10 mt-2 px-1">
              <div className="flex items-center gap-2">
                {isGenerating ? (
                  <button
                    type="button"
                    onClick={handleStopGeneration}
                    className="px-3.5 py-1.5 rounded-full bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer border border-red-200"
                  >
                    <FiStopCircle />
                    <span>Stop Generation</span>
                  </button>
                ) : (
                  messages.length > 0 && (
                    <button
                      type="button"
                      onClick={() => exportFullChatPdf(messages, siteEnvironment, "Gemma-2B-IT WebGPU")}
                      className="px-3 py-1 rounded-full bg-black hover:bg-neutral-800 text-white font-mono text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                    >
                      <FiFileText />
                      <span>Export Full Chat (PDF)</span>
                    </button>
                  )
                )}
              </div>

              <span className="text-[11px] text-[#8C939F]">
                {modelState === "ready"
                  ? "Raghav is ready for structural calculations"
                  : "Awaiting local model load"}
              </span>

              {messages.length > 0 && !isGenerating && (
                <button
                  type="button"
                  onClick={handleClearChat}
                  className="text-xs font-semibold text-[#8C939F] hover:text-[#F06529] flex items-center gap-1 cursor-pointer transition-colors sm:hidden"
                >
                  <FiTrash2 className="text-xs" />
                  <span>Clear</span>
                </button>
              )}
            </div>

            {/* Input Form with Multi-line Textarea */}
            <form
              onSubmit={handleSendMessage}
              className="flex items-end gap-2.5 pt-2"
            >
              <textarea
                ref={textareaRef}
                rows={1}
                placeholder={
                  modelState === "ready"
                    ? "Enter engineering problem or calculation (e.g., Development length for M25, IS 456 slab design)..."
                    : "Load AI Model on the left to start calculating..."
                }
                value={inputPrompt}
                disabled={modelState !== "ready" || isGenerating}
                onChange={(e) => {
                  setInputPrompt(e.target.value);
                  if (textareaRef.current) {
                    textareaRef.current.style.height = "auto";
                    textareaRef.current.style.height = `${Math.min(
                      textareaRef.current.scrollHeight,
                      180
                    )}px`;
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                className="flex-1 py-3 px-4 rounded-[20px] bg-[#FFF5EE] text-xs sm:text-sm text-[#181A1E] placeholder-[#8C939F] border border-[#F06529]/20 shadow-[inset_1px_1px_3px_rgba(240,101,41,0.08)] outline-none focus:border-[#F06529] disabled:opacity-50 resize-none min-h-[48px] max-h-[180px] leading-relaxed transition-all"
              />

              <button
                type="submit"
                disabled={
                  modelState !== "ready" || isGenerating || !inputPrompt.trim()
                }
                aria-label="Send message to Raghav"
                className="w-12 h-12 shrink-0 rounded-[16px] bg-[#F06529] hover:bg-[#DF5316] text-white flex items-center justify-center text-base shadow-[3px_5px_12px_rgba(240,101,41,0.35),inset_1.5px_1.5px_3px_rgba(255,255,255,0.55),inset_-1.5px_-1.5px_3px_rgba(160,45,10,0.35)] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.96] mb-0.5"
              >
                <FiSend />
              </button>
            </form>
          </section>
        </div>

        {/* Footer Note */}
        <p className="text-center text-[10px] sm:text-xs font-semibold text-[#8C939F] pb-1 shrink-0">
          Raghav is an engineering peer co-pilot • All calculations strictly comply with Indian Standards (IS 456, IS 1893, IS 13920).
        </p>
      </main>
    </div>
  );
}
