import axios from "axios";
import { useEffect, useState } from "react";
import ParticlesBackground from "../components/ParticlesBackground";

const ProfilePage = () => {
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");

  const [quickDesc, setQuickDesc] = useState("");
  const [image, setImage] = useState("");

  const [complaints, setComplaints] = useState([]);

  const token = localStorage.getItem("token");

  const handleImage = (file) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onloadend = () => {
      setImage(reader.result);
    };
  };

  const submitManualComplaint = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5000/api/complaint",
        {
          city,
          state,
          address,
          description,
          image,
        },
        { headers: { token } },
      );

      alert("Complaint submitted");

      setCity("");
      setState("");
      setAddress("");
      setDescription("");
      setImage("");

      fetchComplaints();
    } catch (err) {
      console.error(err);
      alert("Submission failed");
    }
  };

  const quickLocationSubmit = () => {
    if (!quickDesc) {
      alert("Please describe the issue");
      return;
    }

    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        const res = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
        );

        const addressData = res.data.address;

        const detectedCity =
          addressData.city || addressData.town || addressData.village || "";

        const detectedState = addressData.state || "";

        const detectedAddress = res.data.display_name || "";

        await axios.post(
          "http://localhost:5000/api/complaint",
          {
            city: detectedCity,
            state: detectedState,
            address: detectedAddress,
            description: quickDesc,
            image,
          },
          { headers: { token } },
        );

        alert("Complaint submitted using location");

        setQuickDesc("");
        setImage("");

        fetchComplaints();
      } catch (err) {
        console.error(err);
        alert("Submission failed");
      }
    });
  };

  const fetchComplaints = async () => {
    const res = await axios.get("http://localhost:5000/api/complaint/my", {
      headers: { token },
    });

    setComplaints(res.data);
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  return (
    <>
      <ParticlesBackground />

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-black text-white p-8">
        <h1 className="text-4xl font-bold text-center mb-10">
          Civic Complaint Portal
        </h1>

        {/* MANUAL FORM */}

        <div className="max-w-xl mx-auto glass p-8 rounded-xl shadow-xl mb-10">
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
              className="p-3 rounded-lg text-black"
            />

            <input
              placeholder="State"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="p-3 rounded-lg text-black"
            />

            <input
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="p-3 rounded-lg text-black"
            />

            <textarea
              placeholder="Describe the issue"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="p-3 rounded-lg text-black"
            />

            <input
              type="file"
              onChange={(e) => handleImage(e.target.files[0])}
            />

            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 p-3 rounded-lg"
            >
              Submit Complaint
            </button>
          </form>
        </div>

        {/* QUICK LOCATION FORM */}

        <div className="max-w-xl mx-auto glass p-8 rounded-xl shadow-xl mb-10">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Quick Report (Use My Location)
          </h2>

          <textarea
            placeholder="Describe the issue"
            value={quickDesc}
            onChange={(e) => setQuickDesc(e.target.value)}
            className="p-3 rounded-lg text-black w-full mb-3"
          />

          <input
            type="file"
            onChange={(e) => handleImage(e.target.files[0])}
            className="mb-4"
          />

          <button
            onClick={quickLocationSubmit}
            className="bg-green-600 hover:bg-green-700 p-3 rounded-lg w-full"
          >
            📍 Use My Location & Submit
          </button>
        </div>

        {/* COMPLAINT LIST */}

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {complaints.map((c) => {
            return (
              <div
                key={c._id}
                className="glass card-hover p-6 rounded-xl shadow-lg"
              >
                <h3 className="font-bold mb-2">{c.category}</h3>

                <p>{c.description}</p>

                <p className="text-sm mt-2">
                  <b>City:</b> {c.city}
                </p>

                <p className="text-sm">
                  <b>Status:</b> {c.status}
                </p>

                {c.image && <img src={c.image} className="mt-3 rounded-lg" />}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
