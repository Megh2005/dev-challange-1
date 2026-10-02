"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  FaHardHat,
  FaCamera,
  FaVolumeUp,
  FaStop,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaCloudSun,
  FaArrowLeft,
  FaRedo,
  FaHistory,
  FaMapMarkerAlt,
} from "react-icons/fa";
import {
  FiCheck,
  FiAlertCircle,
  FiTool,
  FiLayers,
  FiShield,
  FiGlobe,
  FiLoader,
  FiDownload,
  FiUploadCloud,
  FiClock,
  FiSun,
  FiDroplet,
  FiWind,
  FiFileText,
  FiActivity,
  FiCheckSquare,
} from "react-icons/fi";
import { useTextToSpeech } from "@/lib/useTextToSpeech";
import { SUPPORTED_LANGUAGES } from "@/lib/languages";
import { jsPDF } from "jspdf";

const TRADES = [
  {
    id: "steel",
    name: "Steel & Rebar",
    icon: FiLayers,
    desc: "Cover blocks, stirrups, laps",
    code: "IS 456:2000",
  },
  {
    id: "concrete",
    name: "Concrete Pour",
    icon: FiTool,
    desc: "Vibration, honeycomb, curing",
    code: "IS 456 / IS 7861",
  },
  {
    id: "shuttering",
    name: "Formwork & Props",
    icon: FiTool,
    desc: "Verticality, slurry leaks, props",
    code: "IS 14687",
  },
  {
    id: "brickwork",
    name: "Masonry & Plaster",
    icon: FiLayers,
    desc: "Plumb line, mortar thickness",
    code: "IS 1905 / IS 2212",
  },
  {
    id: "safety",
    name: "Site Safety & PPE",
    icon: FiShield,
    desc: "Helmets, harnesses, scaffolding",
    code: "IS 3696 / BOCW",
  },
];

interface InspectionData {
  status: "PASS" | "NEEDS_ATTENTION" | "CRITICAL_FAIL";
  title: string;
  summary: string;
  correctiveSteps: string[];
  goodPoints: string[];
  engineerAudit: {
    defectType: string;
    isCodeRef: string;
    severity: "Low" | "Medium" | "High";
    technicalRootCause: string;
    actionRequired: string;
  };
  weatherPrecaution?: string;
}

interface AuditRecord {
  id: string;
  trade: string;
  status: "PASS" | "NEEDS_ATTENTION" | "CRITICAL_FAIL";
  title: string;
  summary: string;
  correctiveSteps: string[];
  engineerAudit: {
    defectType?: string;
    isCodeRef?: string;
    severity?: "Low" | "Medium" | "High";
  };
  weather?: {
    temp: number;
    condition: string;
    cityName: string;
  };
  createdAt: string;
}

// Client-side image compressor to prevent payload errors and speed up vision processing
function compressImageFile(file: File, maxWidth = 1280, maxHeight = 1280, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target?.result as string;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(img.src);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

export default function SiteVisionPage() {
  const [selectedTrade, setSelectedTrade] = useState<string>("steel");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [inspectionResult, setInspectionResult] = useState<InspectionData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [activeDossierTab, setActiveDossierTab] = useState<"supervisor" | "engineer">("supervisor");
  const [mainView, setMainView] = useState<"inspect" | "history">("inspect");

  // Geolocation & Weather
  const [userLocation, setUserLocation] = useState<{ lat?: number; lon?: number; city?: string }>({});
  const [siteWeather, setSiteWeather] = useState<any>(null);
  const [isDetectingLocation, setIsDetectingLocation] = useState<boolean>(false);

  // Multilingual & Audio
  const [currentLang, setCurrentLang] = useState<string>("en");
  const [translatedSummary, setTranslatedSummary] = useState<string>("");
  const [isTranslating, setIsTranslating] = useState<boolean>(false);

  // Past Audits History
  const [auditHistory, setAuditHistory] = useState<AuditRecord[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(false);

  // Drag and Drop State
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const { playingMsgId, loadingAudioId, toggleSpeak, stopAudio } = useTextToSpeech();

  // Detect site GPS coordinates on mount
  useEffect(() => {
    if (typeof window !== "undefined" && navigator.geolocation) {
      setIsDetectingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
          });
          setIsDetectingLocation(false);
        },
        () => {
          setIsDetectingLocation(false);
        },
        { timeout: 7000 }
      );
    }
  }, []);

  // Fetch real audit history from MongoDB
  const fetchAuditHistory = useCallback(async () => {
    setIsLoadingHistory(true);
    try {
      const res = await fetch("/api/sitevision/history");
      const data = await res.json();
      if (data.success && Array.isArray(data.audits)) {
        setAuditHistory(data.audits);
      }
    } catch (err) {
      console.warn("Could not load history:", err);
    } finally {
      setIsLoadingHistory(false);
    }
  }, []);

  useEffect(() => {
    if (mainView === "history") {
      fetchAuditHistory();
    }
  }, [mainView, fetchAuditHistory]);

  // Process selected file
  const processImageFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please upload a valid site photo (JPEG, PNG, or WebP).");
      return;
    }

    try {
      const compressedDataUrl = await compressImageFile(file);
      setImagePreview(compressedDataUrl);
      setInspectionResult(null);
      setErrorMsg("");
      analyzePhoto(compressedDataUrl, selectedTrade);
    } catch (err) {
      console.error("Compression error:", err);
      setErrorMsg("Could not read image file. Please try again.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  // Drag and Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  // Run Vision Inspection
  const analyzePhoto = async (base64Img: string, trade: string) => {
    setIsAnalyzing(true);
    setErrorMsg("");
    stopAudio();

    try {
      const res = await fetch("/api/sitevision/inspect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: base64Img,
          trade,
          lat: userLocation.lat,
          lon: userLocation.lon,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to inspect photo.");
      }

      setInspectionResult(data.inspection);
      setSiteWeather(data.weather);
      setTranslatedSummary(data.inspection.summary);
      setCurrentLang("en");
    } catch (err: any) {
      console.error("Inspection error:", err);
      setErrorMsg(
        err.message || "Could not analyze the photo. Please ensure good lighting and try again."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Switch Audio Language
  const handleLanguageChange = async (targetLang: string) => {
    if (!inspectionResult) return;
    if (currentLang === targetLang) return;

    stopAudio();
    setCurrentLang(targetLang);

    if (targetLang === "en") {
      setTranslatedSummary(inspectionResult.summary);
      return;
    }

    setIsTranslating(true);
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: inspectionResult.summary,
          targetLang,
        }),
      });

      const data = await res.json();
      if (data.success && data.translatedText) {
        setTranslatedSummary(data.translatedText);
      } else {
        setTranslatedSummary(inspectionResult.summary);
      }
    } catch (err) {
      console.error("Translation error:", err);
      setTranslatedSummary(inspectionResult.summary);
    } finally {
      setIsTranslating(false);
    }
  };

  // Audio Playback
  const handleToggleVoice = () => {
    if (!inspectionResult) return;
    const speechText = translatedSummary || inspectionResult.summary;
    toggleSpeak("sitevision-advice", speechText, currentLang);
  };

  // Export PDF
  const handleExportPDF = () => {
    if (!inspectionResult) return;

    const doc = new jsPDF();
    const dateStr = new Date().toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    // Top Header Banner
    doc.setFillColor(240, 101, 41);
    doc.rect(0, 0, 210, 32, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("SHRAMPARK SITEVISION - QUALITY & SAFETY AUDIT", 14, 18);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(`Doc ID: AUD-${Date.now().toString().slice(-6)} | Certified Inspection Log`, 14, 25);

    // Meta Block
    doc.setTextColor(24, 26, 30);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("INSPECTION METADATA", 14, 44);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(`Date & Time: ${dateStr}`, 14, 52);
    doc.text(`Trade Category: ${selectedTrade.toUpperCase()}`, 14, 59);
    doc.text(`Audit Status: ${inspectionResult.status}`, 14, 66);
    doc.text(`Severity Level: ${inspectionResult.engineerAudit.severity}`, 14, 73);
    doc.text(`Standard (IS Code): ${inspectionResult.engineerAudit.isCodeRef}`, 14, 80);

    if (siteWeather) {
      doc.text(
        `Weather: ${siteWeather.temp}°C, Humidity ${siteWeather.humidity}%, Wind ${siteWeather.windSpeed} km/h (${siteWeather.cityName})`,
        14,
        87
      );
    }

    // Technical Assessment
    doc.setFont("helvetica", "bold");
    doc.text("TECHNICAL DEFECT ASSESSMENT:", 14, 101);
    doc.setFont("helvetica", "normal");
    doc.text(`Defect Name: ${inspectionResult.engineerAudit.defectType}`, 14, 108);

    const rootLines = doc.splitTextToSize(
      `Root Cause: ${inspectionResult.engineerAudit.technicalRootCause}`,
      180
    );
    doc.text(rootLines, 14, 115);

    const actionY = 115 + rootLines.length * 5 + 6;
    doc.setFont("helvetica", "bold");
    doc.text("MANDATORY RECTIFICATION REQUIRED:", 14, actionY);
    doc.setFont("helvetica", "normal");
    const actionLines = doc.splitTextToSize(
      inspectionResult.engineerAudit.actionRequired,
      180
    );
    doc.text(actionLines, 14, actionY + 6);

    // Corrective Checklist
    const listY = actionY + 6 + actionLines.length * 5 + 6;
    doc.setFont("helvetica", "bold");
    doc.text("ON-SITE CORRECTIVE ACTION CHECKLIST:", 14, listY);
    doc.setFont("helvetica", "normal");
    let stepY = listY + 7;
    inspectionResult.correctiveSteps.forEach((step, idx) => {
      doc.text(`[ ] ${idx + 1}. ${step}`, 14, stepY);
      stepY += 6;
    });

    // Signature Sign-off Boxes
    const sigY = Math.max(stepY + 12, 235);
    doc.setDrawColor(210, 210, 210);
    doc.rect(14, sigY, 85, 26);
    doc.text("Site Quality Engineer Signature:", 18, sigY + 8);
    doc.text("Date: _________________________", 18, sigY + 22);

    doc.rect(110, sigY, 85, 26);
    doc.text("Site Project Supervisor Sign-Off:", 114, sigY + 8);
    doc.text("Date: _________________________", 114, sigY + 22);

    doc.save(`sitevision_audit_${selectedTrade}_${Date.now()}.pdf`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PASS":
        return {
          badgeClass: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30",
          headerBg: "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white",
          label: "APPROVED - COMPLIANT WITH IS CODES",
          icon: FaCheckCircle,
        };
      case "CRITICAL_FAIL":
        return {
          badgeClass: "bg-red-500/10 text-red-700 border-red-500/30",
          headerBg: "bg-gradient-to-r from-red-600 to-rose-700 text-white",
          label: "CRITICAL DEFECT - WORK STOPPAGE MANDATORY",
          icon: FaTimesCircle,
        };
      default:
        return {
          badgeClass: "bg-amber-500/10 text-amber-700 border-amber-500/30",
          headerBg: "bg-gradient-to-r from-amber-500 to-orange-600 text-white",
          label: "ATTENTION REQUIRED - RECTIFY BEFORE POUR",
          icon: FaExclamationTriangle,
        };
    }
  };

  const statusInfo = inspectionResult ? getStatusBadge(inspectionResult.status) : null;
  const isSpeaking = playingMsgId === "sitevision-advice";
  const selectedTradeObj = TRADES.find((t) => t.id === selectedTrade) || TRADES[0];

  return (
    <div className="flex-1 w-full min-h-[calc(100vh-72px)] bg-[#FDFBF7] py-4 sm:py-6 px-3 sm:px-6 lg:px-8 antialiased flex flex-col">
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-4 flex-1">
        
        {/* TOP STATUS & VIEW SWITCHER BAR */}
        <section className="w-full bg-white rounded-[24px] p-4 sm:px-6 shadow-[0_4px_16px_rgba(240,101,41,0.06),inset_1.5px_1.5px_3px_#FFFFFF] border border-[#F06529]/15 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-xl bg-[#FFF5EE] text-[#F06529] hover:bg-[#FFE8D6] transition-colors border border-[#F06529]/20"
              title="Return to Home"
            >
              <FaArrowLeft className="text-sm" />
            </Link>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-[14px] bg-[#F06529] text-white flex items-center justify-center text-lg shadow-[2px_4px_10px_rgba(240,101,41,0.3)] shrink-0">
                <FaCamera />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-black text-[#181A1E] tracking-tight">
                    SiteVision
                  </h1>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                    Live Vision Engine
                  </span>
                </div>
                <p className="text-[11px] text-[#6B7280] font-medium hidden sm:block">
                  AI Visual Quality Auditor & Site Safety Co-Pilot
                </p>
              </div>
            </div>
          </div>

          {/* Guided View Switcher */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-[#FFF5EE] p-1 rounded-2xl border border-[#F06529]/20">
              <button
                type="button"
                onClick={() => setMainView("inspect")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                  mainView === "inspect"
                    ? "bg-[#F06529] text-white shadow-xs"
                    : "text-[#555A64] hover:text-[#181A1E]"
                }`}
              >
                <FiActivity className="text-xs" />
                <span>Inspection Console</span>
              </button>
              <button
                type="button"
                onClick={() => setMainView("history")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                  mainView === "history"
                    ? "bg-[#2B231D] text-white shadow-xs"
                    : "text-[#555A64] hover:text-[#181A1E]"
                }`}
              >
                <FaHistory className="text-xs" />
                <span>Audit History</span>
              </button>
            </div>
          </div>
        </section>

        {/* GUIDED 3-STEP PROGRESS STEPPER (VISUAL WALKTHROUGH) */}
        {mainView === "inspect" && (
          <div className="w-full bg-white rounded-[20px] p-3 sm:px-6 border border-[#F06529]/15 shadow-xs flex items-center justify-between gap-2 overflow-x-auto">
            {/* Step 1 */}
            <div className="flex items-center gap-2 shrink-0">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${
                  selectedTrade ? "bg-[#F06529] text-white" : "bg-stone-100 text-stone-500"
                }`}
              >
                1
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-extrabold text-[#181A1E] leading-tight">
                  Select Trade
                </span>
                <span className="text-[10px] text-[#F06529] font-bold">
                  {selectedTradeObj.name}
                </span>
              </div>
            </div>

            <div className="h-0.5 w-6 sm:w-16 bg-stone-200 shrink-0" />

            {/* Step 2 */}
            <div className="flex items-center gap-2 shrink-0">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${
                  imagePreview ? "bg-[#F06529] text-white" : "bg-stone-100 text-stone-500"
                }`}
              >
                2
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-extrabold text-[#181A1E] leading-tight">
                  Capture Site Photo
                </span>
                <span className="text-[10px] text-[#8C939F] font-semibold">
                  {imagePreview ? "Photo Loaded" : "Camera / File"}
                </span>
              </div>
            </div>

            <div className="h-0.5 w-6 sm:w-16 bg-stone-200 shrink-0" />

            {/* Step 3 */}
            <div className="flex items-center gap-2 shrink-0">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${
                  inspectionResult
                    ? "bg-emerald-600 text-white"
                    : isAnalyzing
                    ? "bg-amber-500 text-white animate-spin"
                    : "bg-stone-100 text-stone-500"
                }`}
              >
                3
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-extrabold text-[#181A1E] leading-tight">
                  Audit Verdict
                </span>
                <span className="text-[10px] text-[#8C939F] font-semibold">
                  {inspectionResult
                    ? inspectionResult.status
                    : isAnalyzing
                    ? "Analyzing..."
                    : "Awaiting Capture"}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* WORKBENCH BODY: 2-COLUMN ON LAPTOP (lg:), STACKED ON MOBILE */}
        {mainView === "inspect" && (
          <div className="w-full flex-1 flex flex-col lg:flex-row gap-5 min-h-0 items-start">
            
            {/* LEFT CONTROL PANEL: TRADE SELECTOR & VIEWFINDER */}
            <aside className="w-full lg:w-[410px] lg:shrink-0 flex flex-col gap-4">
              
              {/* STEP 1 CARD: TRADE SELECTOR */}
              <div className="w-full bg-white rounded-[24px] p-4 sm:p-5 shadow-[0_6px_18px_rgba(240,101,41,0.06),inset_1.5px_1.5px_3px_#FFFFFF] border border-[#F06529]/15 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-[#181A1E] flex items-center gap-1.5">
                    <FiTool className="text-[#F06529]" />
                    Step 1: Choose Trade Category
                  </span>
                  <span className="text-[10px] font-bold text-[#F06529] bg-[#FFF5EE] px-2 py-0.5 rounded-md border border-[#F06529]/20">
                    {selectedTradeObj.code}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
                  {TRADES.map((trade) => {
                    const Icon = trade.icon;
                    const isSelected = selectedTrade === trade.id;
                    return (
                      <button
                        key={trade.id}
                        type="button"
                        onClick={() => {
                          setSelectedTrade(trade.id);
                          if (imagePreview) {
                            analyzePhoto(imagePreview, trade.id);
                          }
                        }}
                        className={`p-3 rounded-2xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#F06529] text-white border-[#F06529] shadow-sm"
                            : "bg-[#FAF8F5]/80 hover:bg-[#FFF5EE] text-[#181A1E] border-stone-200"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0 ${
                              isSelected ? "bg-white/20 text-white" : "bg-white text-[#F06529] shadow-2xs"
                            }`}
                          >
                            <Icon />
                          </div>
                          <div>
                            <p className="text-xs font-extrabold leading-tight">
                              {trade.name}
                            </p>
                            <p
                              className={`text-[10px] mt-0.5 ${
                                isSelected ? "text-white/80" : "text-[#8C939F]"
                              }`}
                            >
                              {trade.desc}
                            </p>
                          </div>
                        </div>
                        {isSelected && <FiCheck className="text-base text-white shrink-0 mr-1" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* STEP 2 CARD: CAMERA VIEWFINDER & DROPZONE */}
              <div className="w-full bg-white rounded-[24px] p-4 sm:p-5 shadow-[0_6px_18px_rgba(240,101,41,0.06),inset_1.5px_1.5px_3px_#FFFFFF] border border-[#F06529]/15 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-[#181A1E] flex items-center gap-1.5">
                    <FaCamera className="text-[#F06529]" />
                    Step 2: Capture Site Photo
                  </span>
                  {imagePreview && (
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setInspectionResult(null);
                        setErrorMsg("");
                      }}
                      className="text-[11px] font-bold text-stone-500 hover:text-red-600 underline"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Hidden Real Inputs */}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/png,image/jpeg,image/webp,image/heic"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <input
                  type="file"
                  ref={cameraInputRef}
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {!imagePreview ? (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`relative w-full rounded-[22px] p-6 border-2 border-dashed flex flex-col items-center justify-center gap-4 transition-all text-center ${
                      isDragging
                        ? "border-[#F06529] bg-[#FFF5EE]"
                        : "border-stone-200 hover:border-[#F06529]/40 bg-[#FAF8F5]/70"
                    }`}
                  >
                    {/* Viewfinder Crosshairs UI */}
                    <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#F06529]/50 rounded-tl" />
                    <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#F06529]/50 rounded-tr" />
                    <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#F06529]/50 rounded-bl" />
                    <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#F06529]/50 rounded-br" />

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => cameraInputRef.current?.click()}
                        className="px-4 py-3 rounded-2xl bg-[#F06529] hover:bg-[#D9531E] active:scale-95 text-white font-black text-xs flex items-center gap-2 shadow-md shadow-[#F06529]/25 transition-all cursor-pointer"
                      >
                        <FaCamera className="text-base" />
                        <span>Camera</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-3 rounded-2xl bg-[#2B231D] hover:bg-black active:scale-95 text-white font-black text-xs flex items-center gap-2 shadow-md shadow-black/15 transition-all cursor-pointer"
                      >
                        <FiUploadCloud className="text-base" />
                        <span>Upload</span>
                      </button>
                    </div>

                    <div className="flex flex-col items-center">
                      <p className="text-xs font-bold text-[#181A1E]">
                        Tap to open camera or drop image file
                      </p>
                      <p className="text-[10px] text-[#8C939F] mt-0.5">
                        High-resolution images are compressed automatically
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="relative w-full rounded-2xl overflow-hidden border border-stone-300 bg-stone-900 shadow-inner flex flex-col">
                    {/* Viewfinder Frame */}
                    <div className="relative w-full h-56">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imagePreview}
                        alt="Site Inspection Preview"
                        className="w-full h-full object-cover"
                      />

                      {/* Scanning Laser Line when analyzing */}
                      {isAnalyzing && (
                        <div className="absolute inset-x-0 h-1 bg-[#F06529] shadow-[0_0_12px_#F06529] animate-bounce top-1/2" />
                      )}

                      {/* HUD Overlay Stamp */}
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs text-[10px] font-mono text-white font-bold flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>{selectedTrade.toUpperCase()} FIELD SCAN</span>
                      </div>
                    </div>

                    {/* Toolbar underneath the viewfinder */}
                    <div className="p-2.5 bg-[#2B231D] text-white flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => cameraInputRef.current?.click()}
                        className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <FaCamera className="text-xs" />
                        <span>Retake</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <FiUploadCloud className="text-xs" />
                        <span>Browse</span>
                      </button>
                      <button
                        type="button"
                        disabled={isAnalyzing}
                        onClick={() => analyzePhoto(imagePreview, selectedTrade)}
                        className="px-3 py-1 rounded-lg bg-[#F06529] hover:bg-[#D9531E] text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer ml-auto"
                      >
                        <FaRedo className={`text-[10px] ${isAnalyzing ? "animate-spin" : ""}`} />
                        <span>Re-inspect</span>
                      </button>
                    </div>
                  </div>
                )}

                {errorMsg && (
                  <div className="w-full p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
                    <FiAlertCircle className="text-base shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}
              </div>

              {/* CARD 3: REAL-TIME SITE TELEMETRY (WEATHER) */}
              <div className="w-full bg-white rounded-[24px] p-4 shadow-[0_6px_18px_rgba(240,101,41,0.06),inset_1.5px_1.5px_3px_#FFFFFF] border border-[#F06529]/15 flex flex-col gap-2.5">
                <div className="flex items-center justify-between text-xs font-black text-[#181A1E]">
                  <div className="flex items-center gap-1.5 text-[#F06529]">
                    <FaMapMarkerAlt className="text-xs shrink-0" />
                    <span>Site Environment Telemetry</span>
                  </div>
                  {isDetectingLocation && (
                    <span className="text-[10px] font-semibold text-[#8C939F] animate-pulse">
                      Acquiring GPS...
                    </span>
                  )}
                </div>

                {siteWeather ? (
                  <div className="flex flex-col gap-2">
                    <div className="text-xs font-bold text-[#181A1E]">
                      {siteWeather.cityName} ({siteWeather.condition})
                    </div>
                    <div className="grid grid-cols-3 gap-1.5 text-center text-xs">
                      <div className="p-2 rounded-xl bg-[#FFF5EE] flex flex-col items-center">
                        <FiSun className="text-amber-500 mb-0.5 text-sm" />
                        <span className="font-black text-[#181A1E]">{siteWeather.temp}°C</span>
                        <span className="text-[9px] text-[#8C939F]">Temp</span>
                      </div>
                      <div className="p-2 rounded-xl bg-[#FFF5EE] flex flex-col items-center">
                        <FiDroplet className="text-sky-500 mb-0.5 text-sm" />
                        <span className="font-black text-[#181A1E]">{siteWeather.humidity}%</span>
                        <span className="text-[9px] text-[#8C939F]">Humidity</span>
                      </div>
                      <div className="p-2 rounded-xl bg-[#FFF5EE] flex flex-col items-center">
                        <FiWind className="text-teal-600 mb-0.5 text-sm" />
                        <span className="font-black text-[#181A1E]">{siteWeather.windSpeed} km/h</span>
                        <span className="text-[9px] text-[#8C939F]">Wind</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-[11px] text-[#8C939F] font-medium leading-relaxed">
                    Live GPS coordinates are automatically factored into concrete curing and scaffolding wind checks.
                  </p>
                )}
              </div>
            </aside>

            {/* RIGHT PANEL: INSPECTION DOSSIER & VERDICT CONSOLE */}
            <section className="flex-1 w-full flex flex-col gap-4 min-w-0">
              
              {/* STATE 1: WAITING FOR PHOTO (GUIDED EXPLANATION) */}
              {!imagePreview && !isAnalyzing && (
                <div className="w-full bg-white rounded-[28px] p-6 sm:p-8 shadow-[0_8px_24px_rgba(240,101,41,0.06),inset_1.5px_1.5px_3px_#FFFFFF] border border-[#F06529]/15 flex flex-col gap-6">
                  <div>
                    <h2 className="text-lg sm:text-xl font-black text-[#181A1E] tracking-tight">
                      Guided Civil Quality & Safety Verification
                    </h2>
                    <p className="text-xs sm:text-sm text-[#555A64] font-medium leading-relaxed mt-1">
                      SiteVision visually checks craftsmanship against Indian Standards (IS Codes) and translates engineering rules into practical spoken advice for site workers.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="p-4 rounded-2xl bg-[#FFF8F4] border border-[#F06529]/15 flex flex-col gap-1.5">
                      <span className="text-xs font-black text-[#F06529] flex items-center gap-1.5">
                        <FiLayers /> Rebar & Concrete Inspection
                      </span>
                      <p className="text-xs text-[#555A64] leading-relaxed">
                        Detects missing cover blocks, stirrup hook angles, honeycombing voids, and cold joints per <strong>IS 456:2000</strong>.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#FFF8F4] border border-[#F06529]/15 flex flex-col gap-1.5">
                      <span className="text-xs font-black text-[#F06529] flex items-center gap-1.5">
                        <FiShield /> Scaffolding & Height Safety
                      </span>
                      <p className="text-xs text-[#555A64] leading-relaxed">
                        Verifies base plates, diagonal bracing, guardrails, and full-body harness tie-off compliance per <strong>IS 3696</strong>.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#FFF8F4] border border-[#F06529]/15 flex flex-col gap-1.5">
                      <span className="text-xs font-black text-[#F06529] flex items-center gap-1.5">
                        <FiTool /> Formwork & Shuttering Props
                      </span>
                      <p className="text-xs text-[#555A64] leading-relaxed">
                        Inspects prop plumbness, tie-rod tightness, and slurry leakage gaps to prevent slab deflection.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#FFF8F4] border border-[#F06529]/15 flex flex-col gap-1.5">
                      <span className="text-xs font-black text-[#F06529] flex items-center gap-1.5">
                        <FiGlobe /> Multilingual Audio Coaching
                      </span>
                      <p className="text-xs text-[#555A64] leading-relaxed">
                        Instant spoken-word tutorial in 5 languages (English, Hindi, Bengali, Tamil, Malayalam) explaining what to fix.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-center gap-3 text-xs text-[#555A64]">
                    <div className="w-8 h-8 rounded-full bg-[#F06529]/10 text-[#F06529] flex items-center justify-center font-black shrink-0">
                      👉
                    </div>
                    <span>
                      Select a trade on the left and tap <strong>Camera</strong> to begin live inspection.
                    </span>
                  </div>
                </div>
              )}

              {/* STATE 2: SCANNING / ANALYZING */}
              {isAnalyzing && (
                <div className="w-full bg-white rounded-[28px] p-8 sm:p-12 shadow-[0_8px_24px_rgba(240,101,41,0.06),inset_1.5px_1.5px_3px_#FFFFFF] border border-[#F06529]/15 flex flex-col items-center justify-center gap-4 text-center">
                  <div className="relative w-16 h-16 rounded-2xl bg-[#FFF5EE] border border-[#F06529]/30 flex items-center justify-center text-2xl text-[#F06529]">
                    <FiLoader className="animate-spin text-3xl" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-[#181A1E]">
                      Gemini Vision is Auditing Construction Frame
                    </h3>
                    <p className="text-xs text-[#6B7280] font-medium mt-1 max-w-sm">
                      Cross-referencing {selectedTradeObj.name} against {selectedTradeObj.code} and local site weather conditions...
                    </p>
                  </div>
                </div>
              )}

              {/* STATE 3: AUDIT RESULTS READY */}
              {inspectionResult && statusInfo && !isAnalyzing && (
                <div className="w-full flex flex-col gap-4 animate-in fade-in duration-300">
                  
                  {/* VERDICT HERO BANNER */}
                  <div className={`w-full p-5 sm:p-6 rounded-[28px] ${statusInfo.headerBg} shadow-md flex flex-wrap items-center justify-between gap-3`}>
                    <div className="flex items-center gap-3.5">
                      <statusInfo.icon className="text-3xl sm:text-4xl shrink-0" />
                      <div>
                        <h2 className="text-lg sm:text-xl font-black tracking-tight leading-snug">
                          {inspectionResult.title}
                        </h2>
                        <p className="text-xs font-bold opacity-90">
                          {statusInfo.label}
                        </p>
                      </div>
                    </div>
                    <span className="px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-white/20 border border-white/30 shrink-0">
                      {inspectionResult.status}
                    </span>
                  </div>

                  {/* MULTILINGUAL AUDIO PLAYER BAR */}
                  <div className="w-full bg-white rounded-[24px] p-4 sm:p-5 shadow-xs border border-[#F06529]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] font-extrabold text-[#8C939F] mr-1 flex items-center gap-1">
                        <FiGlobe className="text-xs" /> Translate Audio:
                      </span>
                      {SUPPORTED_LANGUAGES.map((lang) => (
                        <button
                          key={lang.code}
                          type="button"
                          onClick={() => handleLanguageChange(lang.code)}
                          disabled={isTranslating}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                            currentLang === lang.code
                              ? "bg-[#2B231D] text-white border-[#2B231D]"
                              : "bg-[#FFF5EE] text-[#555A64] border-stone-200 hover:bg-[#FFEADA]"
                          }`}
                        >
                          {lang.label}
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={handleToggleVoice}
                      disabled={isTranslating}
                      className={`px-5 py-2.5 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
                        isSpeaking
                          ? "bg-[#2B231D] text-white animate-pulse"
                          : "bg-[#F06529] hover:bg-[#D9531E] text-white shadow-[#F06529]/25"
                      }`}
                    >
                      {loadingAudioId === "sitevision-advice" ? (
                        <FiLoader className="animate-spin text-base" />
                      ) : isSpeaking ? (
                        <>
                          <FaStop className="text-sm" />
                          <span>Stop Audio</span>
                        </>
                      ) : (
                        <>
                          <FaVolumeUp className="text-base" />
                          <span>Read Aloud (Voice Advice)</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* DOSSIER TABS (WORKER ACTION CARD vs ENGINEER AUDIT SLIP) */}
                  <div className="w-full bg-white rounded-[28px] p-5 sm:p-6 shadow-[0_8px_24px_rgba(240,101,41,0.06),inset_1.5px_1.5px_3px_#FFFFFF] border border-[#F06529]/15 flex flex-col gap-5">
                    
                    {/* Tab Navigation */}
                    <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                      <div className="flex items-center gap-2 bg-[#FFF5EE] p-1 rounded-2xl border border-[#F06529]/20">
                        <button
                          type="button"
                          onClick={() => setActiveDossierTab("supervisor")}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                            activeDossierTab === "supervisor"
                              ? "bg-[#F06529] text-white shadow-xs"
                              : "text-[#555A64] hover:text-[#181A1E]"
                          }`}
                        >
                          Supervisor Field Actions
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveDossierTab("engineer")}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                            activeDossierTab === "engineer"
                              ? "bg-[#2B231D] text-white shadow-xs"
                              : "text-[#555A64] hover:text-[#181A1E]"
                          }`}
                        >
                          Engineer Code Audit
                        </button>
                      </div>

                      {activeDossierTab === "engineer" && (
                        <button
                          type="button"
                          onClick={handleExportPDF}
                          className="px-3.5 py-1.5 rounded-xl bg-[#2B231D] hover:bg-black text-white text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                        >
                          <FiDownload className="text-xs" />
                          <span>Export PDF Slip</span>
                        </button>
                      )}
                    </div>

                    {/* TAB 1: SUPERVISOR FIELD ACTIONS */}
                    {activeDossierTab === "supervisor" && (
                      <div className="flex flex-col gap-4">
                        <div className="p-4 rounded-2xl bg-[#FFF8F4] border border-[#F06529]/15">
                          <p className="text-xs font-bold text-[#8C939F] uppercase tracking-wider mb-1">
                            Field Summary
                          </p>
                          <p className="text-sm font-bold text-[#181A1E] leading-relaxed">
                            {translatedSummary || inspectionResult.summary}
                          </p>
                        </div>

                        {/* Corrective Action Steps */}
                        {inspectionResult.correctiveSteps.length > 0 && (
                          <div className="flex flex-col gap-2">
                            <h3 className="text-xs font-black text-[#8C939F] uppercase tracking-wider">
                              ⚠️ Mandatory Rectification Steps
                            </h3>
                            <div className="flex flex-col gap-2">
                              {inspectionResult.correctiveSteps.map((step, idx) => (
                                <div
                                  key={idx}
                                  className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 font-bold text-xs flex items-start gap-2.5"
                                >
                                  <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5 font-black">
                                    {idx + 1}
                                  </span>
                                  <span className="leading-relaxed">{step}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Approved Workmanship Points */}
                        {inspectionResult.goodPoints.length > 0 && (
                          <div className="flex flex-col gap-2">
                            <h3 className="text-xs font-black text-[#8C939F] uppercase tracking-wider">
                              ✅ Approved Craftsmanship Observed
                            </h3>
                            <div className="flex flex-col gap-1.5">
                              {inspectionResult.goodPoints.map((pt, idx) => (
                                <div
                                  key={idx}
                                  className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-semibold text-xs flex items-center gap-2"
                                >
                                  <FiCheck className="text-emerald-600 shrink-0 text-sm" />
                                  <span>{pt}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Weather-Aware Caution */}
                        {inspectionResult.weatherPrecaution && (
                          <div className="p-3.5 rounded-2xl bg-[#FFF5EE] border border-[#F06529]/20 flex items-center gap-2.5 text-xs text-[#F06529] font-bold">
                            <FaCloudSun className="text-lg shrink-0" />
                            <span>Weather Alert: {inspectionResult.weatherPrecaution}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* TAB 2: SITE ENGINEER CODE AUDIT */}
                    {activeDossierTab === "engineer" && (
                      <div className="flex flex-col gap-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
                            <span className="text-[10px] font-bold text-[#8C939F] uppercase">
                              Defect Classification
                            </span>
                            <p className="text-xs font-bold text-[#181A1E] mt-0.5">
                              {inspectionResult.engineerAudit.defectType}
                            </p>
                          </div>
                          <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
                            <span className="text-[10px] font-bold text-[#8C939F] uppercase">
                              IS Code Standard
                            </span>
                            <p className="text-xs font-bold text-[#F06529] mt-0.5">
                              {inspectionResult.engineerAudit.isCodeRef}
                            </p>
                          </div>
                          <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
                            <span className="text-[10px] font-bold text-[#8C939F] uppercase">
                              Risk Severity
                            </span>
                            <p
                              className={`text-xs font-bold mt-0.5 ${
                                inspectionResult.engineerAudit.severity === "High"
                                  ? "text-red-600"
                                  : "text-amber-600"
                              }`}
                            >
                              {inspectionResult.engineerAudit.severity}
                            </p>
                          </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col gap-1.5">
                          <h4 className="text-xs font-bold text-[#8C939F] uppercase">
                            Technical Root Cause & Structural Implication
                          </h4>
                          <p className="text-xs font-medium text-[#181A1E] leading-relaxed">
                            {inspectionResult.engineerAudit.technicalRootCause}
                          </p>
                        </div>

                        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex flex-col gap-1.5">
                          <h4 className="text-xs font-bold text-amber-900 uppercase">
                            Mandatory Rectification Required Before Pour / Sign-Off
                          </h4>
                          <p className="text-xs font-medium text-amber-950 leading-relaxed">
                            {inspectionResult.engineerAudit.actionRequired}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </section>
          </div>
        )}

        {/* VIEW 2: AUDIT HISTORY LOGS FROM MONGODB */}
        {mainView === "history" && (
          <div className="w-full bg-white rounded-[28px] p-5 sm:p-7 border border-[#F06529]/15 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <h2 className="text-base font-black text-[#181A1E]">
                  Past Site Inspection Logs
                </h2>
                <p className="text-xs text-[#6B7280]">
                  Official visual audit records persisted in the site database
                </p>
              </div>
              <button
                type="button"
                onClick={fetchAuditHistory}
                disabled={isLoadingHistory}
                className="px-3.5 py-1.5 rounded-xl bg-[#FFF5EE] text-[#F06529] text-xs font-bold border border-[#F06529]/20 hover:bg-[#FFE8D6] cursor-pointer"
              >
                {isLoadingHistory ? "Refreshing..." : "Refresh Logs"}
              </button>
            </div>

            {isLoadingHistory ? (
              <div className="py-12 flex flex-col items-center justify-center gap-2 text-xs font-bold text-[#8C939F]">
                <FiLoader className="animate-spin text-xl text-[#F06529]" />
                <span>Loading inspection history from database...</span>
              </div>
            ) : auditHistory.length === 0 ? (
              <div className="py-12 text-center text-xs font-medium text-[#8C939F] flex flex-col items-center gap-2">
                <FiClock className="text-3xl text-stone-300" />
                <p>No past site inspections logged yet.</p>
                <button
                  type="button"
                  onClick={() => setMainView("inspect")}
                  className="mt-2 px-4 py-2 rounded-xl bg-[#F06529] text-white text-xs font-bold cursor-pointer"
                >
                  Perform First Inspection
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {auditHistory.map((item) => {
                  const statusBg =
                    item.status === "PASS"
                      ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                      : item.status === "CRITICAL_FAIL"
                      ? "bg-red-100 text-red-800 border-red-300"
                      : "bg-amber-100 text-amber-800 border-amber-300";

                  const formattedDate = new Date(item.createdAt).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl bg-stone-50 hover:bg-[#FFF9F5] border border-stone-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex flex-col gap-1 max-w-lg">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${statusBg}`}
                          >
                            {item.status}
                          </span>
                          <span className="text-[11px] font-bold text-[#8C939F]">
                            {item.trade.toUpperCase()}
                          </span>
                          <span className="text-[11px] text-[#A0A6B2]">
                            • {formattedDate}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-[#181A1E]">
                          {item.title}
                        </h4>
                        <p className="text-xs text-[#555A64] line-clamp-2">
                          {item.summary}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {item.weather && (
                          <span className="text-[11px] font-semibold text-[#8C939F] hidden sm:inline-block">
                            {item.weather.temp}°C
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setInspectionResult({
                              status: item.status,
                              title: item.title,
                              summary: item.summary,
                              correctiveSteps: item.correctiveSteps || [],
                              goodPoints: [],
                              engineerAudit: {
                                defectType: item.engineerAudit?.defectType || "General",
                                isCodeRef: item.engineerAudit?.isCodeRef || "IS 456",
                                severity: item.engineerAudit?.severity || "Low",
                                technicalRootCause: "Archived record from site inspection history.",
                                actionRequired: "Refer to original inspection log.",
                              },
                            });
                            setMainView("inspect");
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#FFF5EE] text-[#F06529] font-bold text-xs border border-[#F06529]/20 shadow-xs cursor-pointer"
                        >
                          View Dossier
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
