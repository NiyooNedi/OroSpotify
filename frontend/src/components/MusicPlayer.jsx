import { useEffect, useState } from "react";

function MusicPlayer({ song, apiUrl }) {
    const [audioUrl, setAudioUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    //get a signed audio link whenever the selected song changes
    useEffect(() => {
        if (!song) {
            setAudioUrl(null);
            setError("");
            return;
        }

        let cancelled = false;

        async function fetchAudioUrl() {
            try {
                setLoading(true);
                setAudioUrl(null);
                setError("");

                const response = await fetch(
                    `${apiUrl}/songs/${song.song_id}/play`
                );

                if (!response.ok) {
                    throw new Error(
                        `Could not load audio: ${response.status}`
                    );
                }

                const data = await response.json();

                if (!data.audio_url) {
                    throw new Error("The backend did not return an audio URL.");
                }

                if (!cancelled) {
                    setAudioUrl(data.audio_url);
                }
            } catch (err) {
                console.error("Error loading song:", err);

                if (!cancelled) {
                    setError("Unable to load this song.");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        fetchAudioUrl();

        //stop older request from updating the player after user selects another song
        return () => {
            cancelled = true;
        };
    }, [song, apiUrl]);

    return (
        <>
            {/* song info */}
            <div className="player-song">
                {song ? (
                    <img className="song-artwork"
                    src={song.image_url} alt={song.song_name}/>
                    ) : (
                        <div className="song-artwork">♫</div>
                    )
                }
                <div>
                    <p>{song ? song.song_name : "Choose a song"}</p>

                    <span>
                        {song ? song.artist_name : "Your music starts here"}
                    </span>
                </div>
            </div>

            {/* audio controls */}
            <div className="player-controls">
                {!song && <span>Select a song to start listening.</span>}

                {loading && <span>Loading audio...</span>}

                {error && <span className="error-message">{error}</span>}

                {audioUrl && (
                    <audio
                        key={song.song_id}
                        src={audioUrl}
                        controls
                        preload="metadata"
                    >
                        Your browser does not support audio playback.
                    </audio>
                )}
            </div>

            {/* music player's status */}
            <div className="player-status">
                <span className="status-dot"></span>
                {loading
                    ? "Connecting..."
                    : audioUrl
                    ? "Ready to play"
                    : song
                    ? "Preparing audio"
                    : "Library connected"}
            </div>
        </>
    );
}

export default MusicPlayer;
