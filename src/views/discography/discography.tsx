import { ScrollSync, ScrollSyncPane } from "react-scroll-sync";

import { albums } from "../../data/albums";

import { SectionHeader } from "../../components/SectionHeader";
import { CharacterLine } from "../../components/CharacterLine";
import { AlbumCard } from "../../components/Album";

import typography from "../../styles/typography.module.css";
import grid from "../../styles/grid.module.css";
import styles from "./discography.module.css";
import { people } from "../../data/people";
import { peopleAlbums } from "../../data/people_albums";

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
      <ScrollSync horizontal>
        <div className={styles.stickyContainer}>
          <SectionHeader title="discography" />
          <div className={`${styles.container} ${styles.stickyHeader}`}>
            <div className={grid.gridOneCol}>
              <h3 className={typography.h3}>Albums</h3>
              <p className={typography.body}>sort by</p>
              <p className={typography.body}>filter by</p>
            </div>
            <div className={`${styles.borderRight} ${grid.gridOneCol}`} />
            <ScrollSyncPane>
              <div className={styles.albumContainer}>
                {albums.map((album) => (
                  <AlbumCard key={album.id} album={album} />
                ))}
              </div>
            </ScrollSyncPane>
          </div>
          <CharacterLine character="=" />
          <div className={styles.container}>
            <div className={grid.gridOneCol}>
              <h3 className={typography.h3}>Person</h3>

              <div className={styles.gridOneCol}>
                <p className={typography.body}>order</p>
                <p>--- select ---</p>
              </div>
            </div>

            <div className={`${grid.gridOneCol} ${styles.borderRight}`}>
              {people.map((person) => (
                <p
                  key={person.id}
                  className={`${typography.body} ${typography.ellipsis}`}
                  title={person.name}
                >
                  {person.name}
                </p>
              ))}
            </div>
            <ScrollSyncPane>
              <div className={styles.participation}>
                {people.map((person) => (
                  <div key={`person__${person.id}`} className={styles.albumRow}>
                    {albums.map((album) => (
                      <div
                        key={`${person.id}-${album.id}`}
                        className={grid.gridOneCol}
                      >
                        {isPersonInAlbum(person.id, album.id) ? (
                          <p
                            className={`${typography.body} ${typography.black}`}
                          >
                            ××××××××××××××××××
                          </p>
                        ) : (
                          <p
                            className={`${typography.body} ${typography.light}`}
                          >
                            ------------------
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </ScrollSyncPane>
          </div>
          <CharacterLine character="=" />
        </div>
      </ScrollSync>
    </>
  );
};
