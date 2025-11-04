import React from "react";
import typography from "../../styles/typography.module.css";
import { useViewportWidth } from "../../hooks/useViewportWidth";

export const Header: React.FC = () => {
  const title = "--- the vulf system --- a vulfpeck fan page ---";
  const attribution = " by howdyremy ---";

  const viewportWidth = useViewportWidth();
  const characterWidth = 9; // Approximate width of a character in pixels
  const viewportWidthInCharacters = Math.floor(
    (viewportWidth - 80) / characterWidth - 1
  );

  const viewportFillerLength =
    viewportWidthInCharacters > title.length
      ? viewportWidthInCharacters
      : title.length;
  const titleFillerLength =
    viewportWidthInCharacters - title.length - attribution.length;

  return (
    <header>
      <p className={typography.body}>{"-".repeat(viewportFillerLength)}</p>
      <h1 className={typography.h1}>
        {title}
        {"-".repeat(titleFillerLength > 0 ? titleFillerLength : 0)}
        {attribution}
      </h1>
      <p className={typography.body}>{"-".repeat(viewportFillerLength)}</p>
    </header>
  );
};
