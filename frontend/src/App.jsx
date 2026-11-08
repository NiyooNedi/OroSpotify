
import { useEffect, useState } from "react";
import "./App.css";
import MusicPlayer from "./components/MusicPlayer";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

//func that converts duration from seconds to minutes:seconds
function formatDuration(seconds) {
  if (seconds === null || seconds === undefined) {
    return "--:--";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

//will be called in main file, will handle everything that's displayed
function App() {
  //initializing states for things that will change on webpage
  const [songs, setSongs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSong, setSelectedSong] = useState(null);

  //fetches songs from FastAPI when the page loads
  useEffect(() => {
    async function fetchSongs() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/songs_with_artists`);

        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`);
        }

        const data = await response.json();
        setSongs(data);
      } catch (err) {
        console.error("Error fetching songs:", err);
        setError(
          "Couldn't load your music. Make sure the backend is running."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchSongs();
  }, []);

  //filter the songs based on what the user types in search bar
  const filteredSongs = songs.filter((song) =>
    (song.song_name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app">
      {/* sidebar */}
      <aside className="sidebar">
        <div className="logo">
          <span className="logo-symbol">🌳</span>
          <span>OroSpotify</span>
        </div>

        <nav className="navigation">
          <p className="nav-heading">MENU</p>

          <button className="nav-item active">
            <span>⌂</span>
            Home
          </button>

          <button
            className="nav-item"
            onClick={() =>
              document.getElementById("song-search")?.focus()
            }
          >
            <span>⌕</span>
            Search
          </button>

          <button
            className="nav-item"
            onClick={() =>
              document.getElementById("song-library")?.scrollIntoView({
                behavior: "smooth",
              })
            }
          >
            <span>♫</span>
            Your Library
          </button>
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-decoration">✳</div>
          <p>Music connects us.</p>
          <span>Celebrating Oromo sounds.</span>
        </div>
      </aside>

      {/* main content area */}
      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">YOUR MUSIC, YOUR CULTURE</p>
            <h1>Discover Oromo Music</h1>
          </div>

          <div className="topbar-mark">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Flag_of_the_Oromia_Region.svg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original"
              alt="Oromo flag"
            />
          </div>
        </header>

      </main>
      
    </div>
  );
}

export default App;
