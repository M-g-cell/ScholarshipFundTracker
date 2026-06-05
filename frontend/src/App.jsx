import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function App() {
  const isLoggedIn =
  localStorage.getItem("isLoggedIn");
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

      console.log(summaryRes.data);

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
  const deleteScholarship = async (id) => {
  try {
    await axios.delete(
      `http://localhost:8000/scholarship/${id}`
    );

    loadData();
  } catch (error) {
    console.log(error);
  }
};

const deleteExpense = async (id) => {
  try {
    await axios.delete(
      `http://localhost:8000/expense/${id}`
    );

    loadData();
  } catch (error) {
    console.log(error);
  }
};

const editScholarship = async (item) => {

  const newSource = prompt(
    "Enter Scholarship Source",
    item.source
  );

  const newAmount = prompt(
    "Enter Scholarship Amount",
    item.amount
  );

  const newDate = prompt(
    "Enter Scholarship Date",
    item.date
  );

  if (!newSource || !newAmount || !newDate) return;

  await axios.put(
    `http://localhost:8000/scholarship/${item._id}`,
    {
      source: newSource,
      amount: Number(newAmount),
      date: newDate,
    }
  );

  loadData();
};

const editExpense = async (item) => {

  const newCategory = prompt(
    "Enter Expense Category",
    item.category
  );

  const newAmount = prompt(
    "Enter Expense Amount",
    item.amount
  );

  const newDate = prompt(
    "Enter Expense Date",
    item.date
  );

  if (!newCategory || !newAmount || !newDate) return;

  await axios.put(
    `http://localhost:8000/expense/${item._id}`,
    {
      category: newCategory,
      amount: Number(newAmount),
      date: newDate,
    }
  );

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

  const chartData = [
  {
    name: "Scholarship",
    value: summary.total_scholarship,
  },
  {
    name: "Expenses",
    value: summary.total_expenses,
  },
  {
    name: "Balance",
    value: summary.balance,
  },
];

const COLORS = [
  "#22c55e",
  "#ef4444",
  "#3b82f6",
];
// if (!isLoggedIn) {
//   window.location.href = "/login";
//   return null;
// }
  return (
    <div className="container">
    <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "90%",
    margin: "20px auto",
  }}
>
  <h1>🎓 Scholarship Fund Tracker</h1>

  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "15px",
    }}
  >
    <span
      style={{
        fontSize: "18px",
        fontWeight: "bold",
      }}
    >
      👤 Harshali
    </span>

    <button
      onClick={() => {
        localStorage.removeItem("isLoggedIn");
        window.location.href = "/login";
      }}
    >
      🚪 Logout
    </button>
  </div>
</div>

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

      <div
  className="card"
  style={{
    maxWidth: "900px",
    margin: "30px auto",
  }}
>
  <h2>📊 Financial Analytics</h2>

  <div
    style={{
      width: "100%",
      height: "350px",
    }}
  >
    <ResponsiveContainer>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          outerRadius={120}
          dataKey="value"
          label
        >
          {chartData.map((entry, index) => (
            <Cell
              key={index}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>

        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  </div>
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
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredScholarships.map((item, index) => (
              <tr key={index}>
                <td>{item.source}</td>
                <td>₹{item.amount}</td>
                <td>{item.date}</td>
                <td>
  <button
    onClick={() => editScholarship(item)}
  >
    Edit
  </button>

  <button
    onClick={() => deleteScholarship(item._id)}
  >
    Delete
  </button>
</td>
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
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.map((item, index) => (
              <tr key={index}>
                <td>{item.category}</td>
                <td>₹{item.amount}</td>
                <td>{item.date}</td>
                <td>
  <button
    onClick={() => editExpense(item)}
  >
    Edit
  </button>

  <button
    onClick={() => deleteExpense(item._id)}
  >
    Delete
  </button>
</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;