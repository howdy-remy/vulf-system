import { useEffect, useRef, useState } from "react";
import { useViewportWidth } from "./useViewportWidth";

import typography from "../styles/typography.module.css";

interface UseTextWidthReturn {
  textWidth: number;
  viewportWidthInCharacters: number;
  viewportWidth: number;
  Ruler: () => React.JSX.Element;
}

// hook to measure text width and calculate viewport width in characters
export const useTextWidth = (): UseTextWidthReturn => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const [textWidth, setTextWidth] = useState(0);
  const [calibratedCharWidth, setCalibratedCharWidth] = useState(8.8);
  const measureRef = useRef<HTMLSpanElement>(null);

  const viewportWidth = useViewportWidth();
  const padding = viewportWidth < 565 ? 16 : 80; // adjust padding based on viewport size
  const viewportWidthInCharacters = Math.floor(
    (viewportWidth - padding) / calibratedCharWidth
  );

  // wait for fonts to load
  useEffect(() => {
    document.fonts.ready.then(() => {
      setFontsLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (measureRef.current && fontsLoaded && viewportWidthInCharacters > 0) {
      const actualWidth = measureRef.current.offsetWidth;
      setTextWidth(actualWidth);

      // calibrate character width based on actual measurement
      const actualCharWidth = actualWidth / viewportWidthInCharacters;
      setCalibratedCharWidth(actualCharWidth);
    }
  }, [viewportWidthInCharacters, fontsLoaded]);

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
