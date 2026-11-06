
-- ==========================================
-- OROSPOTIFY DATABASE SCHEMA
-- Database: orospotify
-- PostgreSQL
-- ==========================================


-- 1. ARTIST
-- Stores information about music artists.

CREATE TABLE Artist (
    artist_id SERIAL PRIMARY KEY,
    artist_name VARCHAR(100) NOT NULL,
    image_url TEXT
);


-- 2. USERS
-- Stores registered OroSpotify users.

CREATE TABLE Users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL
);


-- 3. ALBUM
-- Each album belongs to an artist.

CREATE TABLE Album (
    album_id SERIAL PRIMARY KEY,
    artist_id INTEGER NOT NULL REFERENCES Artist(artist_id),
    album_name VARCHAR(100) NOT NULL,
    release_year INTEGER NOT NULL
);


-- 4. SONG
-- Stores song information and its Supabase storage path.
-- album_id is nullable because songs can be singles.

CREATE TABLE Song (
    song_id SERIAL PRIMARY KEY,
    song_name VARCHAR(150) NOT NULL,
    album_id INTEGER REFERENCES Album(album_id),
    audio_url TEXT NOT NULL,
    duration INTEGER NOT NULL CHECK (duration > 0)
);


-- 5. SONG_ARTIST
-- Connects songs to artists.
-- Allows multiple artists to collaborate on one song.

CREATE TABLE Song_Artist (
    song_id INTEGER REFERENCES Song(song_id),
    artist_id INTEGER REFERENCES Artist(artist_id),
    PRIMARY KEY (song_id, artist_id)
);


-- 6. PLAYLIST
-- Each playlist belongs to a user.

CREATE TABLE Playlist (
    playlist_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES Users(user_id),
    playlist_name VARCHAR(100) NOT NULL
);


-- 7. PLAYLIST_SONG
-- Connects songs to playlists.
-- Position determines the order of songs in a playlist.

CREATE TABLE Playlist_Song (
    playlist_id INTEGER REFERENCES Playlist(playlist_id),
    song_id INTEGER REFERENCES Song(song_id),
    position INTEGER NOT NULL CHECK (position > 0),

    PRIMARY KEY (playlist_id, song_id),
    UNIQUE (playlist_id, position)
);


