from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

client = MongoClient(os.getenv("MONGO_URI"))

db = client["scholarship_tracker"]

scholarships_collection = db["scholarships"]
expenses_collection = db["expenses"]
goals_collection = db["goals"]
users_collection = db["users"]