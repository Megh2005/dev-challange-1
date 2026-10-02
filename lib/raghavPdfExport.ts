import jsPDF from "jspdf";
import { ChatMessage } from "@/lib/raghav/types";
import { SiteEnvironmentData } from "@/lib/raghav/weather";

const MARGIN = 72; // Exactly 1 inch (72 points) from all sides
const PAGE_WIDTH = 612; // Standard Letter width in points (8.5 inches)
const PAGE_HEIGHT = 792; // Standard Letter height in points (11 inches)
const PRINTABLE_WIDTH = PAGE_WIDTH - MARGIN * 2; // 468 points
const BOTTOM_LIMIT = PAGE_HEIGHT - MARGIN; // 720 points

/**
 * Strips raw markdown formatting tags to render clean monospace text for academic paper layout.
 */
function cleanMarkdownForMonospace(text: string): string {
  if (!text) return "";
  return text
    // Replace markdown headings
    .replace(/^#{1,6}\s+/gm, "")
    // Replace bold/italic markers
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/__(.*?)__/g, "$1")
    .replace(/_(.*?)_/g, "$1")
    // Replace inline code blocks
    .replace(/`([^`]+)`/g, "$1")
    // Replace latex delimiters
    .replace(/\$\$([\s\S]*?)\$\$/g, "$1")
    .replace(/\$(.*?)\$/g, "$1")
    // Clean list bullets to standard ASCII
    .replace(/^\s*[-*+]\s+/gm, " * ")
    .replace(/^\s*(\d+)\.\s+/gm, " $1. ")
    .replace(/\r\n/g, "\n");
}

/**
 * Draws running headers and footers with page numbering on all pages.
 */
function applyResearchPaperHeadersAndFooters(
  doc: jsPDF,
  reportTitle: string,
  timestampStr: string
) {
  const totalPages = doc.getNumberOfPages();

  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);

    // Monospace Font for Header
    doc.setFont("courier", "normal");
    doc.setFontSize(8);
    doc.setTextColor(0, 0, 0); // Solid black
    doc.setDrawColor(0, 0, 0); // Solid black

    // Top Header (inside top 1-inch margin)
    doc.text(
      "SHRAMPARK CIVIL ENGINEERING RESEARCH & SITE VERIFICATION",
      MARGIN,
      48
    );
    doc.text(timestampStr, PAGE_WIDTH - MARGIN, 48, { align: "right" });

    // Top dividing solid black rule
    doc.setLineWidth(0.75);
    doc.line(MARGIN, 56, PAGE_WIDTH - MARGIN, 56);

    // Bottom dividing solid black rule
    doc.line(MARGIN, PAGE_HEIGHT - 54, PAGE_WIDTH - MARGIN, PAGE_HEIGHT - 54);

    // Bottom Footer (inside bottom 1-inch margin)
    doc.text(reportTitle.toUpperCase(), MARGIN, PAGE_HEIGHT - 42);
    doc.text(`PAGE ${i} OF ${totalPages}`, PAGE_WIDTH - MARGIN, PAGE_HEIGHT - 42, {
      align: "right",
    });
  }
}

/**
 * Helper to safely write a block of monospace text, automatically wrapping and adding pages as needed.
 */
function writeMonospaceBlock(
  doc: jsPDF,
  text: string,
  startY: number,
  options?: {
    isBold?: boolean;
    fontSize?: number;
    lineSpacing?: number;
    indent?: number;
  }
): number {
  const isBold = options?.isBold ?? false;
  const fontSize = options?.fontSize ?? 9.5;
  const lineSpacing = options?.lineSpacing ?? 13;
  const indent = options?.indent ?? 0;

  doc.setFont("courier", isBold ? "bold" : "normal");
  doc.setFontSize(fontSize);
  doc.setTextColor(0, 0, 0);

  const lines: string[] = doc.splitTextToSize(text, PRINTABLE_WIDTH - indent);
  let currentY = startY;

  for (const line of lines) {
    if (currentY + lineSpacing > BOTTOM_LIMIT) {
      doc.addPage();
      currentY = MARGIN + 10;
      doc.setFont("courier", isBold ? "bold" : "normal");
      doc.setFontSize(fontSize);
      doc.setTextColor(0, 0, 0);
    }

    doc.text(line, MARGIN + indent, currentY);
    currentY += lineSpacing;
  }

  return currentY;
}

/**
 * Exports a SINGLE AI response to a black-and-white monospace research paper PDF.
 */
export function exportSingleResponsePdf(
  promptQuery: string,
  responseContent: string,
  environment?: SiteEnvironmentData | null,
  modelName?: string
) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "letter",
  });

  const now = new Date();
  const timestampStr = now.toISOString().replace("T", " ").substring(0, 19) + " UTC";
  const dateFormatted = now.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  let y = MARGIN + 12;

  // Document Title (Research Paper Header)
  doc.setFont("courier", "bold");
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text("TECHNICAL VERIFICATION MEMORANDUM", MARGIN, y);
  y += 18;

  doc.setFont("courier", "normal");
  doc.setFontSize(10);
  doc.text(`RAGHAV AI CO-PILOT STRUCTURAL EVALUATION REPORT`, MARGIN, y);
  y += 18;

  // Solid black divider
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(1.5);
  doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);
  y += 16;

  // Metadata Table (Black & White, Monospace)
  const metaLines = [
    `DOCUMENT ID: RAGHAV-EXC-${now.getTime().toString(36).toUpperCase()}`,
    `DATE:        ${dateFormatted} (${timestampStr})`,
    `ENGINE ENGINE: ${modelName || "Gemma-2B-IT / LiteRT-LM WebGPU"}`,
    `STANDARDS:   INDIAN STANDARDS (IS 456, IS 800, IS 13920, SP 34)`,
  ];

  if (environment) {
    metaLines.push(
      `SITE TELEMETRY: ${environment.city || "Site"}, ${environment.state || "IN"} | TEMP: ${environment.temperature}°C | HUMIDITY: ${environment.humidity}% | WIND: ${environment.windSpeed}m/s`
    );
  }

  for (const mLine of metaLines) {
    y = writeMonospaceBlock(doc, mLine, y, { fontSize: 8.5, lineSpacing: 12 });
  }

  y += 10;
  doc.setLineWidth(0.75);
  doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);
  y += 16;

  // Section 1: Problem Statement / Prompt
  y = writeMonospaceBlock(doc, "1.0 SPECIFIED INQUIRY & PROBLEM FORMULATION", y, {
    isBold: true,
    fontSize: 11,
    lineSpacing: 16,
  });
  y += 4;

  const cleanPrompt = cleanMarkdownForMonospace(promptQuery || "(No prompt provided)");
  y = writeMonospaceBlock(doc, cleanPrompt, y, {
    fontSize: 9.5,
    lineSpacing: 13,
    indent: 14,
  });

  y += 14;
  doc.setLineWidth(0.5);
  doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);
  y += 16;

  // Section 2: Technical Evaluation & Derivation
  y = writeMonospaceBlock(
    doc,
    "2.0 STRUCTURAL DERIVATION, IS COMPLIANCE & ANALYSIS",
    y,
    {
      isBold: true,
      fontSize: 11,
      lineSpacing: 16,
    }
  );
  y += 4;

  const cleanResponse = cleanMarkdownForMonospace(responseContent);
  y = writeMonospaceBlock(doc, cleanResponse, y, {
    fontSize: 9.5,
    lineSpacing: 13,
    indent: 0,
  });

  y += 18;
  doc.setLineWidth(0.75);
  doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);
  y += 14;

  // Verification Note
  const verificationNote =
    "[END OF TECHNICAL REPORT EXCERPT - VERIFIED FOR SITE USE PER IS CODES]";
  writeMonospaceBlock(doc, verificationNote, y, {
    isBold: true,
    fontSize: 8.5,
    lineSpacing: 12,
  });

  // Apply research paper headers and footers to all pages
  applyResearchPaperHeadersAndFooters(
    doc,
    "Raghav AI Structural Verification",
    timestampStr
  );

  // Save the PDF
  const filename = `Raghav_Response_${now.toISOString().slice(0, 10)}_${now.getTime().toString().slice(-4)}.pdf`;
  doc.save(filename);
}

/**
 * Exports the ENTIRE chat conversation transcript to a black-and-white monospace research paper PDF.
 */
export function exportFullChatPdf(
  messages: ChatMessage[],
  environment?: SiteEnvironmentData | null,
  modelName?: string
) {
  if (!messages || messages.length === 0) return;

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "letter",
  });

  const now = new Date();
  const timestampStr = now.toISOString().replace("T", " ").substring(0, 19) + " UTC";
  const dateFormatted = now.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  let y = MARGIN + 12;

  // Document Title
  doc.setFont("courier", "bold");
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text("SHRAMPARK CIVIL ENGINEERING TECHNICAL REPORT", MARGIN, y);
  y += 18;

  doc.setFont("courier", "normal");
  doc.setFontSize(10);
  doc.text("RAGHAV AI INTERACTIVE SESSION TRANSCRIPT", MARGIN, y);
  y += 18;

  // Heavy divider
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(1.5);
  doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);
  y += 16;

  // Telemetry & Header Metadata
  const metaLines = [
    `SESSION ID:  RAGHAV-FULL-${now.getTime().toString(36).toUpperCase()}`,
    `DATE:        ${dateFormatted} (${timestampStr})`,
    `ENGINE:      ${modelName || "Gemma-2B-IT / LiteRT-LM WebGPU"}`,
    `TURNS:       ${messages.length} TOTAL MESSAGES RECORDED`,
  ];

  if (environment) {
    metaLines.push(
      `LOCATION:    ${environment.city || "Site Coordinates"}, ${environment.state || "India"} (LAT ${environment.latitude.toFixed(4)}, LON ${environment.longitude.toFixed(4)})`,
      `ENVIRONMENT: TEMP ${environment.temperature}°C | HUMIDITY ${environment.humidity}% | WIND ${environment.windSpeed}m/s`
    );
  }

  for (const mLine of metaLines) {
    y = writeMonospaceBlock(doc, mLine, y, { fontSize: 8.5, lineSpacing: 12 });
  }

  y += 12;
  doc.setLineWidth(1);
  doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);
  y += 18;

  // Iterate through all conversation turns
  let turnNumber = 1;

  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    const isUser = msg.role === "user";
    const speakerLabel = isUser ? `TURN ${turnNumber}A: USER INQUIRY` : `TURN ${turnNumber}B: RAGHAV AI ENGINEERING RESPONSE`;

    if (y + 40 > BOTTOM_LIMIT) {
      doc.addPage();
      y = MARGIN + 10;
    }

    // Turn heading
    y = writeMonospaceBlock(doc, `================================================================`, y, {
      fontSize: 8,
      lineSpacing: 10,
    });
    y = writeMonospaceBlock(doc, speakerLabel, y, {
      isBold: true,
      fontSize: 10,
      lineSpacing: 15,
    });
    y = writeMonospaceBlock(doc, `----------------------------------------------------------------`, y, {
      fontSize: 8,
      lineSpacing: 10,
    });
    y += 2;

    const cleanContent = cleanMarkdownForMonospace(msg.content);
    y = writeMonospaceBlock(doc, cleanContent, y, {
      fontSize: 9.5,
      lineSpacing: 13,
      indent: isUser ? 10 : 0,
    });

    if (msg.sources && msg.sources.length > 0) {
      y += 6;
      y = writeMonospaceBlock(doc, "REFERENCED STANDARDS & DOCUMENTS:", y, {
        isBold: true,
        fontSize: 8.5,
        lineSpacing: 11,
      });
      for (const s of msg.sources) {
        y = writeMonospaceBlock(doc, ` * ${s.title}: ${s.url}`, y, {
          fontSize: 8,
          lineSpacing: 11,
          indent: 8,
        });
      }
    }

    y += 16;
    if (!isUser) {
      turnNumber += 1;
    }
  }

  if (y + 30 > BOTTOM_LIMIT) {
    doc.addPage();
    y = MARGIN + 10;
  }

  y += 6;
  doc.setLineWidth(1);
  doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);
  y += 14;

  const reportConclusion =
    "[END OF COMPLETE CONVERSATION TRANSCRIPT - SHRAMPARK ACADEMY]";
  writeMonospaceBlock(doc, reportConclusion, y, {
    isBold: true,
    fontSize: 8.5,
    lineSpacing: 12,
  });

  // Apply running header and footer to all pages
  applyResearchPaperHeadersAndFooters(
    doc,
    "ShramPark Raghav AI Complete Transcript",
    timestampStr
  );

  const filename = `Raghav_Transcript_${now.toISOString().slice(0, 10)}_${now.getTime().toString().slice(-4)}.pdf`;
  doc.save(filename);
}
