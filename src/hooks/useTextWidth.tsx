import { useEffect, useRef, useState } from "react";
import { useViewportWidth } from "./useViewportWidth";

import typography from "../styles/typography.module.css";

interface UseTextWidthReturn {
  textWidth: number;
  viewportWidthInCharacters: number;
  viewportWidth: number;
  Ruler: () => React.JSX.Element;
}

// Hook to calculate target width and find how many characters fit that width
export const useTextWidth = (): UseTextWidthReturn => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [viewportWidthInCharacters, setViewportWidthInCharacters] = useState(0);
  const [textWidth, setTextWidth] = useState(0);
  const measureRef = useRef<HTMLSpanElement>(null);

  const viewportWidth = useViewportWidth();
  const padding = viewportWidth < 565 ? 32 : 80;
  const targetWidth = viewportWidth - padding;

  // Wait for fonts to load
  useEffect(() => {
    document.fonts.ready.then(() => {
      setFontsLoaded(true);
    });
  }, []);

  // Binary search to find how many characters fit in the target width
  useEffect(() => {
    if (!measureRef.current || !fontsLoaded) return;

    let low = 1;
    let high = 200; // reasonable upper bound
    let bestFit = 0;
    let bestWidth = 0;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      
      // Temporarily update the content to measure
      measureRef.current.textContent = "-".repeat(mid);
      const width = measureRef.current.offsetWidth;
      
      if (width <= targetWidth) {
        bestFit = mid;
        bestWidth = width;
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }

    setViewportWidthInCharacters(bestFit);
    setTextWidth(bestWidth);
  }, [targetWidth, fontsLoaded]);

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
