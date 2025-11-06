import { albums } from "../../data/albums";
import { peopleAlbums } from "../../data/people_albums";

export const getAlbumsForPerson = async (personId: string) => {
  // find all album IDs associated with the given personId
  const albumIds = peopleAlbums
    .filter((pa) => pa.personId === personId)
    .map((pa) => pa.albumId);

  // retrieve the album details for the found albumIds
  const personAlbums = albums.filter((album) => albumIds.includes(album.id));

  return personAlbums;
};
