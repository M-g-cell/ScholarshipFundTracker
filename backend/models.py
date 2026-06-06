from pydantic import BaseModel

class Scholarship(BaseModel):
    amount: int
    source: str
    date: str
    username: str

class Expense(BaseModel):
    amount: int
    category: str
    date: str
    username: str
    
class Goal(BaseModel):
    name: str
    target_amount: int
class User(BaseModel):
    username: str
    password: str