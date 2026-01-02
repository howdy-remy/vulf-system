import styles from "./Intro.module.css";
import typography from "../../styles/typography.module.css";
import { albums } from "../../data/albums";
import { people } from "../../data/people";

export const Intro = () => {
  return (
    <div className={styles.container}>
      <p className={typography.bodyLarge}>
        Vulfpeck has collaborated with {people.length} people across{" "}
        {albums.length} albums.
      </p>
    </div>
  );
};
