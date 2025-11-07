export interface Album {
  id: string;
  title: string;
  artist: string;
  release_date: Date;
  cover: string;
}

export const albums: Album[] = [
  {
    id: "mit-peck",
    title: "Mit Peck",
    artist: "Vulfpeck",
    release_date: new Date("2011-12-20"),
    cover: "src/assets/albums/vulfpeck_mit-peck.jpg",
  },
  {
    id: "vollmilch",
    title: "Vollmilch",
    artist: "Vulfpeck",
    release_date: new Date("2012-12-20"),
    cover: "src/assets/albums/vulfpeck_vollmilch.jpg",
  },
  {
    id: "my-first-car",
    title: "My First Car",
    artist: "Vulfpeck",
    release_date: new Date("2013-02-27"),
    cover: "src/assets/albums/vulfpeck_my-first-car.jpg",
  },
  {
    id: "sleepify",
    title: "Sleepify",
    artist: "Vulfpeck",
    release_date: new Date("2014-03-14"),
    cover: "src/assets/albums/vulfpeck_sleepify.jpg",
  },
  {
    id: "fugue-state",
    title: "Fugue State",
    artist: "Vulfpeck",
    release_date: new Date("2014-08-26"),
    cover: "src/assets/albums/vulfpeck_fugue-state.jpg",
  },

  {
    id: "thrill-of-the-arts",
    title: "Thrill of the Arts",
    artist: "Vulfpeck",
    release_date: new Date("2015-10-09"),
    cover: "src/assets/albums/vulfpeck_thrill-of-the-arts.jpg",
  },
  {
    id: "the-beautiful-game",
    title: "The Beautiful Game",
    artist: "Vulfpeck",
    release_date: new Date("2016-10-17"),
    cover: "src/assets/albums/vulfpeck_the-beautiful-game.jpg",
  },
  {
    id: "mr-finish-line",
    title: "Mr. Finish Line",
    artist: "Vulfpeck",
    release_date: new Date("2017-11-07"),
    cover: "src/assets/albums/vulfpeck_mr-finish-line.jpg",
  },
  {
    id: "hill-climber",
    title: "Hill Climber",
    artist: "Vulfpeck",
    release_date: new Date("2018-12-07"),
    cover: "src/assets/albums/vulfpeck_hill-climber.jpg",
  },
  {
    id: "live-at-msg",
    title: "Live at Madison Square Garden",
    artist: "Vulfpeck",
    release_date: new Date("2019-12-10"),
    cover: "src/assets/albums/vulfpeck_live-at-msg.jpg",
  },
  {
    id: "the-joy-of-music",
    title: "The Joy of Music, the Job of Real Estate",
    artist: "Vulfpeck",
    release_date: new Date("2020-10-23"),
    cover: "src/assets/albums/vulfpeck_the-joy-of-music.jpg",
  },
  {
    id: "schvitz",
    title: "Schvitz",
    artist: "Vulfpeck",
    release_date: new Date("2022-12-30"),
    cover: "src/assets/albums/vulfpeck_schvitz.jpg",
  },
  {
    id: "clarity-of-cal",
    title: "Clarity of Cal",
    artist: "Vulfpeck",
    release_date: new Date("2025-03-04"),
    cover: "src/assets/albums/vulfpeck_clarity-of-cal.jpg",
  },
];
