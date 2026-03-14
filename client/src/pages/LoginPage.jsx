import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import ParticlesBackground from "../components/ParticlesBackground";


const LoginPage = () => {

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async(e)=>{

    e.preventDefault();

    try{

      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email,password }
      );

      localStorage.setItem("token",res.data.token);

      alert("Login successful");

      navigate("/profile");

    }catch(err){
      console.error(err);
      alert("Login failed");

    }

  };

  return(
    <> 
        <ParticlesBackground />

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800">

      <div className="bg-white/10 backdrop-blur-md p-10 rounded-xl shadow-2xl w-full max-w-md text-white transition hover:shadow-indigo-500/40">

        <h1 className="text-3xl font-bold text-center mb-6">
          Login to CivicAI
        </h1>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            className="p-3 rounded-lg bg-white/20 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            className="p-3 rounded-lg bg-white/20 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          <button
            type="submit"
            className="mt-2 p-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition transform hover:scale-105"
          >
            Login
          </button>

        </form>

        <div className="flex items-center my-6">

          <div className="flex-grow h-px bg-gray-400"></div>

          <span className="px-3 text-sm text-gray-300">or</span>

          <div className="flex-grow h-px bg-gray-400"></div>

        </div>

        <button className="w-full p-3 bg-white text-black rounded-lg hover:bg-gray-200 transition">
          Continue with Google
        </button>

        <p className="text-center text-sm mt-6 text-gray-300">

          Don't have an account?

          <span
            onClick={()=>navigate("/register")}
            className="ml-2 text-indigo-400 cursor-pointer hover:underline"
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