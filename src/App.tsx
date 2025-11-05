import "./App.css";
import { Header } from "./components/Header";
import { AlbumCard } from "./components/Album";

import { albums } from "./data/albums";
import { SectionHeader } from "./components/SectionHeader";

function App() {
  return (
    <>
      <Header />
      <SectionHeader title="discography" />
      {albums.map((album) => (
        <AlbumCard key={album.id} album={album} />
      ))}
    </>
  );
}

export default App;
