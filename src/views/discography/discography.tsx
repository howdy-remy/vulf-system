import { useState } from "react";

import { albums } from "../../data/albums";
import { people } from "../../data/people";
import { peopleAlbums } from "../../data/people_albums";

import { AlbumCard } from "../../components/Album";
import { Select, type SelectItem } from "../../components/Select/Select";

import typography from "../../styles/typography.module.css";
import styles from "./discography.module.css";

export const Discography = () => {
  // filtering
  const [selectedValue, setSelectedValue] = useState("vulfpeck");

  const bands: Record<string, { value: string; label: string }> = {};
  albums.map((album) => {
    bands[album.bandId] = { value: album.bandId, label: album.band };
  });

  const bandOptions = Object.values(bands);
  const options: SelectItem[] = [
    {
      label: "band",
      isGroup: true,
      items: bandOptions,
    },
  ];

  const filteredAlbums = albums.filter(
    (album) => selectedValue === album.bandId
  );

  // build person-album lookup
  const personAlbumLookup: Record<string, Set<string>> = {};
  peopleAlbums.forEach((pa) => {
    if (!personAlbumLookup[pa.personId]) {
      personAlbumLookup[pa.personId] = new Set();
    }
    personAlbumLookup[pa.personId].add(pa.albumId);
  });

  // determine if person is in album
  const isPersonInAlbum = (personId: string, albumId: string): boolean => {
    return personAlbumLookup[personId]?.has(albumId) ?? false;
  };

  return (
    <>
      <h2 className={typography.h2}>discography</h2>
      <div className={styles.stickyContainer}>
        <div className={styles.container}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th
                  scope="row"
                  className={`${styles.th} ${styles.stickyCorner}`}
                >
                  <h3 className={typography.h3}>Albums</h3>
                  <p className={typography.body}>filter by</p>
                  <Select
                    options={options}
                    value={selectedValue}
                    onChange={setSelectedValue}
                    placeholder="vulfpeck"
                  />
                </th>
                <td
                  className={`${styles.td} ${styles.borderRight} ${styles.stickyCornerSecond}`}
                />
                {filteredAlbums.map((album) => (
                  <th
                    className={`${styles.th} ${styles.stickyHeader}`}
                    key={album.id}
                  >
                    <AlbumCard key={album.id} album={album} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className={styles.separatorRow}>
                <td colSpan={albums.length + 2}>
                  <p className={typography.body}>
                    {"=".repeat(((albums.length + 2) * 175) / 8.85)}
                  </p>
                </td>
              </tr>
            </tbody>
            <tbody>
              <tr>
                <th
                  scope="row"
                  className={`${styles.th} ${styles.stickyColumn}`}
                  rowSpan={people.length + 1}
                >
                  <h3 className={typography.h3}>Person</h3>

                  <div>
                    <p className={typography.body}>order</p>
                    <p>--- select ---</p>
                  </div>
                </th>
                <td className={`${styles.td} ${styles.stickyColumnSecond}`} />
              </tr>
              {people.map((person) => (
                <tr key={person.id} title={person.name}>
                  <th
                    className={`${styles.stickyColumnSecond} ${styles.th} ${styles.borderRight}`}
                    scope="row"
                  >
                    <p className={`${typography.body} ${typography.ellipsis}`}>
                      {person.name}
                    </p>
                  </th>
                  {filteredAlbums.map((album) => {
                    return isPersonInAlbum(person.id, album.id) ? (
                      <td
                        key={`${person.id}-${album.id}`}
                        className={`${typography.body} ${typography.black}`}
                      >
                        ××××××××××××××××××
                      </td>
                    ) : (
                      <td
                        key={`${person.id}-${album.id}`}
                        className={`${typography.body} ${typography.light}`}
                      >
                        ------------------
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
