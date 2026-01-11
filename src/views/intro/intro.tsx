import styles from "./Intro.module.css";
import typography from "../../styles/typography.module.css";
import { albums } from "../../data/albums";
import { people } from "../../data/people";
import { useCountAnimation } from "../../hooks/useCountAnimation";

export const Intro = () => {
  const peopleCount = useCountAnimation({
    start: 0,
    end: people.length,
    duration: 2000,
  });

  const albumCount = useCountAnimation({
    start: 0,
    end: albums.length,
    duration: 2000,
  });

  return (
    <div className={`${styles.container}`}>
      <p className={typography.bodyLarge}>
        Vulfpeck has collaborated with at least <br />
        <span className={typography.red}>{peopleCount}</span> people across{" "}
        <span className={typography.red}>{albumCount}</span> albums.
      </p>
    </div>
  );
};
