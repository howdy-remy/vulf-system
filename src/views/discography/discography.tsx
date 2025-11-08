import { CharacterLine } from "../../components/CharacterLine";
import { AlbumCard } from "../../components/Album";

import { albums } from "../../data/albums";
import { people } from "../../data/people";
import { peopleAlbums } from "../../data/people_albums";

import typography from "../../styles/typography.module.css";
import styles from "./discography.module.css";

export const Discography = () => {
  const personAlbumLookup: Record<string, Set<string>> = {};
  peopleAlbums.forEach((pa) => {
    if (!personAlbumLookup[pa.personId]) {
      personAlbumLookup[pa.personId] = new Set();
    }
    personAlbumLookup[pa.personId].add(pa.albumId);
  });

  // Check function
  const isPersonInAlbum = (personId: string, albumId: string): boolean => {
    return personAlbumLookup[personId]?.has(albumId) ?? false;
  };

  return (
    <>
      <h2 className={typography.h2}>discography</h2>
      <div className={styles.stickyContainer}>
        <div className={styles.container}>
          <table className={styles.table}>
            <thead className={styles.stickyHeader}>
              <tr>
                <th
                  scope="row"
                  className={`${styles.th} ${styles.stickyColumn}`}
                >
                  <h3 className={typography.h3}>Albums</h3>
                  <p className={typography.body}>sort by</p>
                  <p className={typography.body}>filter by</p>
                </th>
                <td className={`${styles.td} ${styles.stickyColumn2}`} />
                {albums.map((album) => (
                  <th className={styles.th} key={album.id}>
                    <AlbumCard key={album.id} album={album} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={albums.length + 2}>
                  <CharacterLine character="=" />
                </td>
              </tr>
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
                <td className={`${styles.td} ${styles.stickyColumn2}`} />
              </tr>
              {people.map((person) => (
                <tr key={person.id} title={person.name}>
                  <th
                    className={`${typography.body} ${typography.ellipsis} ${styles.stickyColumn}`}
                  >
                    {person.name}
                  </th>
                  {albums.map((album) => {
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
