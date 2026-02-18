import React, { useMemo, useRef, useState } from "react";
import {
  PdfHighlighterViewer,
  type Highlight,
  type PdfViewerRef,
} from "@local/pdf-highlighter-viewer";

// Highlights for GRE Validity PDF (sldttc.org) – includes the chart/figure
const percentHighlights: Highlight[] = [
  {
    id: "chart",
    page: 1,
    x: 0.02,
    y: 0.28,
    width: 0.38,
    height: 0.5,
    color: "#3b82f6",
    opacity: 0.25,
    coordinateSpace: "percent",
    linkedFieldId: "demo-field-chart",
  },
  {
    id: "p1",
    page: 1,
    x: 0.45,
    y: 0.12,
    width: 0.5,
    height: 0.1,
    color: "#22c55e",
    opacity: 0.35,
    coordinateSpace: "percent",
    linkedFieldId: "demo-field-p1",
  },
  {
    id: "p2",
    page: 1,
    x: 0.45,
    y: 0.28,
    width: 0.52,
    height: 0.5,
    color: "#64748b",
    opacity: 0.2,
    coordinateSpace: "percent",
  },
  {
    id: "p3",
    page: 2,
    x: 0.08,
    y: 0.15,
    width: 0.55,
    height: 0.12,
    color: "#f97316",
    opacity: 0.35,
    coordinateSpace: "percent",
  },
  {
    id: "figure2",
    page: 2,
    x: 0.1,
    y: 0.35,
    width: 0.8,
    height: 0.35,
    color: "#8b5cf6",
    opacity: 0.22,
    coordinateSpace: "percent",
  },
  {
    id: "p4",
    page: 2,
    x: 0.08,
    y: 0.75,
    width: 0.84,
    height: 0.15,
    color: "#ec4899",
    opacity: 0.28,
    coordinateSpace: "percent",
  },
  {
    id: "p5",
    page: 3,
    x: 0.1,
    y: 0.08,
    width: 0.5,
    height: 0.08,
    color: "#eab308",
    opacity: 0.35,
    coordinateSpace: "percent",
  },
];

export const PdfViewerDemo: React.FC = () => {
  const viewerRef = useRef<PdfViewerRef>(null);
  const [showHighlights, setShowHighlights] = useState(true);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [activeHighlightId, setActiveHighlightId] = useState<string | null>(null);

  const effectiveHighlights = useMemo(
    () =>
      showHighlights
        ? percentHighlights.map((h) =>
            h.id === activeHighlightId
              ? {
                  ...h,
                  color: "#facc15", // yellow-ish for active highlight
                  opacity: Math.max(h.opacity ?? 0.25, 0.5),
                }
              : h,
          )
        : [],
    [showHighlights, activeHighlightId],
  );

  return (
    <div
      className={theme === "dark" ? "app-dark" : "app-light"}
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <header
        style={{
          padding: "12px 20px",
          borderBottom: "1px solid #e5e7eb",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: 20 }}>PDF Highlighter Viewer Demo</h1>
          <p style={{ margin: 0, fontSize: 13, opacity: 0.8 }}>
            Render PDFs, navigate pages, zoom, download, and visualize rectangle highlights.
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <input
              type="checkbox"
              checked={showHighlights}
              onChange={(e) => setShowHighlights(e.target.checked)}
            />
            <span style={{ fontSize: 13 }}>Show highlights</span>
          </label>
          <button
            type="button"
            onClick={() =>
              setTheme((prev) => (prev === "light" ? "dark" : "light"))
            }
          >
            {theme === "light" ? "Switch to dark" : "Switch to light"}
          </button>
        </div>
      </header>

      <div
        style={{
          display: "flex",
          flex: 1,
          overflow: "hidden",
        }}
      >
        <main
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "stretch",
            padding: 16,
            overflow: "auto",
          }}
        >
          <div style={{ width: "100%", maxWidth: 900, height: "100%" }}>
            <PdfHighlighterViewer
              ref={viewerRef}
              source={{ type: "url", url: "/pdf-proxy/21583473018.pdf" }}
              highlights={effectiveHighlights}
              initialPage={1}
              zoomStep={0.2}
              toolbar
              enableHighlightNavigation
              highlightScrollBehavior="smooth"
              highlightFocusZoom={1.2}
              enableFieldNavigation
              style={{
                height: "100%",
                background: theme === "dark" ? "#020617" : "#ffffff",
              }}
              className={
                theme === "dark"
                  ? "viewer-card viewer-card-dark"
                  : "viewer-card viewer-card-light"
              }
              onHighlightClick={(h) => {
                setActiveHighlightId(h.id);
              }}
              renderHighlightTooltip={(h) => <span>{h.id}</span>}
            />
          </div>
        </main>

        <aside
          style={{
            width: 260,
            borderLeft: "1px solid #e5e7eb",
            padding: 16,
            overflowY: "auto",
            background: theme === "dark" ? "#020617" : "#f9fafb",
          }}
        >
          <h2 style={{ fontSize: 16, marginTop: 0, marginBottom: 8 }}>
            Highlights
          </h2>
          <p style={{ fontSize: 13, marginTop: 0, marginBottom: 12 }}>
            Toggle visibility and click rectangles in the viewer to test interactions.
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {percentHighlights.map((h) => (
              <li
                key={h.id}
                style={{
                  marginBottom: 8,
                  padding: 8,
                  borderRadius: 6,
                  border: "1px solid #e5e7eb",
                  background: "#ffffff",
                  fontSize: 13,
                }}
              >
                <div>
                  <strong>{h.id}</strong> — page {h.page}
                </div>
                <div style={{ opacity: 0.8 }}>
                  x={h.x}, y={h.y}, w={h.width}, h={h.height}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setActiveHighlightId(h.id);
                    viewerRef.current?.goToHighlight(h.id);
                  }}
                  style={{ marginTop: 6, fontSize: 12 }}
                >
                  Go to highlight
                </button>
              </li>
            ))}
          </ul>

          <div style={{ marginTop: 16 }}>
            <h3 style={{ fontSize: 14, marginTop: 0, marginBottom: 8 }}>Linked form fields (demo)</h3>
            <p style={{ fontSize: 12, marginTop: 0, marginBottom: 8 }}>
              Click the <code>chart</code> or <code>p1</code> highlights in the PDF to scroll/focus these
              inputs via <code>linkedFieldId</code>.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <input
                id="demo-field-chart"
                placeholder="Linked to highlight: chart"
              />
              <input
                id="demo-field-p1"
                placeholder="Linked to highlight: p1"
              />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

