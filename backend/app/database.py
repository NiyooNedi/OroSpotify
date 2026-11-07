#Python module that lets us interact with the operating system
import os

#imports PostgreSQL driver
import psycopg

#reads environment variables from .env file
from dotenv import load_dotenv

#loads database credentials from .env
load_dotenv() 

#gettong the value of the DATABASE_URL environment variable from OS
DATABASE_URL = os.getenv("DATABASE_URL")

def get_db_connection():
    #establishes a connection to Postgre
    conn = psycopg.connect(DATABASE_URL)
    #returning connection so other files can execute SQL queries
    return conn


