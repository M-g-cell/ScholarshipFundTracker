from pymongo import MongoClient
client = MongoClient("mongodb+srv://harshalisonawane76_db_user:WzjjwXK5sYkDNWxz@cluster0.7utcutg.mongodb.net/?appName=Cluster0")

db = client["scholarship_tracker"]

scholarships_collection = db["scholarships"]
expenses_collection = db["expenses"]
goals_collection = db["goals"]