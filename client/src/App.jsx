import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";

import AdminLoginPage from "./pages/AdminLoginPage";
import AdminPage from "./pages/AdminPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import MapPage from "./pages/MapPage";
import ProfilePage from "./pages/ProfilePage";
import RegisterPage from "./pages/RegisterPage";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cursor from "./components/Cursor";

const App = () => {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <>
      {/* Custom Animated Cursor */}
      <Cursor />

      <ToastContainer position="top-right" autoClose={3000} theme="dark" />

      {/* GLOBAL VIDEO BACKGROUND */}
      <div className="fixed inset-0 w-full h-full -z-10">
        <video autoPlay loop muted playsInline className="object-cover w-full h-full">
          <source src="https://videos.pexels.com/video-files/3129671/3129671-hd_1920_1080_30fps.mp4" type="video/mp4" />
        </video>
        <div className={`absolute inset-0 backdrop-blur-md transition-colors duration-700 ${darkMode ? 'bg-black/70' : 'bg-white/50'}`}></div>
      </div>

      {/* GLOBAL THEME TOGGLE (AVAILABLE ON ALL PAGES) */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl text-2xl shadow-[0_0_20px_rgba(0,0,0,0.15)] dark:shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-all duration-300 hover:scale-110 hover:-translate-y-1 border border-gray-300 dark:border-gray-600 flex items-center justify-center"
        title="Toggle Light/Dark Mode"
      >
        {darkMode ? "🌞" : "🌙"}
      </button>

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin-login" element={<AdminLoginPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
      </Routes>
    </>
  );
};

export default App;