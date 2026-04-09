import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


const LoginPage = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {

    e.preventDefault();
    setIsLoading(true);

    try {

      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        toast.success("Login successful!");
        navigate("/profile");
      } else {
        toast.error(res.data.message || "Login failed");
      }

    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Login failed due to a server error");
    } finally {
      setIsLoading(false);
    }

  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-transparent">

        <div className="bg-gray-900/80 backdrop-blur-2xl border border-gray-600 p-10 rounded-3xl shadow-2xl hover:border-gray-400 w-full max-w-md text-white transition-all duration-500 animate-slideUp">

          <h1 className="text-3xl font-bold text-center mb-6">
            Login to CivicAI
          </h1>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-3 rounded-xl bg-gray-800/80 border border-gray-500 text-white placeholder-gray-400 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all duration-300"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-3 rounded-xl bg-gray-800/80 border border-gray-500 text-white placeholder-gray-400 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all duration-300"
            />

            <button
              type="submit"
              disabled={isLoading}
              className={`mt-2 p-3 rounded-xl font-bold transition transform ${isLoading ? 'bg-gray-400 cursor-not-allowed text-black' : 'bg-white text-black hover:bg-gray-200 hover:scale-105'}`}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>

          </form>

          <div className="flex items-center my-6">

            <div className="flex-grow h-px bg-gray-400"></div>

            <span className="px-3 text-sm text-gray-300">or</span>

            <div className="flex-grow h-px bg-gray-400"></div>

          </div>

          <button className="w-full p-3 bg-transparent text-white border border-white rounded-xl hover:bg-white hover:text-black transition">
            Continue with Google
          </button>

          <p className="text-center text-sm mt-6 text-gray-300">

            Don't have an account?

            <span
              onClick={() => navigate("/register")}
              className="ml-2 text-white font-bold cursor-pointer hover:underline"
            >
              Register
            </span>

          </p>

        </div>

      </div>
    </>
  );

};

export default LoginPage;