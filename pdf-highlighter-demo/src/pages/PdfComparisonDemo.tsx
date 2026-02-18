import React, { useMemo, useRef, useState } from "react";
import {
  PdfHighlighterViewer,
  type Highlight,
  type PdfViewerRef,
} from "@local/pdf-highlighter-viewer";
import { DiscrepancyReviewPanel } from "../components/DiscrepancyReviewPanel.tsx";

const baseInstructionHighlights: Highlight[] = [
  {
    id: "inst-total",
    page: 1,
    x: 0.08,
    y: 0.35,
    width: 0.84,
    height: 0.055,
    color: "rgba(239,68,68,1)",
    opacity: 0.3,
    coordinateSpace: "percent",
    linkedFieldId: "transaction-value-doc1",
  },
  {
    id: "inst-date",
    page: 1,
    x: 0.05,
    y: 0.10,
    width: 0.34,
    height: 0.015,
    color: "rgba(239,68,68,1)",
    opacity: 0.3,
    coordinateSpace: "percent",
    linkedFieldId: "transaction-date-doc1",
  },
];

const baseConfirmationHighlights: Highlight[] = [
  {
    id: "conf-total",
    page: 1,
    x: 0.08,
    y: 0.35,
    width: 0.84,
    height: 0.055,
    color: "rgba(239,68,68,1)",
    opacity: 0.3,
    coordinateSpace: "percent",
    linkedFieldId: "transaction-value-doc2",
  },
  {
    id: "conf-date",
    page: 1,
    x: 0.05,
    y: 0.10,
    width: 0.34,
    height: 0.015,
    color: "rgba(239,68,68,1)",
    opacity: 0.3,
    coordinateSpace: "percent",
    linkedFieldId: "transaction-date-doc2",
  },
];

export const PdfComparisonDemo: React.FC = () => {
  const instructionViewerRef = useRef<PdfViewerRef>(null);
  const confirmationViewerRef = useRef<PdfViewerRef>(null);
  const [activeInstructionHighlightId, setActiveInstructionHighlightId] =
    useState<string | null>(null);
  const [activeConfirmationHighlightId, setActiveConfirmationHighlightId] =
    useState<string | null>(null);

  const instructionHighlights = useMemo(
    () =>
      baseInstructionHighlights.map((h) =>
        h.id === activeInstructionHighlightId
          ? {
              ...h,
              color: "rgba(250,204,21,1)", // yellow-ish for active highlight
              opacity: 0.5,
            }
          : h,
      ),
    [activeInstructionHighlightId],
  );

  const confirmationHighlights = useMemo(
    () =>
      baseConfirmationHighlights.map((h) =>
        h.id === activeConfirmationHighlightId
          ? {
              ...h,
              color: "rgba(250,204,21,1)", // yellow-ish for active highlight
              opacity: 0.5,
            }
          : h,
      ),
    [activeConfirmationHighlightId],
  );

  const focusInstructionHighlight = (id: string) => {
    setActiveInstructionHighlightId(id);
    instructionViewerRef.current?.goToHighlight(id);
  };

  const focusConfirmationHighlight = (id: string) => {
    setActiveConfirmationHighlightId(id);
    confirmationViewerRef.current?.goToHighlight(id);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <div style={{ padding: 16 }}>
        <DiscrepancyReviewPanel
          onFocusDocument1={() =>
            focusInstructionHighlight("inst-total")
          }
          onFocusDocument2={() =>
            focusConfirmationHighlight("conf-total")
          }
          onFocusTransactionDateDocument1={() =>
            focusInstructionHighlight("inst-date")
          }
          onFocusTransactionDateDocument2={() =>
            focusConfirmationHighlight("conf-date")
          }
          onBlurDocument1={() => setActiveInstructionHighlightId(null)}
          onBlurDocument2={() => setActiveConfirmationHighlightId(null)}
        />
      </div>

      <div
        style={{
          flex: 1,
          padding: "0 16px 16px",
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 16,
          minHeight: 0,
        }}
      >
        <section
          style={{
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
            borderRadius: 8,
          }}
        >
          <header
            style={{
              padding: "8px 0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <h2 style={{ margin: 0, fontSize: 14 }}>Instruction</h2>
              <p style={{ margin: 0, fontSize: 12, color: "#6b7280" }}>
                Original transaction instruction document
              </p>
            </div>
          </header>
          <div style={{ flex: 1, minHeight: 0 }}>
            <PdfHighlighterViewer
              ref={instructionViewerRef}
              source={{ type: "url", url: "/pdfs/receipt.pdf" }}
              highlights={instructionHighlights}
              initialPage={1}
              zoomStep={0.2}
              toolbar
              enableHighlightNavigation
              highlightScrollBehavior="smooth"
              enableFieldNavigation
              showZoomControls
              style={{ height: "100%" }}
            />
          </div>
        </section>

        <section
          style={{
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
            borderRadius: 8,
          }}
        >
          <header
            style={{
              padding: "8px 0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <h2 style={{ margin: 0, fontSize: 14 }}>Confirmation</h2>
              <p style={{ margin: 0, fontSize: 12, color: "#6b7280" }}>
                Counterparty confirmation document
              </p>
            </div>
          </header>
          <div style={{ flex: 1, minHeight: 0 }}>
            <PdfHighlighterViewer
              ref={confirmationViewerRef}
              source={{ type: "url", url: "/pdfs/statement.pdf" }}
              highlights={confirmationHighlights}
              initialPage={1}
              zoomStep={0.2}
              toolbar
              enableHighlightNavigation
              highlightScrollBehavior="smooth"
              enableFieldNavigation
              showZoomControls
              style={{ height: "100%" }}
            />
          </div>
        </section>
      </div>
    </div>
  );
};

