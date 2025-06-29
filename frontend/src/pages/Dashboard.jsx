// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "",
    date: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetchExpenses();
    fetchPrediction();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await axios.get("/expenses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses(response.data);
    } catch (err) {
      setError("Failed to load expenses.");
    }
  };

  const fetchPrediction = async () => {
    try {
      const response = await axios.get("/predict-budget", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPrediction(response.data.prediction);
    } catch (err) {
      setPrediction(null);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await axios.post("/expenses", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForm({ title: "", amount: "", category: "", date: "" });
      fetchExpenses();
      fetchPrediction();
    } catch (err) {
      setError("Failed to add expense.");
    }
  };

  const handleLogout = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";  
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">SmartSpendr Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-1 rounded"
          >
            Logout
          </button>
        </div>

        {prediction !== null && (
          <div className="bg-blue-100 p-4 rounded mb-6">
            <h2 className="text-lg">Predicted Budget Next Month: ₹{prediction}</h2>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6">
          <h3 className="text-lg font-semibold mb-4">Add New Expense</h3>
          {error && <p className="text-red-500 mb-2">{error}</p>}
          <div className="grid grid-cols-2 gap-4">
            <input
              name="title"
              placeholder="Title"
              value={form.title}
              onChange={handleChange}
              className="p-2 border rounded"
              required
            />
            <input
              name="amount"
              placeholder="Amount"
              type="number"
              value={form.amount}
              onChange={handleChange}
              className="p-2 border rounded"
              required
            />
            <input
              name="category"
              placeholder="Category"
              value={form.category}
              onChange={handleChange}
              className="p-2 border rounded"
              required
            />
            <input
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              className="p-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded"
          >
            Add Expense
          </button>
        </form>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-4">Your Expenses</h3>
          {expenses.length === 0 ? (
            <p>No expenses yet.</p>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="p-2">Title</th>
                  <th className="p-2">Amount</th>
                  <th className="p-2">Category</th>
                  <th className="p-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((e) => (
                  <tr key={e.id} className="border-t">
                    <td className="p-2">{e.title}</td>
                    <td className="p-2">₹{e.amount}</td>
                    <td className="p-2">{e.category}</td>
                    <td className="p-2">{new Date(e.date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
