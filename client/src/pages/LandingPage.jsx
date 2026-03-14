import { useNavigate } from "react-router-dom";

const LandingPage = () => {

  const navigate = useNavigate();

  return (
    <>
    {/* <ParticlesBackground /> */}
    <div className="min-h-screen bg-gradient-to-r from-indigo-900 via-purple-900 via- to-slate-900 animate-gradient text-white">

      {/* NAVBAR */}

      <div className="flex justify-between items-center px-10 py-6">

        <h1 className="text-3xl font-bold tracking-wide animate-fadeIn">
          CivicAI
        </h1>

        <div className="flex gap-4">

          <button
            onClick={() => navigate("/login")}
            className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition duration-300 shadow-lg hover:scale-105"
          >
            Login
          </button> 

          <button
            onClick={() => navigate("/register")}
            className="px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 transition duration-300 shadow-lg hover:scale-105"
          >
            Register
          </button>

        </div>

      </div>


      {/* HERO SECTION */}

      <div className="flex flex-col items-center text-center mt-24 px-6 animate-slideUp">

        <h1 className="text-6xl font-bold mb-6 leading-tight drop-shadow-lg">

          Smart Civic Complaint Monitoring

        </h1>

        <p className="max-w-xl text-gray-200 text-lg mb-10">

          Report civic problems instantly using live location and images.
          Authorities monitor complaints using smart dashboards and analytics.

        </p>

        <div className="flex gap-6">

          <button
            onClick={() => navigate("/register")}
            className="px-8 py-4 bg-indigo-800 hover:bg-indigo-700 rounded-xl text-lg shadow-xl transition transform hover:scale-110"
          >
            Report Issue
          </button>

          <button
            onClick={() => navigate("/map")}
            className="px-8 py-4 bg-gray-700 hover:bg-gray-800 rounded-xl text-lg shadow-xl transition transform hover:scale-110"
          >
            View Live Map
          </button>

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

    <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg hover:scale-110 hover:bg-white/20 transition duration-300 cursor-pointer animate-fadeIn">

      <div className="text-3xl mb-3">
        {icon}
      </div>

      <h3 className="text-xl font-semibold mb-2">
        {title}
      </h3>

      <p className="text-gray-200 text-sm">
        {text}
      </p>

    </div>

  );

};



const Stat = ({ number, label }) => {

  return (

    <div className="bg-white/10 p-6 rounded-xl text-center shadow-lg hover:scale-105 transition">

      <h2 className="text-4xl font-bold text-indigo-400">
        {number}
      </h2>

      <p className="text-gray-300 mt-2">
        {label}
      </p>

    </div>

  );

};

export default LandingPage;