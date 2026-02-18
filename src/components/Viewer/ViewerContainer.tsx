import React from "react";

export type ViewerContainerProps = {
  containerRef: React.RefObject<HTMLDivElement | null>;
  children: React.ReactNode;
};

export function ViewerContainer({ containerRef, children }: ViewerContainerProps) {
  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        overflow: "auto",
        padding: 8,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div style={{ position: "relative" }}>
        {children}
      </div>
    </div>
  );
}
