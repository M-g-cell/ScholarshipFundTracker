from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from database import scholarships_collection, expenses_collection, goals_collection
from models import Scholarship, Expense, Goal
from bson import ObjectId

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "message": "Scholarship Fund Tracker API Running"
    }


# =========================
# SCHOLARSHIPS
# =========================

@app.post("/scholarship")
def add_scholarship(scholarship: Scholarship):

    scholarships_collection.insert_one(
        scholarship.dict()
    )

    return {
        "message": "Scholarship Added Successfully"
    }


@app.get("/scholarships")
def get_scholarships():

    scholarships = []

    for item in scholarships_collection.find():
        item["_id"] = str(item["_id"])
        scholarships.append(item)

    return scholarships


@app.put("/scholarship/{id}")
def update_scholarship(id: str, scholarship: Scholarship):

    scholarships_collection.update_one(
        {"_id": ObjectId(id)},
        {
            "$set": scholarship.dict()
        }
    )

    return {
        "message": "Scholarship Updated"
    }


@app.delete("/scholarship/{id}")
def delete_scholarship(id: str):

    scholarships_collection.delete_one(
        {"_id": ObjectId(id)}
    )

    return {
        "message": "Scholarship Deleted"
    }


# =========================
# EXPENSES
# =========================

@app.post("/expense")
def add_expense(expense: Expense):

    expenses_collection.insert_one(
        expense.dict()
    )

    return {
        "message": "Expense Added Successfully"
    }


@app.get("/expenses")
def get_expenses():

    expenses = []

    for item in expenses_collection.find():
        item["_id"] = str(item["_id"])
        expenses.append(item)

    return expenses


@app.put("/expense/{id}")
def update_expense(id: str, expense: Expense):

    expenses_collection.update_one(
        {"_id": ObjectId(id)},
        {
            "$set": expense.dict()
        }
    )

    return {
        "message": "Expense Updated"
    }


@app.delete("/expense/{id}")
def delete_expense(id: str):

    expenses_collection.delete_one(
        {"_id": ObjectId(id)}
    )

    return {
        "message": "Expense Deleted"
    }


# =========================
# SUMMARY
# =========================

@app.get("/summary")
def get_summary():

    scholarships = list(
        scholarships_collection.find({}, {"_id": 0})
    )

    expenses = list(
        expenses_collection.find({}, {"_id": 0})
    )

    total_scholarship = sum(
        item["amount"] for item in scholarships
    )

    total_expenses = sum(
        item["amount"] for item in expenses
    )

    balance = total_scholarship - total_expenses

    return {
        "total_scholarship": total_scholarship,
        "total_expenses": total_expenses,
        "balance": balance
    }


# =========================
# GOALS
# =========================

@app.post("/goal")
def add_goal(goal: Goal):

    goals_collection.insert_one(
        goal.dict()
    )

    return {
        "message": "Goal Added Successfully"
    }


@app.get("/goal-progress")
def goal_progress():

    scholarships = list(
        scholarships_collection.find({}, {"_id": 0})
    )

    expenses = list(
        expenses_collection.find({}, {"_id": 0})
    )

    goal = goals_collection.find_one({}, {"_id": 0})

    if not goal:
        return {
            "message": "No Goal Found"
        }

    total_scholarship = sum(
        item["amount"] for item in scholarships
    )

    total_expenses = sum(
        item["amount"] for item in expenses
    )

    balance = total_scholarship - total_expenses

    progress = (
        balance / goal["target_amount"]
    ) * 100

    return {
        "goal": goal["name"],
        "target_amount": goal["target_amount"],
        "current_savings": balance,
        "progress_percent": round(progress, 2)
    }