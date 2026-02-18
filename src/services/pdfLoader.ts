import { getDocument, type PDFDocumentProxy } from "pdfjs-dist";
import type { PdfFileSource } from "../types/source.js";

/**
 * Load a PDF document from URL, base64, or ArrayBuffer.
 */
export async function loadPdfDocument(source: PdfFileSource): Promise<PDFDocumentProxy> {
  if (source.type === "url") {
    return await getDocument(source.url).promise;
  }
  if (source.type === "base64") {
    const binary = atob(source.base64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }
    return await getDocument({ data: bytes }).promise;
  }
  return await getDocument({ data: source.data }).promise;
}

/**
 * Create a download URL for the given source. Caller must revoke the URL when done.
 */
export function getDownloadUrl(source: PdfFileSource): string | null {
  if (source.type === "url") return source.url;
  if (source.type === "data") {
    const buffer =
      source.data instanceof ArrayBuffer
        ? source.data
        : source.data.buffer.slice(
            source.data.byteOffset,
            source.data.byteOffset + source.data.byteLength,
          );
    const blob = new Blob([buffer as ArrayBuffer], { type: "application/pdf" });
    return URL.createObjectURL(blob);
  }
  if (source.type === "base64") {
    const binary = atob(source.base64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: "application/pdf" });
    return URL.createObjectURL(blob);
  }
  return null;
}
