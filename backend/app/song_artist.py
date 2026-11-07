from fastapi import APIRouter, HTTPException
from app.database import get_db_connection

router = APIRouter()

#when someone sends a GET request to /song_artists execute function below
@router.get("/song_artists")
def get_songs_artists():

    #connects Python application to Postgre
    conn = get_db_connection()

    #execute SQL commands and retrieve their results
    cursor = conn.cursor()

    cursor.execute("""
        SELECT artist_id, song_id
        FROM Song_Artist;
    """)

    #retrieves all rows returned by the query
    songArtistTuples = cursor.fetchall()

    #convert the results from tuples to JSON object
    songArtistsJSON = []
    for row in songArtistTuples:
        songArtistsJSON.append(
            {
            "artist_id": row[0],
            "song_id": row[1]
            }
        )
        
    cursor.close()
    conn.close()

    return songArtistsJSON


