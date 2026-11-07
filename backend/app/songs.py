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


