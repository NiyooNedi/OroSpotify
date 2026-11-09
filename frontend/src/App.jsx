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

        {/* welcome section */}
        <section className="hero">
          <div className="hero-content">
            <p className="hero-label">WELCOME TO OROSPOTIFY</p>

            <h2>
              The sounds of
              <br />
              <span>our people.</span>
            </h2>

            <p className="hero-description">
              Explore Oromo music, discover artists, and celebrate
              the sounds that bring us together.
            </p>

            <a href="#song-library" className="hero-button">
              Explore music <span>→</span>
            </a>
          </div>

          <div className="hero-art">
            <div className="art-circle circle-one"></div>
            <div className="art-circle circle-two"></div>

            <div className="art-center">
              <span>OROMO</span>
              <span className="art-note">♫</span>
            </div>

            <span className="art-decoration decoration-one">✳</span>
            <span className="art-decoration decoration-two">✦</span>
          </div>
        </section>

        {/* song library */}
        <section className="library-section" id="song-library">
          <div className="section-heading">
            <div>
              <p className="eyebrow">EXPLORE YOUR COLLECTION</p>
              <h2>Song Library</h2>
            </div>

            <span className="song-count">
              {songs.length} {songs.length === 1 ? "SONG" : "SONGS"}
            </span>
          </div>

          {/* search bar */}
          <div className="search-container">
            <span className="search-icon">⌕</span>

            <input
              id="song-search"
              type="text"
              placeholder="Search for a song..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />

            {search && (
              <button
                className="clear-search"
                onClick={() => setSearch("")}
              >
                ✕
              </button>
            )}
          </div>

          {/* the loading state */}
          {loading && (
            <div className="message">Loading your music...</div>
          )}

          {/* error state */}
          {!loading && error && (
            <div className="message error-message">{error}</div>
          )}

          {/* empty state */}
          {!loading && !error && filteredSongs.length === 0 && (
            <div className="message">
              {search
                ? "No songs match your search."
                : "Your music library is empty."}
            </div>
          )}

          {/* displaying all songs */}
          {!loading && !error && filteredSongs.length > 0 && (
            <div className="song-list">
              <div className="song-list-header">
                <span>#</span>
                <span>SONG TITLE</span>
                <span>ARTIST</span>
                <span>DURATION</span>
              </div>

              {filteredSongs.map((song, index) => (
                <button
                  className={`song-row ${
                    selectedSong?.song_id === song.song_id
                      ? "selected"
                      : ""
                  }`}
                  key={song.song_id}
                  onClick={() => setSelectedSong(song)}
                >
                  <span className="song-number">
                    {selectedSong?.song_id === song.song_id
                      ? "♫"
                      : index + 1}
                  </span>

                  <span className="song-title">
                    <img className="song-artwork"
                      src={song.image_url} alt={song.song_name}
                    />
                    <span>{song.song_name}</span>
                  </span>

                  <span className="song-artist">
                    <span>{song.artist_name}</span>
                  </span>

                  <span className="song-duration">
                    {formatDuration(song.duration)}
                  </span>
                </button>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Music player */}
      <footer className="player-bar">
        <MusicPlayer
          song={selectedSong}
          apiUrl={API_URL}
        />
      </footer>
    </div>
  );
}

export default App;
