import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip
} from "chart.js";

import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const AnalyticsPage = () => {

  const [complaints, setComplaints] = useState([]);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchComplaints = async () => {

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await axios.get(
        `${API_URL}/api/complaint`,
        { headers: { token } }
      );

      const data = Array.isArray(res.data) ? res.data : (res.data?.complaints || []);
      setComplaints(data);
    } catch (err) {
      console.error(err);
    }

  };

  useEffect(() => {
    fetchComplaints();
  }, []);


  /* COUNTS */

  const total = complaints.length;

  const resolved = complaints.filter(c => c.status === "Resolved").length;

  const pending = complaints.filter(c => c.status !== "Resolved").length;

  const inProgress = complaints.filter(c => c.status === "In Progress").length;
  const newStatus = complaints.filter(c => c.status === "New").length;

  const road = complaints.filter(c => c.category === "Road Issue").length;

  const garbage = complaints.filter(c => c.category === "Sanitation").length;

  const water = complaints.filter(c => c.category === "Water Supply").length;

  const electricity = complaints.filter(c => c.category === "Electricity").length;


  const data = {

    labels: [
      "Road Issues",
      "Garbage",
      "Water",
      "Electricity"
    ],

    datasets: [{

      data: [road, garbage, water, electricity],

      backgroundColor: [
        "#ef4444",
        "#3b82f6",
        "#f59e0b",
        "#22c55e"
      ]

    }]

  };

  const barData = {
    labels: ["New", "In Progress", "Resolved"],
    datasets: [{
      label: 'Complaints by Status',
      data: [newStatus, inProgress, resolved],
      backgroundColor: ["#ef4444", "#f59e0b", "#22c55e"],
      borderRadius: 8,
      borderWidth: 0,
    }]
  };


  return (

    <>
      <div className="min-h-screen bg-transparent text-white p-8">

        {/* NAVBAR */}
        <nav className="flex flex-wrap justify-between items-center mb-10 bg-gray-900/80 p-5 rounded-3xl border border-gray-600 backdrop-blur-2xl shadow-2xl animate-fadeIn">
          <h2 className="text-2xl font-extrabold tracking-wide text-white">
            CivicAI <span className="text-gray-400 font-light">Portal</span>
          </h2>
          <div className="flex flex-wrap gap-4 font-semibold text-sm">
            <button onClick={() => navigate("/profile")} className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-600 transition">Profile</button>
            <button onClick={() => navigate("/map")} className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-600 transition">Map</button>
            <button onClick={() => navigate("/analytics")} className="px-4 py-2 rounded-xl bg-white text-black hover:bg-gray-200 transition shadow-[0_0_15px_rgba(255,255,255,0.4)]">Analytics</button>
            <button onClick={() => { localStorage.removeItem("token"); navigate("/"); }} className="px-4 py-2 rounded-xl bg-red-600/80 hover:bg-red-500 text-white transition">Logout</button>
          </div>
        </nav>

        <h1 className="text-4xl font-bold text-center mb-10">
          Civic Analytics Dashboard
        </h1>


        {/* KPI CARDS */}

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-10">

          <StatCard
            title="Total Complaints"
            value={total}
            color="bg-gray-800/70 backdrop-blur-2xl border border-gray-600 hover:border-gray-400 text-white"
          />

          <StatCard
            title="Resolved"
            value={resolved}
            color="bg-gray-800/70 backdrop-blur-2xl border border-gray-600 hover:border-gray-400 text-green-400"
          />

          <StatCard
            title="Pending"
            value={pending}
            color="bg-gray-800/70 backdrop-blur-2xl border border-gray-600 hover:border-gray-400 text-red-400"
          />

        </div>


        {/* CHARTS CONTAINER */}

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">

          <div className="bg-gray-900/80 backdrop-blur-2xl text-white p-8 rounded-3xl border border-gray-600 shadow-2xl animate-slideUp hover:border-gray-400 transition-all duration-500">
            <h2 className="text-xl font-semibold text-center mb-6">
              Complaint Distribution
            </h2>
            <div className="h-64 flex justify-center">
              <Pie data={data} options={{ maintainAspectRatio: false }} />
            </div>
          </div>

          <div className="bg-gray-900/80 backdrop-blur-2xl text-white p-8 rounded-3xl border border-gray-600 shadow-2xl animate-slideUp hover:border-gray-400 transition-all duration-500 delay-100">
            <h2 className="text-xl font-semibold text-center mb-6">
              Status Breakdown
            </h2>
            <div className="h-64 flex justify-center">
              <Bar data={barData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
            </div>
          </div>

        </div>

      </div>
    </>

  );

};


const StatCard = ({ title, value, color }) => {

  return (
    <div className={`${color} p-8 rounded-3xl shadow-2xl hover:-translate-y-2 transition-all duration-500 text-center animate-slideUp`}>

      <h3 className="text-lg font-semibold">
        {title}
      </h3>

      <p className="text-3xl font-bold mt-2">
        {value}
      </p>

    </div>

  );

};

export default AnalyticsPage;