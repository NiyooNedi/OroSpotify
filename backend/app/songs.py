from fastapi import APIRouter, HTTPException
from app.database import get_db_connection, get_song_url

#creating router specifically for song-related endpoints
router = APIRouter()

#when someone sends a GET request to /songs, execute function below
@router.get("/songs")
def get_songs():

    #connects Python app to Postgre, calling function from database.py
    conn = get_db_connection()

    #execute SQL commands through connection and retrieve results
    cursor = conn.cursor()

    cursor.execute("""
        SELECT song_id, song_name, storage_path, duration
        FROM Song
        ORDER BY song_id;
    """)

    #retrieves all rows returned by the query
    songsTuples = cursor.fetchall()

    # [
    # (1, "Lakkii Dhiis", "Fayyisaa Furii/song1.mp3", 222),
    # (2, "Akkamittin", "Fayyisaa Furii/song1.mp3", 195)
    # ]

    #convert the results from tuples to JSON object
    songsJSON = []
    for row in songsTuples:
        songsJSON.append(
            {"song_id": row[0], "song_name": row[1], 
             "storage_path": row[2], "duration": row[3]
            }
        )

    cursor.close()
    conn.close()

    return songsJSON


#when someone sends a GET request to /songs{song_id}, execute function below
@router.get("/songs/{song_id}")
def get_song_name(song_id: int):

    #connects Python app to Postgre, calling function from database.py
    conn = get_db_connection()

    #execute SQL commands through connection and retrieve results
    cursor = conn.cursor()

    try:
        cursor.execute("""
            SELECT song_name
            FROM Song
            WHERE song_id = %s;
        """, (song_id,))
        #passing in song_id as a tuple into the cursor func which will be %s

        #retrieves row returned by the query
        songTuple = cursor.fetchone()

        #if the query returns nothing
        if songTuple is None:
            raise HTTPException(status_code=404, detail="Song not found")

        songsJSON = {"song_name": songTuple[0]}

        return songsJSON

    finally:
        cursor.close()
        conn.close()


@router.get("/songs/{song_id}/play")
def play_song(song_id: int):

    #connect to the db and create a cursor to iterate
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("""
            SELECT storage_path
            FROM Song
            WHERE song_id = %s;
        """, (song_id,))

        #set song equal to the array with the single row cursor returns of the match 
        song = cursor.fetchone()

        if song is None:
            raise HTTPException(status_code=404, detail="Song not found")
        
        #paste the first row into the get_song_url func defined in database.py
        #and store the result, which is the url taken from Supabase storage
        signed_url = get_song_url(song[0])

        #return a dictionary with the signed url of the audio file
        return {"audio_url": signed_url}

    finally:
        cursor.close()
        conn.close()

#function that returns all of the songs with it's artists
@router.get("/songs_with_artists")
def get_songs_with_artists():

    #connect to the db and create a cursor to iterate
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("""
            SELECT S.song_id, S.song_name, S.storage_path, S.duration, 
            STRING_AGG(A.artist_name, ', ') AS artist_names
            FROM Song S
            JOIN Song_Artist SA ON S.song_id = SA.song_id JOIN Artist A ON SA.artist_id = A.artist_id
            GROUP BY S.song_id, S.song_name, S.storage_path, S.duration, A.artist_id
            ORDER BY A.artist_id;
        """)

        #set songsTuples equal to the array with the rows cursor returns of the match 
        songsTuples = cursor.fetchall()

        if not songsTuples:
            raise HTTPException(status_code=404, detail="Songs not found")
        
        #convert the results from tuples to JSON object
        songsJSON = []
        for row in songsTuples:
            songsJSON.append(
                {
                "song_id": row[0], 
                "song_name": row[1], 
                "storage_path": row[2], 
                "duration": row[3],
                "artist_name": row[4]
                }
            )
        
        return songsJSON

    finally:
        cursor.close()
        conn.close()
