import styles from "./intro.module.css";
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
      <p className={`${typography.bodyLarge} ${styles.introText}`}>
        Vulfpeck has collaborated with at least <br />
        <span className={typography.red}>{peopleCount}</span> people across{" "}
        <span className={typography.red}>{albumCount}</span> albums.
      </p>
      <p className={typography.body}>
        I've included data from bands associated with four Vulfpeck members:
        <br />
        Joe Dart, Woody Goss, Theo Katzman, and Jack Stratton.
      </p>
    </div>
  );
};
