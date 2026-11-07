from fastapi import APIRouter, HTTPException
from app.database import get_db_connection

router = APIRouter()

#when someone sends a GET request to /artists, execute function below
@router.get("/artists")
def get_artists():

    #connects Python application to Postgre
    conn = get_db_connection()

    #execute SQL commands and retrieve their results
    cursor = conn.cursor()

    cursor.execute("""
        SELECT artist_id, artist_name, image_url
        FROM Artist;
    """)

    #retrieves all rows returned by the query
    artistsTuples = cursor.fetchall()

    #convert the results from tuples to JSON object
    artistsJSON = []
    for row in artistsTuples:
        artistsJSON.append(
            {
            "artist_id": row[0],
            "artist_name": row[1],
            "image_url": row[2]
            }
        )
        
    cursor.close()
    conn.close()

    return artistsJSON