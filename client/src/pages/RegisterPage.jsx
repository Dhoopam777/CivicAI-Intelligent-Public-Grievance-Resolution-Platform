import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const RegisterPage = () => {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {

    e.preventDefault();
    setIsLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

      const res = await axios.post(
        `${API_URL}/api/auth/signup`,
        {
          fullName: name,
          email,
          password,
          address
        }
      );

      if (res.data.success) {
        toast.success(res.data.message || "Registration successful!");
        navigate("/login");
      } else {
        toast.error(res.data.message || "Registration failed");
      }

    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Registration failed due to a server error");
    } finally {
      setIsLoading(false);
    }

  };


  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-transparent">

        <div className="bg-gray-900/80 backdrop-blur-2xl border border-gray-600 p-10 rounded-3xl shadow-2xl hover:border-gray-400 w-full max-w-md text-white transition-all duration-500 animate-slideUp">

          <h1 className="text-3xl font-bold mb-6 text-center">
            Create Account
          </h1>

          <form onSubmit={handleRegister} className="flex flex-col gap-4">

            <input
              type="text"
              placeholder="Full Name"
              onChange={(e) => setName(e.target.value)}
              className="p-3 rounded-xl bg-gray-800/80 border border-gray-500 text-white placeholder-gray-400 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all duration-300"
            />

            <input
              type="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              className="p-3 rounded-xl bg-gray-800/80 border border-gray-500 text-white placeholder-gray-400 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all duration-300"
            />

            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              className="p-3 rounded-xl bg-gray-800/80 border border-gray-500 text-white placeholder-gray-400 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all duration-300"
            />

            <input
              type="text"
              placeholder="Address"
              onChange={(e) => setAddress(e.target.value)}
              className="p-3 rounded-xl bg-gray-800/80 border border-gray-500 text-white placeholder-gray-400 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all duration-300"
            />

            <button
              type="submit"
              disabled={isLoading}
              className={`mt-2 p-3 rounded-xl font-bold transition transform ${isLoading ? 'bg-gray-400 cursor-not-allowed text-black' : 'bg-white text-black hover:bg-gray-200 hover:scale-105'}`}
            >
              {isLoading ? "Creating Account..." : "Register"}
            </button>

          </form>

          <p className="text-center text-sm mt-6 text-gray-300">

            Already have an account?

            <span
              onClick={() => navigate("/login")}
              className="ml-2 text-white font-bold cursor-pointer hover:underline"
            >
              Login
            </span>

          </p>

        </div>

      </div>
    </>
  );

};

export default RegisterPage;