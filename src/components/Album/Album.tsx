import React from "react";
import styles from "./Album.module.css";
import typography from "../../styles/typography.module.css";
import { type Album } from "../../data/albums";

export const AlbumCard: React.FC<{ album: Album }> = ({ album }) => {
  const formattedDate = album.release_date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className={styles.card}>
      <img
        className={styles.cover}
        src={`albums/${album.cover}`}
        alt={album.title}
      />
      <h4 className={`${typography.body} ${typography.italic}`}>
        {album.title}
      </h4>
      <p className={typography.body}>{album.band}</p>
      <p className={typography.body}>{formattedDate}</p>
    </div>
  );
};
