import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-center p-8">
      <div>
        <h1 className="text-4xl font-bold mb-4 text-gray-800">Welcome to SmartSpendr 💸</h1>
        <p className="text-lg mb-6 text-gray-600">
          Take control of your finances with AI-powered insights and budgeting tools.
        </p>
        <button
          onClick={handleGetStarted}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}

export default Home;
