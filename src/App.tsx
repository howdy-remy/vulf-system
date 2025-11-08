import { Header } from "./components/Header";
import { Discography } from "./views/discography";
import styles from "./App.module.css";
import { useTextWidth } from "./hooks/useTextWidth";

function App() {
  const { textWidth, Ruler } = useTextWidth();

  return (
    <div>
      {/* Hidden element to measure text width */}
      <Ruler />

      {/* Main website content with measured width */}
      <div className={styles.appContainer}>
        <div
          className={styles.appContent}
          style={{
            width: textWidth || "auto",
          }}
        >
          <Header />
          <Discography />
        </div>
      </div>
    </div>
  );
}

export default App;
