import { useState } from "react";

import { albums } from "../../data/albums";
import { people } from "../../data/people";
import { peopleAlbums } from "../../data/people_albums";

import { AlbumCard } from "../../components/Album";
import { Select, type SelectItem } from "../../components/Select/Select";

import typography from "../../styles/typography.module.css";
import styles from "./discography.module.css";

export const Discography = () => {
  // bands
  const bands: Record<string, { value: string; label: string }> = {};
  albums.map((album) => {
    bands[album.bandId] = { value: album.bandId, label: album.band };
  });

  // filter albums -------------------------------------------------------------
  const [selectedValue, setSelectedValue] = useState<string>("vulfpeck");
  const bandOptions = Object.values(bands);
  const options: SelectItem[] = [
    { value: "all", label: "all" },
    {
      label: "band",
      isGroup: true,
      items: bandOptions,
    },
  ];
  const filteredAlbums = albums.filter((album) => {
    if (selectedValue === "all") {
      return true;
    }
    return selectedValue === album.bandId;
  });

  // sort albums ---------------------------------------------------------------
  const sortedAlbums = filteredAlbums.sort(
    (a, b) => a.release_date.getTime() - b.release_date.getTime()
  );

  // filteredPeopleAlbums -------------------------------------------------------
  const filteredPeopleAlbums = peopleAlbums.filter((pa) =>
    sortedAlbums.find((album) => album.id === pa.albumId)
  );

  // filter people -------------------------------------------------------------
  // (only people who are in the filtered albums)
  const filteredPeople = people.filter((person) =>
    filteredPeopleAlbums.find((pa) => pa.personId === person.id)
  );

  // sort people ---------------------------------------------------------------
  const [sortPeopleBy, setSortPeopleBy] = useState<string>("introduced");
  const sortPeopleOptions: SelectItem[] = [
    { value: "introduced", label: "as introduced" },
    { value: "frequency", label: "by frequency" },
    { value: "lastName", label: "by last name" },
  ];

  const sortedPeople = filteredPeople.slice().sort((a, b) => {
    if (sortPeopleBy === "lastName") {
      const aLastName = a.name.split(" ").slice(-1)[0];
      const bLastName = b.name.split(" ").slice(-1)[0];
      return aLastName.localeCompare(bLastName);
    } else if (sortPeopleBy === "frequency") {
      const aCount = filteredPeopleAlbums.filter(
        (pa) => pa.personId === a.id
      ).length;
      const bCount = filteredPeopleAlbums.filter(
        (pa) => pa.personId === b.id
      ).length;
      return bCount - aCount; // descending
    } else {
      // introduced
      const aFirstAlbum = filteredPeopleAlbums
        .filter((pa) => pa.personId === a.id)
        .map((pa) => {
          const album = albums.find((al) => al.id === pa.albumId);
          return album ? album.release_date.getTime() : Infinity;
        })
        .sort((x, y) => x - y)[0];
      const bFirstAlbum = filteredPeopleAlbums
        .filter((pa) => pa.personId === b.id)
        .map((pa) => {
          const album = albums.find((al) => al.id === pa.albumId);
          return album ? album.release_date.getTime() : Infinity;
        })
        .sort((x, y) => x - y)[0];
      return aFirstAlbum - bFirstAlbum;
    }
  });

  // is person in album --------------------------------------------------------
  const personAlbumLookup: Record<string, Set<string>> = {};
  peopleAlbums.forEach((pa) => {
    if (!personAlbumLookup[pa.personId]) {
      personAlbumLookup[pa.personId] = new Set();
    }
    personAlbumLookup[pa.personId].add(pa.albumId);
  });

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
                {sortedAlbums.map((album) => (
                  <th
                    className={`${styles.th} ${styles.stickyHeader}`}
                    key={album.id}
                  >
                    <AlbumCard key={album.id} album={album} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className={styles.separatorBody}>
              <tr className={styles.separatorRow}>
                <td colSpan={albums.length + 2}>
                  <p className={typography.body}>
                    {"=".repeat(((sortedAlbums.length + 2) * 175) / 8.85)}
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
                    <Select
                      options={sortPeopleOptions}
                      value={sortPeopleBy}
                      onChange={setSortPeopleBy}
                      placeholder="introduced"
                    />
                  </div>
                </th>
                <td className={`${styles.td} ${styles.stickyColumnSecond}`} />
              </tr>
              {sortedPeople.map((person) => (
                <tr key={person.id} title={person.name}>
                  <th
                    className={`${styles.stickyColumnSecond} ${styles.th} ${styles.borderRight}`}
                    scope="row"
                  >
                    <p className={`${typography.body} ${typography.ellipsis}`}>
                      {person.name}
                    </p>
                  </th>
                  {sortedAlbums.map((album) => {
                    return isPersonInAlbum(person.id, album.id) ? (
                      <td
                        key={`${person.id}-${album.id}`}
                        className={`${styles.td} ${typography.body} ${typography.black}`}
                      >
                        ××××××××××××××××××
                      </td>
                    ) : (
                      <td
                        key={`${person.id}-${album.id}`}
                        className={`${styles.td} ${typography.body} ${typography.light}`}
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
