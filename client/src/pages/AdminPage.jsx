import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AdminPage = () => {

  const [complaints, setComplaints] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selected, setSelected] = useState(null);

  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const [priority, setPriority] = useState("All");
  const [search, setSearch] = useState("");
  const [newComment, setNewComment] = useState("");

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("isAdmin") !== "true") {
      navigate("/admin-login");
    }
  }, [navigate]);

  const fetchComplaints = async () => {
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

    try {
      const res = await axios.get(
        `${API_URL}/api/complaint`,
        { headers: { token } }
      );

      const data = Array.isArray(res.data) ? res.data : (res.data?.complaints || []);
      setComplaints(data);
      setFiltered(data);
    } catch (error) {
      console.error("Failed to fetch complaints:", error);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);


  useEffect(() => {

    let data = Array.isArray(complaints) ? [...complaints] : [];

    if (category !== "All") {
      data = data.filter(c => c.category === category);
    }

    if (status !== "All") {
      data = data.filter(c => c.status === status);
    }

    if (priority !== "All") {
      data = data.filter(c => c.priority === priority);
    }

    if (search !== "") {
      const searchLower = search.toLowerCase();
      data = data.filter(c =>
        String(c?.city || "").toLowerCase().includes(searchLower) ||
        String(c?.description || "").toLowerCase().includes(searchLower)
      );
    }

    setFiltered(data);

  }, [category, status, priority, search, complaints]);


  const updateStatus = async (id, status) => {
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

    try {
      await axios.put(
        `${API_URL}/api/complaint/${id}`,
        { status },
        { headers: { token } }
      );

      toast.success(`Complaint marked as ${status}`);
      fetchComplaints();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };


  const badgeColor = (status) => {

    if (status === "Resolved") return "bg-emerald-500 shadow-emerald-500/50";
    if (status === "In Progress") return "bg-amber-500 shadow-amber-500/50";

    return "bg-rose-500 shadow-rose-500/50";

  };


  const openMap = (c) => {

    if (!c?.location) return;

    const url = `https://www.google.com/maps?q=${c.location.lat},${c.location.lng}`;
    window.open(url, "_blank");

  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !selected) return;

    // Optimistic UI Update for the showpiece (shows comment instantly)
    const fakeComment = {
      text: newComment,
      user: { fullName: "Admin" },
      createdAt: new Date().toISOString()
    };
    setSelected(prev => ({
      ...prev,
      comments: [...(prev.comments || []), fakeComment]
    }));

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
    try {
      const { data } = await axios.post(
        `${API_URL}/api/complaint/${selected._id}/comment`,
        { text: newComment },
        { headers: { token } }
      );
      toast.success("Comment added!");
      setNewComment("");
      // Update the selected complaint in state to show the new comment instantly
      setSelected(data.complaint);
      // Refetch all complaints to keep the main list in sync
      fetchComplaints();
    } catch (error) {
      toast.error("Failed to add comment.");
      console.error("Comment error:", error);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-transparent text-white p-8">

        <nav className="flex flex-wrap justify-between items-center mb-8 bg-gray-900/90 p-5 rounded-2xl border border-gray-700 shadow-lg animate-fadeIn">
          <h2 className="text-2xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-500">
            CivicAI <span className="text-white">Admin Portal</span>
          </h2>
          <div className="flex gap-4">
            <button onClick={() => navigate("/map")} className="px-5 py-2 rounded-lg bg-gray-800 border border-gray-600 hover:bg-gray-700 text-white font-semibold transition-all shadow-md">
              View Map
            </button>
            <button onClick={() => navigate("/analytics")} className="px-5 py-2 rounded-lg bg-gray-800 border border-gray-600 hover:bg-gray-700 text-white font-semibold transition-all shadow-md">
              Analytics
            </button>
            <button onClick={() => { localStorage.removeItem("isAdmin"); navigate("/admin-login"); }} className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold transition-all shadow-md hover:shadow-red-500/30">
              Logout Admin
            </button>
          </div>
        </nav>

        <h1 className="text-3xl font-bold text-gray-100 mb-6 flex items-center justify-center gap-3">
          Complaint Management
        </h1>


        {/* FILTERS */}

        <div className="flex flex-wrap gap-4 justify-center mb-8">

          <input
            placeholder="Search complaints..."
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 rounded-xl bg-gray-800/80 border border-gray-500 text-white placeholder-gray-400 focus:border-white focus:ring-1 focus:ring-white outline-none transition-all backdrop-blur-md"
          />

          <select
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2 rounded-xl bg-gray-800/80 border border-gray-500 text-white outline-none focus:border-white focus:ring-1 focus:ring-white transition-all backdrop-blur-md"
          >
            <option className="text-black" value="All">All Categories</option>
            <option className="text-black" value="Road Issue">Road Issue</option>
            <option className="text-black" value="Sanitation">Garbage</option>
            <option className="text-black" value="Water Supply">Water</option>
            <option className="text-black" value="Electricity">Electricity</option>
          </select>

          <select
            onChange={(e) => setStatus(e.target.value)}
            className="px-4 py-2 rounded-xl bg-gray-800/80 border border-gray-500 text-white outline-none focus:border-white focus:ring-1 focus:ring-white transition-all backdrop-blur-md"
          >
            <option className="text-black" value="All">All Status</option>
            <option className="text-black" value="New">New</option>
            <option className="text-black" value="In Progress">In Progress</option>
            <option className="text-black" value="Resolved">Resolved</option>
          </select>

          <select
            onChange={(e) => setPriority(e.target.value)}
            className="px-4 py-2 rounded-xl bg-gray-800/80 border border-gray-500 text-white outline-none focus:border-white focus:ring-1 focus:ring-white transition-all backdrop-blur-md"
          >
            <option className="text-black" value="All">All Priority</option>
            <option className="text-black" value="High">High</option>
            <option className="text-black" value="Medium">Medium</option>
            <option className="text-black" value="Low">Low</option>
          </select>

        </div>


        {/* TABLE */}

        <div className="overflow-x-auto bg-white/10 backdrop-blur-md rounded-xl shadow-2xl border border-gray-600 animate-slideUp">

          <table className="w-full text-left border-collapse">

            <thead className="bg-gray-800 text-gray-200 uppercase text-xs font-semibold tracking-wider border-b border-gray-600">

              <tr>

                <th className="p-4">City</th>
                <th className="p-4">Category</th>
                <th className="p-4">Priority</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Image</th>
                <th className="p-4 text-center">Actions</th>

              </tr>

            </thead>

            <tbody>

              {(Array.isArray(filtered) ? filtered : []).map((c) => (

                <tr
                  key={c._id}
                  className="border-b border-gray-700 odd:bg-gray-900/50 even:bg-gray-800/50 hover:bg-gray-700/60 transition-colors duration-200"
                >

                  <td className="p-4 font-medium">{c.city}</td>

                  <td className="p-4">{c.category}</td>

                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${c.priority === 'High' ? 'text-red-400 bg-red-400/10 border border-red-400/20' : c.priority === 'Medium' ? 'text-yellow-400 bg-yellow-400/10 border border-yellow-400/20' : 'text-green-400 bg-green-400/10 border border-green-400/20'}`}>{c.priority}</span>
                  </td>

                  <td className="p-4">

                    <span className={`text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm ${badgeColor(c.status)}`}>
                      {c.status}
                    </span>

                  </td>

                  <td className="p-4 text-center">

                    {c.image && (

                      <button
                        onClick={() => setSelected(c)}
                        className="bg-transparent border border-blue-400 text-blue-400 text-xs px-3 py-1 rounded-full hover:bg-blue-400 hover:text-white transition"
                      >
                        View
                      </button>

                    )}

                  </td>

                  <td className="p-4 flex justify-center gap-2">

                    <button
                      onClick={() => updateStatus(c._id, "In Progress")}
                      className="bg-amber-500 text-xs px-3 py-1 rounded shadow-md text-white hover:bg-amber-600 transition-colors"
                    >
                      Start
                    </button>

                    <button
                      onClick={() => updateStatus(c._id, "Resolved")}
                      className="bg-emerald-500 text-xs px-3 py-1 rounded shadow-md text-white hover:bg-emerald-600 transition-colors"
                    >
                      Resolve
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>


        {/* DETAILS MODAL */}

        {selected && (

          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">

            <div className="bg-gray-900/95 backdrop-blur-3xl border border-gray-600 text-white p-8 rounded-3xl max-w-2xl w-full shadow-2xl animate-slideUp max-h-[90vh] overflow-y-auto">

              <h2 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">
                Complaint Details
              </h2>

              <p><b>City:</b> {selected.city}</p>
              <p><b>Address:</b> {selected.address}</p>
              <p><b>Category:</b> {selected.category}</p>
              <p><b>Priority:</b> {selected.priority}</p>
              <p><b>Status:</b> {selected.status}</p>

              <p className="mt-2">
                <b>Description:</b> {selected.description}
              </p>

              {selected.image && (

                <img
                  src={selected.image}
                  className="mt-4 rounded-lg"
                />

              )}

              {/* COMMENTS SECTION */}
              <div className="mt-6">
                <h3 className="font-bold mb-3 text-lg">Comments</h3>
                <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                  {(selected.comments && selected.comments.length > 0) ? selected.comments.map((comment, index) => (
                    <div key={index} className="bg-gray-800/50 p-3 rounded-lg">
                      <p className="text-sm text-gray-300">{comment.text}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        - <b>{comment.user?.fullName || 'Admin'}</b> on {new Date(comment.createdAt || Date.now()).toLocaleDateString()}
                      </p>
                    </div>
                  )) : (
                    <p className="text-sm text-gray-500">No comments yet.</p>
                  )}
                </div>

                {/* ADD COMMENT FORM */}
                <div className="mt-4 flex gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-grow p-2 rounded-lg bg-gray-800 border border-gray-600 focus:outline-none focus:border-blue-400"
                  />
                  <button
                    onClick={handleAddComment}
                    className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-500 transition"
                  >
                    Send
                  </button>
                </div>
              </div>

              <div className="flex justify-between mt-8">

                <button
                  onClick={() => openMap(selected)}
                  className="bg-white text-black font-bold px-4 py-2 rounded-xl hover:bg-gray-200"
                >
                  View On Map
                </button>

                <button
                  onClick={() => setSelected(null)}
                  className="bg-transparent border border-gray-400 text-gray-300 px-4 py-2 rounded-xl hover:bg-gray-800"
                >
                  Close
                </button>

              </div>

            </div>

          </div>

        )}

      </div>
    </>

  );

};

export default AdminPage;