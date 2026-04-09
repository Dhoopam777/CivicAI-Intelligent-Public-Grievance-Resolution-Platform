import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AdminLoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Hardcoded credentials for Admin access
    if (username === "admin" && password === "admin") {
      localStorage.setItem("isAdmin", "true");
      toast.success("Admin Login Successful!");
      navigate("/admin");
    } else {
      toast.error("Invalid Admin Credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent">
      <div className="bg-gray-900/90 backdrop-blur-2xl border border-red-500/50 p-10 rounded-3xl shadow-2xl w-full max-w-md text-white animate-slideUp">
        <h1 className="text-3xl font-bold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-500">
          Admin Portal
        </h1>
        <p className="text-center text-gray-400 mb-6 text-sm">Restricted Access Only</p>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Admin Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="p-3 rounded-xl bg-gray-800 border border-gray-600 focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400 transition-all text-white"
          />
          <input
            type="password"
            placeholder="Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 rounded-xl bg-gray-800 border border-gray-600 focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400 transition-all text-white"
          />
          <button type="submit" className="mt-4 p-3 rounded-xl font-bold bg-red-600 hover:bg-red-500 text-white shadow-lg hover:shadow-red-500/50 transition-all hover:-translate-y-1">
            Login as Admin
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;