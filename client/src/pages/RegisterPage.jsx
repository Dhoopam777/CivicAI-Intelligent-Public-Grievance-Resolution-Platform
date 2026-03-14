import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ParticlesBackground from "../components/ParticlesBackground";

const RegisterPage = () => {

  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [address,setAddress] = useState("");

  const navigate = useNavigate();

  const handleRegister = async(e)=>{

    e.preventDefault();

    try{

      const res = await axios.post(
        "http://localhost:5000/api/auth/signup",
        {
          fullName:name,
          email,
          password,
          address 
        }
      );

      alert(res.data.message);

      navigate("/login");

    }catch(err){

      console.log(err);
      alert("Registration failed");

    }

  };


  return(
<>
      <ParticlesBackground />
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800">

      <div className="bg-white/10 backdrop-blur-md p-10 rounded-xl shadow-2xl w-full max-w-md text-white transition duration-300 hover:shadow-indigo-500/30">

        <h1 className="text-3xl font-bold mb-6 text-center">
          Create Account
        </h1>

        <form onSubmit={handleRegister} className="flex flex-col gap-4">

          <input
            type="text"
            placeholder="Full Name"
            onChange={(e)=>setName(e.target.value)}
            className="p-3 rounded-lg bg-white/20 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          />

          <input
            type="email"
            placeholder="Email"
            onChange={(e)=>setEmail(e.target.value)}
            className="p-3 rounded-lg bg-white/20 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          />

          <input
            type="password"
            placeholder="Password"
            onChange={(e)=>setPassword(e.target.value)}
            className="p-3 rounded-lg bg-white/20 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          />

          <input
            type="text"
            placeholder="Address"
            onChange={(e)=>setAddress(e.target.value)}
            className="p-3 rounded-lg bg-white/20 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          />

          <button
            type="submit"
            className="mt-2 p-3 bg-emerald-500 hover:bg-emerald-600 rounded-lg transition transform hover:scale-105"
          >
            Register
          </button>

        </form>

        <p className="text-center text-sm mt-6 text-gray-300">

          Already have an account?

          <span
            onClick={()=>navigate("/login")}
            className="ml-2 text-indigo-400 cursor-pointer hover:underline"
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