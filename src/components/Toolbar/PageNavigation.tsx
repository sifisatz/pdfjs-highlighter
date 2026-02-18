import React, { useEffect, useState } from "react";

export type PageNavigationProps = {
  page: number;
  pageCount: number;
  canGoPrev: boolean;
  canGoNext: boolean;
  onPrevPage: () => void;
  onNextPage: () => void;
  onGoToPage: (page: number) => void;
};

export function PageNavigation({
  page,
  pageCount,
  canGoPrev,
  canGoNext,
  onPrevPage,
  onNextPage,
  onGoToPage,
}: PageNavigationProps) {
  const [pageInput, setPageInput] = useState(String(page));

  useEffect(() => {
    setPageInput(String(page));
  }, [page]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = Number(pageInput);
    if (!Number.isNaN(value) && value >= 1 && value <= pageCount) {
      onGoToPage(value);
    }
  };

  return (
    <>
      <button type="button" onClick={onPrevPage} disabled={!canGoPrev}>
        Prev
      </button>
      <button type="button" onClick={onNextPage} disabled={!canGoNext}>
        Next
      </button>
      <form onSubmit={handleSubmit} style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <input
          type="number"
          min={1}
          max={pageCount}
          value={pageInput}
          onChange={(e) => setPageInput(e.target.value)}
          style={{ width: 60 }}
        />
        <span>/ {pageCount || "?"}</span>
      </form>
    </>
  );
}
