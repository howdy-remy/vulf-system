import { useTextWidth } from "../../hooks/useTextWidth";

import typography from "../../styles/typography.module.css";

type CharacterLineProps = {
  character?: string;
};

export const CharacterLine = ({ character = "-" }: CharacterLineProps) => {
  const { viewportWidthInCharacters } = useTextWidth();

  return (
    <p className={typography.body}>
      {character.repeat(viewportWidthInCharacters)}
    </p>
  );
};
