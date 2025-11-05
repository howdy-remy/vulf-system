import styles from "./SectionHeader.module.css";
import typography from "../../styles/typography.module.css";

type SectionHeaderProps = {
  title: string;
};
export const SectionHeader = ({ title }: SectionHeaderProps) => {
  return (
    <header className={styles.sectionHeader}>
      <h2 className={typography.h2}>{title}</h2>
    </header>
  );
};
