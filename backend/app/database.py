#Python module that lets us interact with the operating system
import os
#imports PostgreSQL driver
import psycopg
#reads environment variables from .env file
from dotenv import load_dotenv
#going to create Supabase client to access audio files' storage path
from supabase import create_client

#loads database credentials from .env
load_dotenv() 

#gettong the value of the DATABASE_URL environment variable from OS
DATABASE_URL = os.getenv("DATABASE_URL")

def get_db_connection():
    #establishes a connection to Postgre
    conn = psycopg.connect(DATABASE_URL)
    #returning connection so other files can execute SQL queries
    return conn

#creating client object that is connection between Python and Supabase
supabase = create_client(os.getenv("SUPABASE_URL"), 
            os.getenv("SUPABASE_SERVICE_ROLE_KEY"))

#func called by songs file that will pass in the db stored "storage_path"
def get_song_url(storage_path):
    #accessing storage service, and "songs" bucket
    result = supabase.storage.from_("songs").create_signed_url(
        storage_path, 3600)
    #result is a dict with key "signedURL" which stores link
    return result["signedURL"]

