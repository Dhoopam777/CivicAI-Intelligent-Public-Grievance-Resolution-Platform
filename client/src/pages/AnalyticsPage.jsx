import axios from "axios";
import { useEffect, useState } from "react";
import ParticlesBackground from "../components/ParticlesBackground";

import {
  ArcElement,
  Chart as ChartJS,
  Legend,
  Tooltip
} from "chart.js";

import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const AnalyticsPage = () => {

  const [complaints,setComplaints] = useState([]);

  const token = localStorage.getItem("token");

  const fetchComplaints = async()=>{

    const res = await axios.get(
      "http://localhost:5000/api/complaint",
      { headers:{ token } }
    );

    setComplaints(res.data);

  };

  useEffect(()=>{
    fetchComplaints();
  },[]);


  /* COUNTS */

  const total = complaints.length;

  const resolved = complaints.filter(c=>c.status==="Resolved").length;

  const pending = complaints.filter(c=>c.status!=="Resolved").length;

  const road = complaints.filter(c=>c.category==="Road Issue").length;

  const garbage = complaints.filter(c=>c.category==="Sanitation").length;

  const water = complaints.filter(c=>c.category==="Water Supply").length;

  const electricity = complaints.filter(c=>c.category==="Electricity").length;


  const data = {

    labels:[
      "Road Issues",
      "Garbage",
      "Water",
      "Electricity"
    ],

    datasets:[{

      data:[road,garbage,water,electricity],

      backgroundColor:[
        "#ef4444",
        "#3b82f6",
        "#f59e0b",
        "#22c55e"
      ]

    }]

  };


  return(

    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800 text-white p-8">

      <h1 className="text-4xl font-bold text-center mb-10">
        📊 Civic Analytics Dashboard
      </h1>


      {/* KPI CARDS */}

      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-10">

        <StatCard
          title="Total Complaints"
          value={total}
          color="bg-indigo-500"
        />

        <StatCard
          title="Resolved"
          value={resolved}
          color="bg-green-500"
        />

        <StatCard
          title="Pending"
          value={pending}
          color="bg-red-500"
        />

      </div>


      {/* CHART */}

      <div className="max-w-2xl mx-auto bg-white text-black p-6 rounded-xl shadow-xl">

        <h2 className="text-xl font-semibold text-center mb-6">
          Complaint Distribution
        </h2>

        <Pie data={data} />

      </div>

    </div>

  );

};


const StatCard = ({title,value,color})=>{

  return(
<>

      <ParticlesBackground />
    <div className={`${color} p-6 rounded-xl shadow-lg hover:scale-105 transition duration-300 text-center`}>

      <h3 className="text-lg font-semibold">
        {title}
      </h3>

      <p className="text-3xl font-bold mt-2">
        {value}
      </p>

    </div>
</>

  );
 
};

export default AnalyticsPage;