import { useViewportWidth } from "../../hooks/useViewportWidth";

import styles from "./CharacterLine.module.css";
import typography from "../../styles/typography.module.css";

export const CharacterLine = ({ character = "-" }: { character?: string }) => {
  // viewport calculations
  const viewportWidth = useViewportWidth();
  const characterWidth = 8.85; // approximate width of a character in pixels
  const viewportWidthInCharacters = Math.floor(
    (viewportWidth - 80) / characterWidth - 1 // 80 = padding
  );

  return (
    <div className={styles.container}>
      <p className={typography.body}>
        {character.repeat(viewportWidthInCharacters)}
      </p>
    </div>
  );
};
