from fastapi import APIRouter, HTTPException
from app.database import get_db_connection

router = APIRouter()

#when someone sends a GET request to /albums, execute function below
@router.get("/albums")
def get_albums():

    #connects Python application to Postgre
    conn = get_db_connection()

    #execute SQL commands and retrieve their results
    cursor = conn.cursor()

    cursor.execute("""
        SELECT Album.album_id, Artist.artist_name, 
            Album.album_name, Album.release_year
        FROM Album JOIN Artist ON Album.artist_id = Artist.artist_id
        ORDER BY Album.release_year DESC;
    """)

    #retrieves all rows returned by the query
    albumsTuples = cursor.fetchall()

    #convert the results from tuples to JSON object
    albumsJSON = []
    for row in albumsTuples:
        albumsJSON.append(
            {
            "album_id": row[0],
            "artist_id": row[1],
            "album_name": row[2],
            "release_year": row[3]
            }
        )
        
    cursor.close()
    conn.close()

    return albumsJSON