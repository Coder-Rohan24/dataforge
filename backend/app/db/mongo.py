from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv("backend/app/.env")  # Loads environment variables from .env

MONGO_URI = os.getenv("MONGO_URI")
print(f"Mongo URI: {MONGO_URI}")  # Debugging line to check the URI
# Create the MongoDB client
client = AsyncIOMotorClient("mongodb+srv://thefinalcall:FirstDb%4025@cluster0.pf5om.mongodb.net/aidataforge?retryWrites=true&w=majority&appName=Cluster0")

# Connect to the specific database
db = client["aidataforge"]  # Name of your DB as per the URI

# Connect to a collection
user_collection = db["users"]
