import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {

  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");

  const [quickDesc, setQuickDesc] = useState("");
  const [image, setImage] = useState("");

  const [complaints, setComplaints] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();


  const handleImage = (file) => {

    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onloadend = () => {
      setImage(reader.result);
    };

  };


  const submitManualComplaint = async (e) => {

    e.preventDefault();

    if (!city || !description) {
      return toast.warning("Please fill the required fields (City, Description)");
    }

    setIsSubmitting(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

      await axios.post(
        `${API_URL}/api/complaint`,
        { city, state, address, description, image },
        { headers: { token } }
      );

      toast.success("Complaint submitted successfully!");

      setCity("");
      setState("");
      setAddress("");
      setDescription("");
      setImage("");

      fetchComplaints();

    } catch (err) {
      console.error(err);
      toast.error("Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }

  };


  const quickLocationSubmit = () => {

    if (!quickDesc) {
      toast.warning("Please describe the issue first!");
      return;
    }

    setIsLocating(true);
    toast.info("Fetching your live location...");

    navigator.geolocation.getCurrentPosition(async (pos) => {

      try {

        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        const res = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );

        const addressData = res.data?.address || {};

        const detectedCity =
          addressData.city ||
          addressData.town ||
          addressData.village ||
          "";

        const detectedState = addressData.state || "";
        const detectedAddress = res.data?.display_name || "";

        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
        await axios.post(
          `${API_URL}/api/complaint`,
          {
            city: detectedCity,
            state: detectedState,
            address: detectedAddress,
            description: quickDesc,
            image
          },
          { headers: { token } }
        );

        toast.success("Complaint submitted using your live location!");

        setQuickDesc("");
        setImage("");

        fetchComplaints();

      } catch (err) {
        console.error(err);
        toast.error("Submission failed. Please try again.");
      } finally {
        setIsLocating(false);
      }

    }, () => {
      toast.error("Location access denied or unavailable.");
      setIsLocating(false);
    });

  };


  const fetchComplaints = async () => {

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

      const res = await axios.get(
        `${API_URL}/api/complaint/my`,
        { headers: { token } }
      );

      const list =
        Array.isArray(res.data) ? res.data : (res.data?.complaints || []);

      setComplaints(list);

    } catch (err) {
      console.error(err);
      setComplaints([]);
    }

  };


  useEffect(() => {
    fetchComplaints();
  }, []);



  return (
    <>
      <div className="min-h-screen bg-transparent text-white p-8">

        {/* NAVBAR */}
        <nav className="flex flex-wrap justify-between items-center mb-10 bg-gray-900/80 p-5 rounded-3xl border border-gray-600 backdrop-blur-2xl shadow-2xl animate-fadeIn">
          <h2 className="text-2xl font-extrabold tracking-wide text-white">
            CivicAI <span className="text-gray-400 font-light">Portal</span>
          </h2>
          <div className="flex flex-wrap gap-4 font-semibold text-sm">
            <button onClick={() => navigate("/profile")} className="px-4 py-2 rounded-xl bg-white text-black hover:bg-gray-200 transition shadow-[0_0_15px_rgba(255,255,255,0.4)]">Profile</button>
            <button onClick={() => navigate("/map")} className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-600 transition">Map</button>
            <button onClick={() => navigate("/analytics")} className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-600 transition">Analytics</button>
            <button onClick={() => { localStorage.removeItem("token"); navigate("/"); }} className="px-4 py-2 rounded-xl bg-red-600/80 hover:bg-red-500 text-white transition">Logout</button>
          </div>
        </nav>

        <h1 className="text-5xl font-extrabold text-center mb-10 tracking-tight text-white animate-slideUp">
          Civic Complaint Portal
        </h1>


        {/* MANUAL FORM */}

        <div className="max-w-xl mx-auto bg-gray-900/80 backdrop-blur-2xl border border-gray-600 p-8 rounded-3xl shadow-2xl hover:border-gray-400 transition-all duration-500 mb-10 animate-slideUp">

          <h2 className="text-xl font-semibold mb-4 text-center">
            Manual Complaint Submission
          </h2>

          <form
            onSubmit={submitManualComplaint}
            className="flex flex-col gap-3"
          >

            <input
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="p-3 rounded-xl bg-gray-800/80 border border-gray-500 text-white placeholder-gray-400 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all"
            />

            <input
              placeholder="State"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="p-3 rounded-xl bg-gray-800/80 border border-gray-500 text-white placeholder-gray-400 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all"
            />

            <input
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="p-3 rounded-xl bg-gray-800/80 border border-gray-500 text-white placeholder-gray-400 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all"
            />

            <textarea
              placeholder="Describe the issue"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="p-3 rounded-xl bg-gray-800/80 border border-gray-500 text-white placeholder-gray-400 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all"
            />

            <input
              type="file"
              onChange={(e) => handleImage(e.target.files[0])}
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className={`p-3 rounded-xl font-bold transition ${isSubmitting ? 'bg-gray-400 cursor-not-allowed text-black' : 'bg-white text-black hover:bg-gray-200'}`}
            >
              {isSubmitting ? "Submitting..." : "Submit Complaint"}
            </button>

          </form>

        </div>


        {/* QUICK LOCATION */}

        <div className="max-w-xl mx-auto bg-gray-900/80 backdrop-blur-2xl border border-gray-600 p-8 rounded-3xl shadow-2xl hover:border-gray-400 transition-all duration-500 mb-10 animate-slideUp">

          <h2 className="text-xl font-semibold mb-4 text-center">
            Quick Report (Use My Location)
          </h2>

          <textarea
            placeholder="Describe the issue"
            value={quickDesc}
            onChange={(e) => setQuickDesc(e.target.value)}
            className="p-3 rounded-xl bg-gray-800/80 border border-gray-500 text-white placeholder-gray-400 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all w-full mb-3"
          />

          <input
            type="file"
            onChange={(e) => handleImage(e.target.files[0])}
            className="mb-4"
          />

          <button
            onClick={quickLocationSubmit}
            disabled={isLocating}
            className={`p-3 rounded-xl font-bold w-full transition ${isLocating ? 'bg-gray-400 cursor-not-allowed text-black' : 'bg-transparent border border-white text-white hover:bg-white hover:text-black'}`}
          >
            {isLocating ? "📍 Processing..." : "📍 Use My Location & Submit"}
          </button>

        </div>


        {/* COMPLAINT LIST */}

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">

          {(Array.isArray(complaints) ? complaints : []).map((c) => (
            <div
              key={c._id}
              className="bg-gray-800/70 backdrop-blur-xl border border-gray-600 p-6 rounded-2xl shadow-xl hover:-translate-y-3 hover:border-gray-400 transition-all duration-300 animate-fadeIn"
            >

              <h3 className="font-bold mb-2">{c.category}</h3>

              <p>{c.description}</p>

              <p className="text-sm mt-2">
                <b>City:</b> {c.city}
              </p>

              <p className="text-sm">
                <b>Status:</b> {c.status}
              </p>

              {c.image && (
                <img
                  src={c.image}
                  className="mt-3 rounded-lg"
                  alt="complaint"
                />
              )}

            </div>
          ))}

        </div>

      </div>
    </>
  );

};

export default ProfilePage;