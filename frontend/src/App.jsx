
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

}

export default App;
