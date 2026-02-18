export type PdfFileSource =
  | { type: "url"; url: string }
  | { type: "data"; data: ArrayBuffer | Uint8Array }
  | { type: "base64"; base64: string };
