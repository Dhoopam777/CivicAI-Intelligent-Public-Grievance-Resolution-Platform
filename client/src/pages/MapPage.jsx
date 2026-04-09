import axios from "axios";
import "leaflet/dist/leaflet.css";

import L from "leaflet";

import { useEffect, useState } from "react";
import {
  CircleMarker,
  MapContainer,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";

const HeatmapLayer = ({ data, enabled }) => {
  const map = useMap();

  useEffect(() => {
    if (!enabled) return;

    let heatLayerInstance = null;
    let isMounted = true;

    const renderHeatmap = async () => {
      // Safely load leaflet-heat AFTER window.L is assigned (Fixes Vite import hoisting bugs)
      window.L = L;
      await import("leaflet.heat");

      if (!isMounted) return;

      const points = Array.isArray(data)
        ? data
          .filter((c) => c.location && typeof c.location.lat === "number" && typeof c.location.lng === "number")
          .map((c) => [c.location.lat, c.location.lng, 1]) // Max intensity for vibrant colors
        : [];

      // Prevent map crash if there are no valid points
      if (points.length === 0) return;

      heatLayerInstance = L.heatLayer(points, {
        radius: 35, // Larger radius for better visibility
        blur: 25,
        maxZoom: 17,
        max: 1.0,
        gradient: {
          0.4: 'blue',
          0.6: 'cyan',
          0.7: 'lime',
          0.8: 'yellow',
          1.0: 'red'
        }
      });

      heatLayerInstance.addTo(map);
    };

    renderHeatmap();

    return () => {
      isMounted = false;
      if (heatLayerInstance && map) {
        map.removeLayer(heatLayerInstance);
      }
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
  const [isLoading, setIsLoading] = useState(true);
  const [serverWaking, setServerWaking] = useState(false);

  const token = localStorage.getItem("token");

  const fetchComplaints = async (retryCount = 0) => {
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
    if (retryCount === 0) setIsLoading(true);

    try {
      const headers = (token && token !== "null") ? { token } : {};
      const res = await axios.get(
        `${API_URL}/api/complaint`,
        { headers }
      );

      // ✅ FIX: ensure array
      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.complaints || [];

      setComplaints(data);
      setFiltered(data);

      setIsLoading(false);
      setServerWaking(false);
    } catch (err) {
      console.error("Fetch error:", err.response?.data?.message || err.message);
      const isWakeupError = !err.response || err.response.status === 502 || err.response.status === 503;

      if (isWakeupError && retryCount < 15) {
        setServerWaking(true);
        setTimeout(() => fetchComplaints(retryCount + 1), 3000);
      } else {
        setComplaints([]);
        setFiltered([]);
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []); // ❌ removed dependency loop

  useEffect(() => {
    let data = Array.isArray(complaints) ? [...complaints] : [];

    if (category !== "All") {
      data = data.filter((c) => c.category === category);
    }

    if (status !== "All") {
      data = data.filter((c) => c.status === status);
    }

    setFiltered(data);
  }, [category, status, complaints]);

  const getColor = (status) => {
    if (status === "Resolved") return "#22c55e";
    if (status === "In Progress") return "#f59e0b";

    return "#ef4444";
  };

  const handleUpvote = async (id) => {
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
    try {
      const headers = (token && token !== "null") ? { token } : {};
      await axios.put(`${API_URL}/api/complaint/${id}/upvote`, {}, { headers });
      // Refresh the map data to show the new upvote count
      fetchComplaints();
    } catch (err) {
      console.error("Failed to upvote", err);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-transparent text-slate-800 dark:text-white p-8 animate-fadeIn transition-colors">
        <h1 className="text-4xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-500 dark:from-blue-400 dark:to-cyan-400">
          Live Tracking Map
        </h1>

        {/* CONTROL PANEL */}

        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <select
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2 rounded-xl bg-white/80 dark:bg-gray-800/80 border border-gray-400 dark:border-gray-500 outline-none focus:border-blue-500 dark:focus:border-white transition-all backdrop-blur-md"
          >
            <option className="text-black" value="All">All Categories</option>
            <option className="text-black" value="Road Issue">Road Issues</option>
            <option className="text-black" value="Sanitation">Garbage</option>
            <option className="text-black" value="Water Supply">Water</option>
            <option className="text-black" value="Electricity">Electricity</option>
          </select>

          <select
            onChange={(e) => setStatus(e.target.value)}
            className="px-4 py-2 rounded-xl bg-white/80 dark:bg-gray-800/80 border border-gray-400 dark:border-gray-500 outline-none focus:border-blue-500 dark:focus:border-white transition-all backdrop-blur-md"
          >
            <option className="text-black" value="All">All Status</option>
            <option className="text-black" value="New">New</option>
            <option className="text-black" value="In Progress">In Progress</option>
            <option className="text-black" value="Resolved">Resolved</option>
          </select>

          <button
            onClick={() => setHeatmap(!heatmap)}
            className="px-4 py-2 bg-blue-600 dark:bg-white text-white dark:text-black font-semibold rounded-xl hover:bg-blue-700 dark:hover:bg-gray-200 transition hover:scale-105"
          >
            {heatmap ? "Hide Heatmap" : "Show Heatmap"}
          </button>

          <button
            onClick={() => setMarkers(!markers)}
            className="px-4 py-2 bg-transparent border border-slate-700 dark:border-white text-slate-700 dark:text-white font-semibold rounded-xl hover:bg-slate-800 hover:text-white dark:hover:bg-white dark:hover:text-black transition hover:scale-105"
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

        {/* MAP */}

        <div className="max-w-6xl mx-auto rounded-3xl overflow-hidden shadow-2xl border border-gray-300 dark:border-gray-600 animate-slideUp relative">
          {isLoading && (
            <div className="absolute inset-0 bg-black/70 z-10 flex flex-col items-center justify-center backdrop-blur-sm">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-white text-xl font-bold animate-pulse">
                {serverWaking ? "Waking up the Render server... (up to 45s)" : "Loading Map Data..."}
              </p>
            </div>
          )}
          <MapContainer
            center={[15.3173, 75.7139]}
            zoom={6}
            style={{ height: "600px", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />

            <HeatmapLayer data={filtered} enabled={heatmap} />

            {markers &&
              Array.isArray(filtered) &&
              filtered.map((c) => {
                if (!c.location || typeof c.location.lat !== "number" || typeof c.location.lng !== "number") return null;

                return (
                  <CircleMarker
                    key={c._id}
                    center={[c.location.lat, c.location.lng]}
                    radius={7}
                    pathOptions={{
                      color: getColor(c.status),
                      fillOpacity: 0.9,
                    }}
                  >
                    <Popup>
                      <div className="text-gray-800">
                        <h3 className="font-bold text-lg mb-1">{c.category}</h3>

                        <p className="text-sm mb-2">{c.description}</p>

                        <p className="text-xs"><b style={{ color: getColor(c.status) }}>●</b> Status: {c.status}</p>

                        <div className="flex items-center gap-3 mt-3 border-t pt-2">
                          <span className="font-semibold text-blue-600">
                            👍 {c.upvotes || 0} Votes
                          </span>
                          <button onClick={() => handleUpvote(c._id)} className="bg-blue-500 text-white px-3 py-1 rounded-md text-xs hover:bg-blue-600 transition shadow">
                            Upvote
                          </button>
                        </div>

                        {c.image && (
                          <img src={c.image} className="w-full max-w-[150px] mt-2 rounded-lg" />
                        )}
                      </div>
                    </Popup>
                  </CircleMarker>
                );
              })}
          </MapContainer>
        </div>
      </div>
    </>
  );
};

export default MapPage;
