import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#A28EFF'];


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
      const sorted = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setExpenses(sorted);
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

    const handleDelete = async (id) => {
    const confirmed = confirm("Are you sure you want to delete this expense?");
    if (!confirmed) return;

    try {
      await axios.delete(`/expenses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchExpenses();
      fetchPrediction();
    } catch (err) {
      console.error("Failed to delete expense", err);
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

  const getTotalSpentThisMonth = () => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  return expenses
    .filter((e) => {
      const date = new Date(e.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    })
    .reduce((acc, e) => acc + parseFloat(e.amount), 0);
};

const pieData = Object.entries(
  expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + parseFloat(e.amount);
    return acc;
  }, {})
).map(([category, value]) => ({ name: category, value }));

const barData = expenses
  .filter((e) => {
    const d = new Date(e.date);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  })
  .reduce((acc, e) => {
    const day = new Date(e.date).getDate();
    const dayStr = `Day ${day}`;
    acc[dayStr] = (acc[dayStr] || 0) + parseFloat(e.amount);
    return acc;
  }, {});

const barChartData = Object.entries(barData).map(([day, value]) => ({
  day,
  value,
}));



  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 sm:mb-0">
            SmartSpendr Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="w-full sm:w-auto bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>

        {prediction !== null && (
         <>
            <div className="bg-blue-100 p-4 sm:p-6 rounded-lg shadow-md mb-4">
             <h2 className="text-lg sm:text-xl font-semibold">
                Predicted Budget Next Month: ₹{prediction}
             </h2>
            </div>

            <div className="bg-green-100 p-4 sm:p-6 rounded-lg shadow-md mb-6">
             <h2 className="text-lg sm:text-xl font-semibold">
                Total Spent This Month: ₹{getTotalSpentThisMonth().toFixed(2)}
             </h2>
            </div>
         </>
        )}


        <form onSubmit={handleSubmit} className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-semibold mb-4">Add New Expense</h3>
          {error && <p className="text-red-500 mb-2">{error}</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="p-2 border rounded"
              required
            >
              <option value="" disabled>Select Category</option>
              <option value="Food">Food</option>
              <option value="Travel">Travel</option>
              <option value="Utilities">Utilities</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Shopping">Shopping</option>
              <option value="Others">Others</option>
            </select>
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
            className="mt-4 w-full sm:w-auto bg-blue-600 text-white py-2 px-6 rounded"
          >
            Add Expense
          </button>
        </form>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Your Expenses</h3>
          {expenses.length === 0 ? (
            <p>No expenses yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr>
                    <th className="p-2">Title</th>
                    <th className="p-2">Amount</th>
                    <th className="p-2">Category</th>
                    <th className="p-2">Date</th>
                    <th className="p-2 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {[...expenses]
                        .sort((a, b) => new Date(b.date) - new Date(a.date))
                        .map((e) => (
                        <tr key={e.id} className="border-t">
                            <td className="p-2 capitalize">{e.title}</td>
                            <td className="p-2">₹{e.amount}</td>
                            <td className="p-2 capitalize">{e.category}</td>
                            <td className="p-2">
                            {new Date(e.date).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                            })}
                            </td>
                            {/* ✅ Add this new cell for Delete button */}
                            <td className="p-2 text-right">
                            <button
                                onClick={() => handleDelete(e.id)}
                                className="text-red-600 hover:underline text-sm"
                            >
                                Delete
                            </button>
                            </td>
                        </tr>
                        ))}
                    </tbody>
              </table>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
  <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
    <h3 className="text-lg font-semibold mb-4">Expenses by Category</h3>
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={pieData}
          cx="50%"
          cy="50%"
          outerRadius={90}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          dataKey="value"
        >
          {pieData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  </div>

  <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
    <h3 className="text-lg font-semibold mb-4">Daily Spending (This Month)</h3>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={barChartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill="#6366f1" />
      </BarChart>
    </ResponsiveContainer>
  </div>
</div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
