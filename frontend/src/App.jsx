import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [summary, setSummary] = useState({
    total_scholarship: 0,
    total_expenses: 0,
    balance: 0,
  });

  const [scholarships, setScholarships] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [search, setSearch] = useState("");

  const [scholarship, setScholarship] = useState({
    source: "",
    amount: "",
    date: "",
  });

  const [expense, setExpense] = useState({
    category: "",
    amount: "",
    date: "",
  });

  const loadData = async () => {
    try {
      const [summaryRes, scholarshipRes, expenseRes] = await Promise.all([
        axios.get("http://localhost:8000/summary"),
        axios.get("http://localhost:8000/scholarships"),
        axios.get("http://localhost:8000/expenses"),
      ]);

      setSummary(summaryRes.data);
      setScholarships(scholarshipRes.data);
      setExpenses(expenseRes.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 3000);
    return () => clearInterval(interval);
  }, []);

  const addScholarship = async () => {
    await axios.post("http://localhost:8000/scholarship", {
      source: scholarship.source,
      amount: Number(scholarship.amount),
      date: scholarship.date,
    });

    setScholarship({ source: "", amount: "", date: "" });
    loadData();
  };

  const addExpense = async () => {
    await axios.post("http://localhost:8000/expense", {
      category: expense.category,
      amount: Number(expense.amount),
      date: expense.date,
    });

    setExpense({ category: "", amount: "", date: "" });
    loadData();
  };

  const filteredScholarships = scholarships.filter((s) =>
    s.source?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredExpenses = expenses.filter((e) =>
    e.category?.toLowerCase().includes(search.toLowerCase())
  );

  const goalTarget = 500000;
  const goalPercent = ((summary.balance / goalTarget) * 100).toFixed(2);

  return (
    <div className="container">
      <h1>🎓 Scholarship Fund Tracker</h1>
      <p>Track • Save • Achieve Your Master's Goal</p>

      <div className="cards">
        <div className="card">
          <h3>💰 Scholarship</h3>
          <h2>₹{summary.total_scholarship}</h2>
        </div>

        <div className="card">
          <h3>📉 Expenses</h3>
          <h2>₹{summary.total_expenses}</h2>
        </div>

        <div className="card">
          <h3>🏦 Balance</h3>
          <h2>₹{summary.balance}</h2>
        </div>

        <div className="card">
          <h3>🎯 Goal %</h3>
          <h2>{goalPercent}%</h2>
        </div>
      </div>

      <div className="card" style={{ maxWidth: "800px", margin: "30px auto" }}>
        <h2>🎯 Master's Goal</h2>
        <p>Target: ₹5,00,000</p>
        <progress value={summary.balance} max={goalTarget} style={{ width: "100%" }} />
        <h3>{goalPercent}% Complete</h3>
        <p>Remaining: ₹{goalTarget - summary.balance}</p>
      </div>

      <div style={{ margin: "30px 0" }}>
        <input
          placeholder="🔍 Search scholarships or expenses"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="form-section">
        <h2>Add Scholarship</h2>
        <input placeholder="Source" value={scholarship.source}
          onChange={(e) => setScholarship({ ...scholarship, source: e.target.value })} />
        <br /><br />
        <input placeholder="Amount" type="number" value={scholarship.amount}
          onChange={(e) => setScholarship({ ...scholarship, amount: e.target.value })} />
        <br /><br />
        <input type="date" value={scholarship.date}
          onChange={(e) => setScholarship({ ...scholarship, date: e.target.value })} />
        <br /><br />
        <button onClick={addScholarship}>Add Scholarship</button>
      </div>

      <div className="form-section">
        <h2>Add Expense</h2>
        <input placeholder="Category" value={expense.category}
          onChange={(e) => setExpense({ ...expense, category: e.target.value })} />
        <br /><br />
        <input placeholder="Amount" type="number" value={expense.amount}
          onChange={(e) => setExpense({ ...expense, amount: e.target.value })} />
        <br /><br />
        <input type="date" value={expense.date}
          onChange={(e) => setExpense({ ...expense, date: e.target.value })} />
        <br /><br />
        <button onClick={addExpense}>Add Expense</button>
      </div>

      <div className="card" style={{ width: "90%", margin: "40px auto" }}>
        <h2>📋 Scholarship History</h2>
        <table style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Source</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredScholarships.map((item, index) => (
              <tr key={index}>
                <td>{item.source}</td>
                <td>₹{item.amount}</td>
                <td>{item.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card" style={{ width: "90%", margin: "40px auto" }}>
        <h2>📋 Expense History</h2>
        <table style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Category</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.map((item, index) => (
              <tr key={index}>
                <td>{item.category}</td>
                <td>₹{item.amount}</td>
                <td>{item.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;