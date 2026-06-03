from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017")

db = client["scholarship_tracker"]

scholarships_collection = db["scholarships"]
expenses_collection = db["expenses"]
goals_collection = db["goals"]