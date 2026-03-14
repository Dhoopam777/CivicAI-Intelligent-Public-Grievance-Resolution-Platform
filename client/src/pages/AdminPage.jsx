import axios from "axios";
import { useEffect, useState } from "react";
import ParticlesBackground from "../components/ParticlesBackground";

const AdminPage = () => {

  const [complaints,setComplaints] = useState([]);
  const [filtered,setFiltered] = useState([]);
  const [selected,setSelected] = useState(null);

  const [category,setCategory] = useState("All");
  const [status,setStatus] = useState("All");
  const [priority,setPriority] = useState("All");
  const [search,setSearch] = useState("");

  const token = localStorage.getItem("token");

  const fetchComplaints = async()=>{

    const res = await axios.get(
      "https://civicai-intelligent-public-grievance.onrender.com/api/complaint",
      { headers:{ token } }
    );

    setComplaints(res.data.complaints);
    setFiltered(res.data);

  };

  useEffect(()=>{
    fetchComplaints();
  },[]);


  useEffect(()=>{

    let data=[...complaints];

    if(category!=="All"){
      data=data.filter(c=>c.category===category);
    }

    if(status!=="All"){
      data=data.filter(c=>c.status===status);
    }

    if(priority!=="All"){
      data=data.filter(c=>c.priority===priority);
    }

    if(search!==""){
      data=data.filter(c =>
        c.city.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFiltered(data);

  },[category,status,priority,search,complaints]);


  const updateStatus = async(id,status)=>{

    await axios.put(
      `https://civicai-intelligent-public-grievance.onrender.com/api/complaint/${id}`,
      { status },
      { headers:{ token } }
    );

    fetchComplaints();

  };


  const badgeColor = (status)=>{

    if(status==="Resolved") return "bg-green-500";
    if(status==="In Progress") return "bg-yellow-500";

    return "bg-red-500";

  };


  const openMap = (c)=>{

    if(!c.location) return;

    const url=`https://www.google.com/maps?q=${c.location.lat},${c.location.lng}`;
    window.open(url,"_blank");

  };


  return(
    <>
          <ParticlesBackground />

    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800 text-white p-8">

      <h1 className="text-4xl font-bold text-center mb-8">
        🏛 Civic Admin Dashboard
      </h1>


      {/* FILTERS */}

      <div className="flex flex-wrap gap-4 justify-center mb-8">

        <input
          placeholder="Search complaints..."
          onChange={(e)=>setSearch(e.target.value)}
          className="px-4 py-2 rounded-lg text-black"
        />

        <select
          onChange={(e)=>setCategory(e.target.value)}
          className="px-4 py-2 rounded-lg text-black"
        >
          <option value="All">All Categories</option>
          <option value="Road Issue">Road Issue</option>
          <option value="Sanitation">Garbage</option>
          <option value="Water Supply">Water</option>
          <option value="Electricity">Electricity</option>
        </select>

        <select
          onChange={(e)=>setStatus(e.target.value)}
          className="px-4 py-2 rounded-lg text-black"
        >
          <option value="All">All Status</option>
          <option value="New">New</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </select>

        <select
          onChange={(e)=>setPriority(e.target.value)}
          className="px-4 py-2 rounded-lg text-black"
        >
          <option value="All">All Priority</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

      </div>


      {/* TABLE */}

      <div className="overflow-x-auto bg-white text-black rounded-xl shadow-lg">

        <table className="w-full">

          <thead className="bg-slate-900 text-white">

            <tr>

              <th className="p-3">City</th>
              <th className="p-3">Category</th>
              <th className="p-3">Priority</th>
              <th className="p-3">Status</th>
              <th className="p-3">Image</th>
              <th className="p-3">Actions</th>

            </tr>

          </thead>

          <tbody>

            {filtered.map((c)=>(

              <tr
                key={c._id}
                className="text-center border-b hover:bg-gray-100 transition"
              >

                <td className="p-3">{c.city}</td>

                <td className="p-3">{c.category}</td>

                <td className="p-3">{c.priority}</td>

                <td className="p-3">

                  <span className={`text-white px-3 py-1 rounded-full text-sm ${badgeColor(c.status)}`}>
                    {c.status}
                  </span>

                </td>

                <td className="p-3">

                  {c.image && (

                    <button
                      onClick={()=>setSelected(c)}
                      className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
                    >
                      View
                    </button>

                  )}

                </td>

                <td className="p-3 flex justify-center gap-2">

                  <button
                    onClick={()=>updateStatus(c._id,"In Progress")}
                    className="bg-yellow-500 px-3 py-1 rounded text-white hover:bg-yellow-600"
                  >
                    Start
                  </button>

                  <button
                    onClick={()=>updateStatus(c._id,"Resolved")}
                    className="bg-green-500 px-3 py-1 rounded text-white hover:bg-green-600"
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

        <div className="fixed inset-0 bg-black/80 flex items-center justify-center">

          <div className="bg-slate-900 text-white p-6 rounded-xl max-w-lg w-full">

            <h2 className="text-2xl font-bold mb-4">
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

            <div className="flex justify-between mt-6">

              <button
                onClick={()=>openMap(selected)}
                className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
              >
                View On Map
              </button>

              <button
                onClick={()=>setSelected(null)}
                className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
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