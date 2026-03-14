import axios from "axios";
import "leaflet/dist/leaflet.css";
import ParticlesBackground from "../components/ParticlesBackground";

import L from "leaflet";
import "leaflet.heat/dist/leaflet-heat.js";
window.L = L;

import { useEffect, useState } from "react";
import { CircleMarker, MapContainer, Popup, TileLayer, useMap } from "react-leaflet";


const HeatmapLayer = ({ data, enabled }) => {

  const map = useMap(); 

  useEffect(() => {

    if (!enabled) return;

    const points = data
      .filter(c => c.location)
      .map(c => [
        c.location.lat,
        c.location.lng,
        0.6
      ]);

    const heat = L.heatLayer(points, {
      radius: 25,
      blur: 20,
      maxZoom: 17
    });

    heat.addTo(map);

    return () => {
      map.removeLayer(heat);
    };

  }, [data, enabled, map]);

  return null;

};


const MapPage = () => {

  const [complaints, setComplaints] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");

  const [heatmap, setHeatmap] = useState(true);
  const [markers, setMarkers] = useState(true);

  const token = localStorage.getItem("token");

  const fetchComplaints = async () => {

    const res = await axios.get(
      "https://civicai-intelligent-public-grievance.onrender.com/api/complaint",
      { headers: { token } }
    );

    setComplaints(res.data.complaints);
    setFiltered(res.data);

  };

  useEffect(() => {
    fetchComplaints();
  }, []);


  useEffect(() => {

    let data = [...complaints];

    if (category !== "All") {
      data = data.filter(c => c.category === category);
    }

    if (status !== "All") {
      data = data.filter(c => c.status === status);
    }

    setFiltered(data);

  }, [category, status, complaints]);


  const getColor = (status) => {

    if (status === "Resolved") return "#22c55e";
    if (status === "In Progress") return "#f59e0b";

    return "#ef4444";

  };


  return (
  <>
      <ParticlesBackground />

    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-black text-white p-8 animate-fadeIn">

      <h1 className="text-4xl font-bold text-center mb-6">
        Smart Civic Monitoring Map
      </h1>


      {/* CONTROL PANEL */}

      <div className="flex flex-wrap justify-center gap-4 mb-6">

        <select
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-2 rounded-lg text-black"
        >
          <option value="All">All Categories</option>
          <option value="Road Issue">Road Issues</option>
          <option value="Sanitation">Garbage</option>
          <option value="Water Supply">Water</option>
          <option value="Electricity">Electricity</option>
        </select>


        <select
          onChange={(e) => setStatus(e.target.value)}
          className="px-4 py-2 rounded-lg text-black"
        >
          <option value="All">All Status</option>
          <option value="New">New</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </select>


        <button
          onClick={() => setHeatmap(!heatmap)}
          className="px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-700 transition hover:scale-105"
        >
          {heatmap ? "Hide Heatmap" : "Show Heatmap"}
        </button>


        <button
          onClick={() => setMarkers(!markers)}
          className="px-4 py-2 bg-emerald-600 rounded-lg hover:bg-emerald-700 transition hover:scale-105"
        >
          {markers ? "Hide Markers" : "Show Markers"}
        </button>

      </div>


      {/* LEGEND */}

      <div className="flex justify-center gap-6 mb-6 text-sm">

        <span className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded-full"></div>
          New
        </span>

        <span className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
          In Progress
        </span>

        <span className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded-full"></div>
          Resolved
        </span>

      </div>


      {/* MAP CONTAINER */}

      <div className="max-w-6xl mx-auto rounded-xl overflow-hidden shadow-2xl border border-white/20 animate-slideUp">

        <MapContainer
          center={[15.3173, 75.7139]}
          zoom={6}
          style={{ height: "600px", width: "100%" }}
        >

          <TileLayer
            attribution="OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />


          <HeatmapLayer data={filtered} enabled={heatmap} />


          {markers && filtered.map((c) => {

            if (!c.location) return null;

            return (

              <CircleMarker
                key={c._id}
                center={[c.location.lat, c.location.lng]}
                radius={c.priority === "High" ? 7 : 7}
className={c.priority === "High" ? "animate-pulse" : ""}
                pathOptions={{
                  color: getColor(c.status),
                  fillOpacity: 0.9
                }}
              >

                <Popup>

                  <h3 className="font-bold">
                    {c.category}
                  </h3>

                  <p>{c.description}</p>

                  <p>Status: {c.status}</p>

                  {c.image && (
                    <img
                      src={c.image}
                      className="w-40 mt-2 rounded-lg"
                    />
                  )}

                </Popup>

              </CircleMarker>

            )

          })}

        </MapContainer>

      </div>

    </div>
  </>
  );

};

export default MapPage;