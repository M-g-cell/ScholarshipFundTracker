from pydantic import BaseModel

class Scholarship(BaseModel):
    amount: int
    source: str
    date: str

class Expense(BaseModel):
    amount: int
    category: str
    date: str
class Goal(BaseModel):
    name: str
    target_amount: int