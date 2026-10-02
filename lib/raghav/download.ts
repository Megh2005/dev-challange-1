import { DownloadProgress, RAGHAV_MODEL_CONFIG } from "./types";

const IDB_NAME = "raghav-storage-v1";
const IDB_STORE = "file-handles";
const IDB_HANDLE_KEY = "gemma-4-E2B-handle";

/** Minimum valid model file size — Gemma 4 E2B is ~1.87 GB */
const MIN_MODEL_SIZE_BYTES = 100 * 1024 * 1024; // 100 MB


function openHandleDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !("indexedDB" in window)) {
      return reject(new Error("IndexedDB not available in this environment."));
    }
    const request = indexedDB.open(IDB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(IDB_STORE)) {
        db.createObjectStore(IDB_STORE);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}


export async function saveFileHandleToDB(
  handle: FileSystemFileHandle
): Promise<void> {
  try {
    const db = await openHandleDB();
    const tx = db.transaction(IDB_STORE, "readwrite");
    tx.objectStore(IDB_STORE).put(handle, IDB_HANDLE_KEY);
    await new Promise((resolve, reject) => {
      tx.oncomplete = resolve;
      tx.onerror = reject;
    });
  } catch (err) {
    console.warn("Could not save file handle to IndexedDB:", err);
  }
}

/**
 * Retrieves the saved FileSystemFileHandle from IndexedDB.
 */
export async function getSavedFileHandleFromDB(): Promise<FileSystemFileHandle | null> {
  try {
    const db = await openHandleDB();
    const tx = db.transaction(IDB_STORE, "readonly");
    const req = tx.objectStore(IDB_STORE).get(IDB_HANDLE_KEY);
    return new Promise((resolve) => {
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

/**
 * Clears the saved FileSystemFileHandle from IndexedDB.
 */
export async function removeSavedFileHandleFromDB(): Promise<void> {
  try {
    const db = await openHandleDB();
    const tx = db.transaction(IDB_STORE, "readwrite");
    tx.objectStore(IDB_STORE).delete(IDB_HANDLE_KEY);
  } catch (err) {
    console.warn("Could not remove file handle from IndexedDB:", err);
  }
}

/**
 * Validates that a model file is large enough to be a real Gemma 4 E2B artifact.
 * Rejects empty files (0 bytes), incomplete downloads, and .crswap remnants.
 */
export function validateModelFileSize(file: File): {
  valid: boolean;
  error?: string;
} {
  if (file.size === 0) {
    return {
      valid: false,
      error: `Selected file "${file.name}" is 0 bytes (empty). This usually means the download was interrupted or you selected a swap file. Please download the model again and select the completed file.`,
    };
  }
  if (file.size < MIN_MODEL_SIZE_BYTES) {
    return {
      valid: false,
      error: `Selected file "${file.name}" is only ${(file.size / 1024 / 1024).toFixed(1)} MB. The Gemma 4 E2B model is ~1.87 GB. The file appears incomplete — please re-download and select the fully completed file.`,
    };
  }
  return { valid: true };
}

/**
 * Detects whether WebGPU is supported and available in the current browser.
 */
export async function checkWebGPUSupport(): Promise<{
  supported: boolean;
  adapterName?: string;
  error?: string;
}> {
  if (typeof window === "undefined") {
    return { supported: false, error: "Running in non-browser environment." };
  }

  const nav = navigator as Navigator & {
    gpu?: {
      requestAdapter: () => Promise<{
        info?: { device?: string; description?: string };
      } | null>;
    };
  };

  if (!nav.gpu) {
    return {
      supported: false,
      error:
        "WebGPU is not supported in this browser. Please use Chrome 113+, Edge 113+, or a browser with WebGPU enabled.",
    };
  }

  try {
    const adapter = await nav.gpu.requestAdapter();
    if (!adapter) {
      return {
        supported: false,
        error:
          "WebGPU adapter could not be initialized. Please check that hardware acceleration is enabled in your browser settings.",
      };
    }
    return {
      supported: true,
      adapterName: adapter.info?.device || "WebGPU Compatible Adapter",
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      supported: false,
      error: `WebGPU initialization check failed: ${message}`,
    };
  }
}


export async function downloadModelToUserPath(
  onProgress: (progress: DownloadProgress) => void,
  signal?: AbortSignal
): Promise<File> {
  let handle: FileSystemFileHandle;

  if ("showSaveFilePicker" in window) {
    try {
      handle = await (window as unknown as {
        showSaveFilePicker: (options: {
          suggestedName: string;
          types: Array<{
            description: string;
            accept: Record<string, string[]>;
          }>;
        }) => Promise<FileSystemFileHandle>;
      }).showSaveFilePicker({
        suggestedName: RAGHAV_MODEL_CONFIG.filename,
        types: [
          {
            description: "LiteRT Model Artifact (*.litertlm)",
            accept: {
              "application/octet-stream": [".litertlm"],
            },
          },
        ],
      });
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") {
        throw new Error("Download cancelled: No save location was selected.");
      }
      throw err;
    }
  } else {
    throw new Error(
      "Your browser does not support custom path selection (showSaveFilePicker). Please use Chrome or Edge, or download the file manually and use 'Select Existing .litertlm'."
    );
  }

  // 2. Fetch the model binary with progress tracking
  const response = await fetch(RAGHAV_MODEL_CONFIG.huggingFaceUrl, {
    method: "GET",
    signal,
    headers: { Accept: "application/octet-stream" },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to download model from Hugging Face: HTTP ${response.status} ${response.statusText}`
    );
  }

  const contentLength = response.headers.get("content-length");
  const totalBytes = contentLength ? parseInt(contentLength, 10) : 2008432640;

  // Stream into memory chunks with progress
  const chunks: Uint8Array[] = [];
  let receivedBytes = 0;

  if (response.body) {
    const reader = response.body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) {
        chunks.push(value);
        receivedBytes += value.length;
        onProgress({
          receivedBytes,
          totalBytes,
          percentage: Math.min(100, Math.round((receivedBytes / totalBytes) * 100)),
        });
      }
    }
  } else {
    const arrayBuffer = await response.arrayBuffer();
    chunks.push(new Uint8Array(arrayBuffer));
    receivedBytes = arrayBuffer.byteLength;
    onProgress({ receivedBytes, totalBytes: receivedBytes, percentage: 100 });
  }

  // 3. Write the complete blob to the user's chosen path in one shot
  //    (.crswap only exists momentarily during this atomic write)
  const blob = new Blob(chunks as BlobPart[], { type: "application/octet-stream" });
  const writable = await handle.createWritable();
  await writable.write(blob);
  await writable.close();

  // 4. Save handle for subsequent sessions
  await saveFileHandleToDB(handle);

  return await handle.getFile();
}

/**
 * Lets the user select an existing .litertlm file from any directory on their device
 * using showOpenFilePicker and remembers the handle. Validates file size before returning.
 */
export async function pickLocalModelFile(): Promise<File | null> {
  if ("showOpenFilePicker" in window) {
    try {
      const [handle] = await (window as unknown as {
        showOpenFilePicker: (options: {
          types: Array<{
            description: string;
            accept: Record<string, string[]>;
          }>;
          multiple: boolean;
        }) => Promise<FileSystemFileHandle[]>;
      }).showOpenFilePicker({
        types: [
          {
            description: "LiteRT Model Artifact (*.litertlm)",
            accept: {
              "application/octet-stream": [".litertlm"],
            },
          },
        ],
        multiple: false,
      });

      if (handle) {
        const file = await handle.getFile();

        // Validate file size before proceeding
        const sizeCheck = validateModelFileSize(file);
        if (!sizeCheck.valid) {
          throw new Error(sizeCheck.error);
        }

        await saveFileHandleToDB(handle);
        return file;
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") {
        return null;
      }
      throw err;
    }
  }
  return null;
}

/**
 * Attempts to reload a previously chosen model from the user's saved file handle.
 * Validates file size before returning.
 */
export async function loadFromSavedFileHandle(): Promise<{
  file: File | null;
  fileName?: string;
}> {
  const handle = await getSavedFileHandleFromDB();
  if (!handle) return { file: null };

  try {
    // Check or query permission safely with typed interface
    interface PermissionFileHandle extends FileSystemFileHandle {
      queryPermission?: (descriptor?: {
        mode?: "read" | "readwrite";
      }) => Promise<PermissionState>;
      requestPermission?: (descriptor?: {
        mode?: "read" | "readwrite";
      }) => Promise<PermissionState>;
    }

    const permHandle = handle as PermissionFileHandle;

    if (typeof permHandle.queryPermission === "function") {
      const status = await permHandle.queryPermission({ mode: "read" });
      if (status !== "granted") {
        if (typeof permHandle.requestPermission === "function") {
          const requested = await permHandle.requestPermission({ mode: "read" });
          if (requested !== "granted") {
            return { file: null, fileName: handle.name };
          }
        }
      }
    }

    const file = await handle.getFile();

    // Validate file size before returning
    const sizeCheck = validateModelFileSize(file);
    if (!sizeCheck.valid) {
      return { file: null, fileName: handle.name };
    }

    return { file, fileName: handle.name };
  } catch (e) {
    console.warn("Could not load from saved file handle:", e);
    return { file: null, fileName: handle.name };
  }
}

/**
 * Validates a file from standard input[type=file] — checks extension and size.
 */
export function validateLocalModelFile(file: File): {
  valid: boolean;
  error?: string;
} {
  if (!file.name.endsWith(".litertlm")) {
    return {
      valid: false,
      error: `Invalid file format. Expected a '.litertlm' artifact (e.g., '${RAGHAV_MODEL_CONFIG.filename}').`,
    };
  }

  const sizeCheck = validateModelFileSize(file);
  if (!sizeCheck.valid) {
    return sizeCheck;
  }

  return { valid: true };
}
