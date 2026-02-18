import React from "react";

export type DiscrepancyReviewPanelProps = {
  /** When user focuses/edits a Document 1 field, navigate to its highlight in the Instruction viewer */
  onFocusDocument1?: () => void;
  /** When user focuses/edits a Document 2 field, navigate to its highlight in the Confirmation viewer */
  onFocusDocument2?: () => void;
  /** When user focuses/edits the Transaction Date Document 1 field */
  onFocusTransactionDateDocument1?: () => void;
  /** When user focuses/edits the Transaction Date Document 2 field */
  onFocusTransactionDateDocument2?: () => void;
  /** When user blurs (focus leaves) any Document 1 field */
  onBlurDocument1?: () => void;
  /** When user blurs (focus leaves) any Document 2 field */
  onBlurDocument2?: () => void;
};

export const DiscrepancyReviewPanel: React.FC<DiscrepancyReviewPanelProps> = ({
  onFocusDocument1,
  onFocusDocument2,
  onFocusTransactionDateDocument1,
  onFocusTransactionDateDocument2,
  onBlurDocument1,
  onBlurDocument2,
}) => {
  return (
    <section
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        background: "#f9fafb",
      }}
    >
      <header
        style={{
          marginBottom: 12,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2 style={{ margin: 0, fontSize: 16 }}>Fields to Review</h2>
        <span style={{ fontSize: 12, color: "#6b7280" }}>
          Demo-only UI for discrepancy review
        </span>
      </header>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(160px, auto) 1fr 1fr 1fr",
          gap: 12,
          marginBottom: 16,
          alignItems: "center",
        }}
      >
        {/* Header row */}
        <div style={{ fontSize: 12, fontWeight: 600, color: "#374151" }} />
        <div style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>Document 1</div>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>Document 2</div>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>Final Value</div>

        {/* Row 1: Transaction value */}
        <div style={{ fontSize: 12, fontWeight: 500, color: "#374151" }}>
          Transaction value (€)
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <input
            id="transaction-value-doc1"
            type="text"
            defaultValue="1.400.000,00"
            style={{ width: "100%" }}
            onFocus={onFocusDocument1}
            onBlur={onBlurDocument1}
            onChange={() => onFocusDocument1?.()}
          />
          <span
            title="Discrepancy"
            style={{
              width: 8,
              height: 8,
              borderRadius: "999px",
              background: "#f97316",
              flexShrink: 0,
            }}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <input
            id="transaction-value-doc2"
            type="text"
            defaultValue="1.700.000,00"
            style={{ width: "100%" }}
            onFocus={onFocusDocument2}
            onBlur={onBlurDocument2}
            onChange={() => onFocusDocument2?.()}
          />
          <span
            title="Discrepancy"
            style={{
              width: 8,
              height: 8,
              borderRadius: "999px",
              background: "#f97316",
              flexShrink: 0,
            }}
          />
        </div>
        <input
          type="text"
          placeholder="Please enter final value"
          style={{ width: "100%" }}
        />

        {/* Row 2: Transaction date */}
        <div style={{ fontSize: 12, fontWeight: 500, color: "#374151" }}>
          Transaction date (dd/mm/yyyy)
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <input
            id="transaction-date-doc1"
            type="text"
            defaultValue="03/10/2026"
            style={{ width: "100%" }}
            onFocus={onFocusTransactionDateDocument1}
            onBlur={onBlurDocument1}
            onChange={() => onFocusTransactionDateDocument1?.()}
          />
          <span
            title="Discrepancy"
            style={{
              width: 8,
              height: 8,
              borderRadius: "999px",
              background: "#f97316",
              flexShrink: 0,
            }}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <input
            id="transaction-date-doc2"
            type="text"
            defaultValue="05/10/2026"
            style={{ width: "100%" }}
            onFocus={onFocusTransactionDateDocument2}
            onBlur={onBlurDocument2}
            onChange={() => onFocusTransactionDateDocument2?.()}
          />
          <span
            title="Discrepancy"
            style={{
              width: 8,
              height: 8,
              borderRadius: "999px",
              background: "#f97316",
              flexShrink: 0,
            }}
          />
        </div>
        <input
          type="text"
          placeholder="Please enter final value"
          style={{ width: "100%" }}
        />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 4,
        }}
      >
        <label style={{ fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}>
          <input type="radio" defaultChecked />
          <span>
            Create email to inform both counterparties regarding the existing discrepancies between
            documents
          </span>
        </label>
        <button
          type="button"
          style={{
            padding: "6px 14px",
            borderRadius: 999,
            border: "none",
            background: "#2563eb",
            color: "#f9fafb",
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          Create email
        </button>
      </div>
    </section>
  );
};

