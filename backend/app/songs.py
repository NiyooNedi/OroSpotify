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

