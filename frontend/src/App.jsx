import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [summary, setSummary] = useState({
    total_scholarship: 0,
    total_expenses: 0,
    balance: 0,
  });

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

  const loadSummary = async () => {
    try {
      const res = await axios.get("http://localhost:8000/summary");
console.log("DATA:", res.data);
      setSummary(res.data);
    } catch (error) {
      console.log("Summary Error:", error);
    }
  };

  useEffect(() => {
    loadSummary();

    const interval = setInterval(() => {
      loadSummary();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const addScholarship = async () => {
    try {
      await axios.post("http://127.0.0.1:8000/scholarship", {
        source: scholarship.source,
        amount: Number(scholarship.amount),
        date: scholarship.date,
      });

      loadSummary();

      setScholarship({
        source: "",
        amount: "",
        date: "",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const addExpense = async () => {
    try {
      await axios.post("http://127.0.0.1:8000/expense", {
        category: expense.category,
        amount: Number(expense.amount),
        date: expense.date,
      });

      loadSummary();

      setExpense({
        category: "",
        amount: "",
        date: "",
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#111",
        color: "white",
        minHeight: "100vh",
        padding: "30px",
        textAlign: "center",
      }}
    >
      <h1>🎓 Scholarship Fund Tracker</h1>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          marginTop: "30px",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            border: "1px solid gray",
            padding: "20px",
            width: "220px",
          }}
        >
          <h3>💰 Scholarship</h3>
          <h2>₹{summary.total_scholarship}</h2>
        </div>

        <div
          style={{
            border: "1px solid gray",
            padding: "20px",
            width: "220px",
          }}
        >
          <h3>📉 Expenses</h3>
          <h2>₹{summary.total_expenses}</h2>
        </div>

        <div
          style={{
            border: "1px solid gray",
            padding: "20px",
            width: "220px",
          }}
        >
          <h3>🏦 Balance</h3>
          <h2>₹{summary.balance}</h2>
        </div>
      </div>

      <div style={{ marginTop: "50px" }}>
        <h2>Add Scholarship</h2>

        <input
          placeholder="Source"
          value={scholarship.source}
          onChange={(e) =>
            setScholarship({
              ...scholarship,
              source: e.target.value,
            })
          }
        />

        <br />
        <br />

        <input
          placeholder="Amount"
          type="number"
          value={scholarship.amount}
          onChange={(e) =>
            setScholarship({
              ...scholarship,
              amount: e.target.value,
            })
          }
        />

        <br />
        <br />

        <input
          type="date"
          value={scholarship.date}
          onChange={(e) =>
            setScholarship({
              ...scholarship,
              date: e.target.value,
            })
          }
        />

        <br />
        <br />

        <button onClick={addScholarship}>
          Add Scholarship
        </button>
      </div>

      <div style={{ marginTop: "50px" }}>
        <h2>Add Expense</h2>

        <input
          placeholder="Category"
          value={expense.category}
          onChange={(e) =>
            setExpense({
              ...expense,
              category: e.target.value,
            })
          }
        />

        <br />
        <br />

        <input
          placeholder="Amount"
          type="number"
          value={expense.amount}
          onChange={(e) =>
            setExpense({
              ...expense,
              amount: e.target.value,
            })
          }
        />

        <br />
        <br />

        <input
          type="date"
          value={expense.date}
          onChange={(e) =>
            setExpense({
              ...expense,
              date: e.target.value,
            })
          }
        />

        <br />
        <br />

        <button onClick={addExpense}>
          Add Expense
        </button>
      </div>
    </div>
  );
}

export default App;