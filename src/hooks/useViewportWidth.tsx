import { useEffect, useState } from "react";

// hook to get the current viewport width with
// debounced resize handling

export function useViewportWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    let timeoutId: number;

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setWidth(window.innerWidth);
      }, 100); // 100ms debounce
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  return width;
}
