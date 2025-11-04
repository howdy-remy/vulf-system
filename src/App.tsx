import "./App.css";
import { Header } from "./components/Header";
import { AlbumCard } from "./components/Album";

import { albums } from "./data/albums";

function App() {
  return (
    <>
      <Header />
      {albums.map((album) => (
        <AlbumCard key={album.id} album={album} />
      ))}
    </>
  );
}

export default App;
