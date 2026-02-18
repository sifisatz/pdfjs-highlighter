import { useCallback } from "react";
import { prevPage, nextPage, clampPage } from "../controllers/navigationController.js";

export function usePageNavigation(
  page: number,
  setPage: React.Dispatch<React.SetStateAction<number>>,
  pageCount: number,
) {
  const goToPage = useCallback(
    (target: number) => {
      const safe = clampPage(target, pageCount);
      setPage(safe);
    },
    [pageCount, setPage],
  );

  const goPrev = useCallback(() => {
    setPage((p) => prevPage(p));
  }, [setPage]);

  const goNext = useCallback(() => {
    setPage((p) => nextPage(p, pageCount));
  }, [pageCount, setPage]);

  return {
    goToPage,
    goPrev,
    goNext,
    canGoPrev: page > 1,
    canGoNext: pageCount > 0 && page < pageCount,
  };
}
