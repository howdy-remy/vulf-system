export interface Album {
  id: number;
  title: string;
  artist: string;
  release_date: Date;
  cover: string;
}

export const albums: Album[] = [
  {
    id: 1,
    title: "Mit Peck",
    artist: "Vulfpeck",
    release_date: new Date("2011-09-23"),
    cover: "src/assets/albums/vulfpeck_mit-peck.jpg",
  },
  {
    id: 2,
    title: "My First Car",
    artist: "Vulfpeck",
    release_date: new Date("2013-01-01"),
    cover: "src/assets/albums/vulfpeck_my-first-car.jpg",
  },
  {
    id: 3,
    title: "Sleepify",
    artist: "Vulfpeck",
    release_date: new Date("2014-03-14"),
    cover: "src/assets/albums/vulfpeck_sleepify.jpg",
  },
  {
    id: 4,
    title: "Fugue State",
    artist: "Vulfpeck",
    release_date: new Date("2014-04-08"),
    cover: "src/assets/albums/vulfpeck_fugue-state.jpg",
  },
  {
    id: 5,
    title: "Vollmilch",
    artist: "Vulfpeck",
    release_date: new Date("2013-12-17"),
    cover: "src/assets/albums/vulfpeck_vollmilch.jpg",
  },
  {
    id: 6,
    title: "Thrill of the Arts",
    artist: "Vulfpeck",
    release_date: new Date("2015-11-09"),
    cover: "src/assets/albums/vulfpeck_thrill-of-the-arts.jpg",
  },
  {
    id: 7,
    title: "The Beautiful Game",
    artist: "Vulfpeck",
    release_date: new Date("2016-10-21"),
    cover: "src/assets/albums/vulfpeck_the-beautiful-game.jpg",
  },
  {
    id: 8,
    title: "Mr. Finish Line",
    artist: "Vulfpeck",
    release_date: new Date("2017-11-03"),
    cover: "src/assets/albums/vulfpeck_mr-finish-line.jpg",
  },
  {
    id: 9,
    title: "Hill Climber",
    artist: "Vulfpeck",
    release_date: new Date("2018-12-14"),
    cover: "src/assets/albums/vulfpeck_hill-climber.jpg",
  },
  {
    id: 10,
    title: "Live at Madison Square Garden",
    artist: "Vulfpeck",
    release_date: new Date("2019-12-06"),
    cover: "src/assets/albums/vulfpeck_live-at-msg.jpg",
  },
  {
    id: 11,
    title: "The Joy of Music, the Job of Real Estate",
    artist: "Vulfpeck",
    release_date: new Date("2020-10-16"),
    cover: "src/assets/albums/vulfpeck_the-joy-of-music.jpg",
  },
  {
    id: 12,
    title: "Schvitz",
    artist: "Vulfpeck",
    release_date: new Date("2022-12-02"),
    cover: "src/assets/albums/vulfpeck_schvitz.jpg",
  },
  {
    id: 13,
    title: "Clarity of Cal",
    artist: "Vulfpeck",
    release_date: new Date("2025-03-04"),
    cover: "src/assets/albums/vulfpeck_clarity-of-cal.jpg",
  },
];
