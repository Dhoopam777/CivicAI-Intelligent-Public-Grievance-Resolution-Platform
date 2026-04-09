import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {

  const navigate = useNavigate();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    const handleMouseOver = (e) => {
      if (e.target.tagName.toLowerCase() === 'button' || e.target.closest('button')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  return (
    <>
      <div className="min-h-screen bg-transparent text-slate-900 dark:text-white overflow-hidden font-sans transition-colors duration-500 cursor-none">

        {/* CLASSIC ANIMATED POINTER */}
        <div
          className={`fixed top-0 left-0 w-10 h-10 rounded-full pointer-events-none z-50 transition-all duration-200 ease-out hidden md:block mix-blend-difference ${isHovering ? 'bg-white scale-[1.8] opacity-60' : 'border-[3px] border-white scale-100'}`}
          style={{ transform: `translate(${mousePos.x - 20}px, ${mousePos.y - 20}px)` }}
        />
        <div
          className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-50 hidden md:block mix-blend-difference"
          style={{ transform: `translate(${mousePos.x - 4}px, ${mousePos.y - 4}px)` }}
        />

        {/* NAVBAR */}

        <div className="flex justify-between items-center px-10 py-6">

          <h1 className="text-3xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-cyan-400 animate-fadeIn">
            CivicAI
          </h1>

          <div className="flex gap-4 items-center">

            <button
              onClick={() => navigate("/login")}
              className="px-6 py-2 rounded-full font-semibold bg-white/50 dark:bg-gray-800/60 border border-gray-400 dark:border-gray-500 hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-black backdrop-blur-xl transition-all duration-300 shadow-lg hover:-translate-y-1"
            >
              Login
            </button>

            <button
              onClick={() => navigate("/register")}
              className="px-6 py-2 rounded-full bg-blue-600 dark:bg-white text-white dark:text-black font-bold hover:bg-blue-700 dark:hover:bg-gray-200 transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.4)] dark:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] dark:hover:shadow-[0_0_30px_rgba(255,255,255,0.6)] hover:-translate-y-1"
            >
              Register
            </button>
          </div>

        </div>


        {/* HERO SECTION */}

        <div className="flex flex-col items-center text-center mt-24 px-6 animate-slideUp">

          <h1 className="text-6xl md:text-8xl font-black mb-6 leading-tight drop-shadow-2xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-purple-600 to-blue-500 dark:from-blue-400 dark:via-purple-300 dark:to-cyan-300">

            Smart Civic Complaint Monitoring

          </h1>

          <p className="max-w-3xl text-slate-700 dark:text-gray-300 text-xl md:text-2xl mb-10 font-medium leading-relaxed">

            Report civic problems instantly using live location and images.
            Authorities monitor complaints using smart dashboards and analytics.

          </p>

          <div className="flex gap-6">

            <button
              onClick={() => navigate("/register")}
              className="px-8 py-4 bg-blue-600 dark:bg-white text-white dark:text-black font-extrabold rounded-full text-lg shadow-[0_0_20px_rgba(37,99,235,0.4)] dark:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(37,99,235,0.6)] dark:hover:shadow-[0_0_40px_rgba(255,255,255,0.6)]"
            >
              Report Issue
            </button>

            <button
              onClick={() => navigate("/map")}
              className="px-8 py-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-gray-400 dark:border-gray-500 text-slate-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 font-bold rounded-full text-lg shadow-xl transition-all duration-300 hover:scale-105"
            >
              View Live Map
            </button>

          </div>

          {/* SCROLL INDICATOR */}
          <div className="mt-20 animate-bounce">
            <span className="text-sm font-bold uppercase tracking-[0.3em] text-slate-500 dark:text-gray-400">Discover More</span>
            <div className="text-3xl mt-2 text-blue-600 dark:text-cyan-400">↓</div>
          </div>

        </div>


        {/* STATS */}

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-24 px-6">

          <Stat number="150+" label="Complaints Submitted" />

          <Stat number="95%" label="Resolution Rate" />

          <Stat number="20+" label="Cities Covered" />

        </div>


        {/* FEATURES */}

        <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto mt-24 px-6 pb-20">

          <Feature
            icon="📸"
            title="Photo Evidence"
            text="Upload images of civic problems as proof."
          />

          <Feature
            icon="📍"
            title="Live Location"
            text="Auto detect user location while reporting."
          />

          <Feature
            icon="🗺"
            title="Smart Map"
            text="Visualize complaints across the city."
          />

          <Feature
            icon="📊"
            title="Analytics"
            text="Authorities monitor trends and hotspots."
          />

        </div>

      </div>
    </>
  );

};



const Feature = ({ icon, title, text }) => {

  return (

    <div className="bg-white/60 dark:bg-gray-900/70 backdrop-blur-2xl border border-gray-300 dark:border-gray-600 p-8 rounded-3xl shadow-xl dark:shadow-2xl hover:-translate-y-3 hover:border-blue-500 dark:hover:border-cyan-400 transition-all duration-500 cursor-pointer animate-float group">

      <div className="text-4xl mb-4 transform group-hover:scale-125 transition-transform duration-500 inline-block">
        {icon}
      </div>

      <h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
        {title}
      </h3>

      <p className="text-slate-600 dark:text-gray-300 text-base font-medium">
        {text}
      </p>

    </div>

  );

};



const Stat = ({ number, label }) => {

  return (

    <div className="bg-white/60 dark:bg-gray-900/70 backdrop-blur-2xl border border-gray-300 dark:border-gray-600 p-8 rounded-3xl text-center shadow-xl dark:shadow-2xl hover:border-purple-500 dark:hover:border-purple-400 hover:-translate-y-2 transition-all duration-500 animate-slideUp group">

      <h2 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-purple-600 dark:from-blue-400 dark:to-cyan-300 tracking-tight group-hover:scale-110 transition-transform duration-500">
        {number}
      </h2>

      <p className="text-slate-600 dark:text-gray-300 mt-3 font-semibold text-lg">
        {label}
      </p>

    </div>

  );

};

export default LandingPage;