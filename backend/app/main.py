from fastapi import FastAPI

#specifies which frontend origins are permitted to communicate with backend
from fastapi.middleware.cors import CORSMiddleware

#each file handles its own API endpoints
from app import songs, artists, albums

app = FastAPI()

#tells FastAPI app to install additional middleware
app.add_middleware(
    CORSMiddleware,
    #which origins can communicate with backend
    allow_origins=["http://localhost:5173"],
    #all HTTP methods and headers are allowed (GET, POST, PUT, etc.)
    allow_methods=["*"],
    allow_headers=["*"],
)

#each of the songs, artists, and albums files has its own router that we need to include in the FASTAPI app
app.include_router(songs.router)
app.include_router(artists.router)
app.include_router(albums.router)

#when someone sends a GET request to /, execute function below
@app.get("/")
def home():
    return {"message": "Welcome to OroSpotify!"}