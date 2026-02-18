import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
} from "react";
import type { PdfViewerRef, PdfHighlighterViewerProps } from "../../types/viewer.js";
import type { Highlight } from "../../types/Highlight.js";
import { usePdfDocument } from "../../hooks/usePdfDocument.js";
import { usePdfPage } from "../../hooks/usePdfPage.js";
import { useZoom } from "../../hooks/useZoom.js";
import { usePageNavigation } from "../../hooks/usePageNavigation.js";
import { useCtrlWheelZoom } from "../../hooks/useCtrlWheelZoom.js";
import { useDownloadUrl } from "../../hooks/useDownloadUrl.js";
import { useHighlightFocus } from "../../hooks/useHighlightFocus.js";
import { navigateToLinkedField, DEFAULT_FOCUS_CLASS } from "../../utils/linkedFieldNavigation.js";
import { Toolbar } from "../Toolbar/Toolbar.js";
import { ViewerContainer } from "./ViewerContainer.js";
import { PdfPage } from "./PdfPage.js";
import { HighlightLayer } from "../Highlights/HighlightLayer.js";

export const PdfHighlighterViewer = forwardRef<PdfViewerRef, PdfHighlighterViewerProps>(
  function PdfHighlighterViewer(
    {
      source,
      highlights,
      initialPage = 1,
      zoomStep = 0.2,
      minZoom = 0.5,
      maxZoom = 3,
      initialZoom = 1,
      toolbar: showToolbar = true,
      renderToolbar,
      onHighlightClick,
      renderHighlightTooltip,
      enableHighlightNavigation = true,
      highlightScrollBehavior = "smooth",
      highlightFocusZoom,
      enableCtrlWheelZoom = true,
      showZoomControls = true,
      enableFieldNavigation = false,
      onLinkedFieldFocus,
      linkedFieldFocusClassName,
      className,
      style,
    },
    ref,
  ) {
    const containerRef = useRef<HTMLDivElement | null>(null);

    const { pdfDocument, pageCount, page, setPage } = usePdfDocument(source, initialPage);
    const pageProxy = usePdfPage(pdfDocument, page);

    const { zoom, setZoom, zoomIn, zoomOut, resetZoom } = useZoom(
      initialZoom,
      minZoom,
      maxZoom,
      zoomStep,
    );

    const { goToPage, goPrev, goNext, canGoPrev, canGoNext } = usePageNavigation(
      page,
      setPage,
      pageCount,
    );

    useCtrlWheelZoom(containerRef, {
      enabled: enableCtrlWheelZoom,
      zoom,
      setZoom,
      zoomStep,
      minZoom,
      maxZoom,
    });

    const downloadUrl = useDownloadUrl(source);

    const {
      highlightRefs,
      focusedHighlightId,
      setPendingFocusHighlightId,
      goToHighlight,
    } = useHighlightFocus(
      highlights,
      page,
      pageCount,
      setPage,
      setZoom,
      highlightFocusZoom,
      highlightScrollBehavior,
    );

    const focusClass = linkedFieldFocusClassName ?? DEFAULT_FOCUS_CLASS;

    const goToLinkedField = useCallback(
      (highlightId: string) => {
        const h = highlights?.find((x) => x.id === highlightId);
        if (!h?.linkedFieldId) return;
        const el = navigateToLinkedField(h, { focusClass });
        onLinkedFieldFocus?.(h, el ?? null);
      },
      [highlights, focusClass, onLinkedFieldFocus],
    );

    useImperativeHandle(
      ref,
      () => ({
        goToPage,
        goToHighlight,
        goToLinkedField,
      }),
      [goToPage, goToHighlight, goToLinkedField],
    );

    const handleHighlightInteraction = useCallback(
      (h: Highlight) => {
        if (enableFieldNavigation && h.linkedFieldId) {
          const element = navigateToLinkedField(h, { focusClass });
          onLinkedFieldFocus?.(h, element ?? null);
          if (element) return;
        }
        if (!enableHighlightNavigation) return;
        setPendingFocusHighlightId(h.id);
        if (highlightFocusZoom != null) setZoom(highlightFocusZoom);
        if (h.page !== page) setPage(h.page);
      },
      [
        enableFieldNavigation,
        focusClass,
        onLinkedFieldFocus,
        enableHighlightNavigation,
        highlightFocusZoom,
        page,
        setPage,
        setZoom,
        setPendingFocusHighlightId,
      ],
    );

    const handleDownload = useCallback(() => {
      if (!downloadUrl) return;
      const a = globalThis.document.createElement("a");
      a.href = downloadUrl;
      a.download = "document.pdf";
      a.click();
    }, [downloadUrl]);

    const toolbarProps = {
      page,
      pageCount,
      canGoPrev,
      canGoNext,
      zoom,
      onPrevPage: goPrev,
      onNextPage: goNext,
      onGoToPage: goToPage,
      onZoomIn: zoomIn,
      onZoomOut: zoomOut,
      onResetZoom: resetZoom,
      onDownload: handleDownload,
      showZoomControls,
    };

    return (
      <>
        <style>{`
          @keyframes pdf-highlighter-viewer-pulse {
            0%, 100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.5); }
            50% { box-shadow: 0 0 0 6px rgba(59, 130, 246, 0); }
          }
          @keyframes pdf-highlighter-viewer-linked-field-pulse {
            0%, 100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); outline-color: rgba(59, 130, 246, 0.8); }
            50% { box-shadow: 0 0 0 6px rgba(59, 130, 246, 0); outline-color: rgba(59, 130, 246, 0.5); }
          }
          .pdf-highlighter-viewer-linked-field-focus {
            outline: 2px solid rgba(59, 130, 246, 0.8);
            outline-offset: 2px;
            animation: pdf-highlighter-viewer-linked-field-pulse 2s ease-in-out;
          }
        `}</style>
        <div
          className={className}
          style={{
            display: "flex",
            flexDirection: "column",
            border: "1px solid #e5e7eb",
            borderRadius: 4,
            overflow: "hidden",
            background: "#ffffff",
            ...style,
          }}
        >
          {showToolbar &&
            (renderToolbar ? renderToolbar(toolbarProps) : <Toolbar {...toolbarProps} />)}

          <ViewerContainer containerRef={containerRef}>
            <PdfPage pageProxy={pageProxy} zoom={zoom} />
            <HighlightLayer
              highlights={highlights}
              pageNumber={page}
              pageProxy={pageProxy}
              zoom={zoom}
              focusedHighlightId={focusedHighlightId}
              enableHighlightNavigation={enableHighlightNavigation}
              onHighlightClick={onHighlightClick}
              onHighlightInteraction={handleHighlightInteraction}
              renderHighlightTooltip={renderHighlightTooltip}
              highlightRefs={highlightRefs}
            />
          </ViewerContainer>
        </div>
      </>
    );
  },
);
