import { useEffect, useRef, useState } from "react";
import { useViewportWidth } from "./useViewportWidth";

import typography from "../styles/typography.module.css";

interface UseTextWidthReturn {
  textWidth: number;
  viewportWidthInCharacters: number;
  viewportWidth: number;
  Ruler: () => React.JSX.Element;
}

export const PADDING = 80;
export const CHARACTER_WIDTH = 8.8; // approximate width of a character in pixels

// hook to measure text width and calculate viewport width in characters
export const useTextWidth = (): UseTextWidthReturn => {
  const measureRef = useRef<HTMLSpanElement>(null);

  // wait for fonts to load
  const [fontsLoaded, setFontsLoaded] = useState(false);
  useEffect(() => {
    document.fonts.ready.then(() => {
      setFontsLoaded(true);
    });
  }, []);

  // get with of text in characters
  const [textWidth, setTextWidth] = useState(0);
  const viewportWidth = useViewportWidth();
  const viewportWidthInCharacters = Math.floor(
    (viewportWidth - PADDING) / CHARACTER_WIDTH
  );

  useEffect(() => {
    if (measureRef.current && fontsLoaded) {
      const width = measureRef.current.offsetWidth;
      setTextWidth(width > 0 ? width : 0);
    }
  }, [viewportWidthInCharacters, fontsLoaded]);

  // ruler component to measure actual text width
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
