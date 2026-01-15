import { useEffect, useRef, useState } from "react";
import { useViewportWidth } from "./useViewportWidth";

import typography from "../styles/typography.module.css";

interface UseTextWidthReturn {
  textWidth: number;
  viewportWidthInCharacters: number;
  viewportWidth: number;
  Ruler: () => React.JSX.Element;
}

// Hook to measure text width and calculate viewport width in characters
export const useTextWidth = (): UseTextWidthReturn => {
  const [textWidth, setTextWidth] = useState(0);
  const measureRef = useRef<HTMLSpanElement>(null);

  const viewportWidth = useViewportWidth();
  const characterWidth = 8.85; // approximate width of a character in pixels
  const padding = viewportWidth < 565 ? 32 : 80; // adjust padding based on viewport size
  const viewportWidthInCharacters = Math.floor(
    (viewportWidth - padding) / characterWidth
  );

  useEffect(() => {
    if (measureRef.current) {
      const width = measureRef.current.offsetWidth;
      setTextWidth(width);
    }
  }, [viewportWidthInCharacters]);

  const Ruler = () => (
    <span
      ref={measureRef}
      className={typography.body}
      style={{
        position: "absolute",
        visibility: "hidden",
        whiteSpace: "nowrap",
      }}
    >
      {"-".repeat(viewportWidthInCharacters)}
    </span>
  );

  return {
    textWidth,
    viewportWidthInCharacters,
    viewportWidth,
    Ruler,
  };
};
