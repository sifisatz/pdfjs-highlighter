import { useEffect, useState } from "react";
import { getDownloadUrl } from "../services/pdfLoader.js";
import type { PdfFileSource } from "../types/source.js";

export function useDownloadUrl(source: PdfFileSource): string | null {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    const next = getDownloadUrl(source);
    setUrl(next);
    return () => {
      if (next && source.type !== "url") {
        URL.revokeObjectURL(next);
      }
    };
  }, [source]);

  return url;
}
