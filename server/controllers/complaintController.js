import cloudinary from "../config/cloudinary.js";
import geocoder from "../config/geocoder.js";
import Complaint from "../models/Complaint.js";

export const createComplaint = async (req, res) => {
  try {

    const { city, state, address, description, image, location: frontendLocation } = req.body;

    if (!city || !state || !address || !description) {
      return res.status(400).json({
        message: "City, state, address and description are required."
      });
    }

    /* ---------- GEOCODING ---------- */

    let location = frontendLocation || { lat: 0, lng: 0 };

    if (!frontendLocation) {
      try {
        const geo = await geocoder.geocode(`${city} ${state}`);

        if (geo.length > 0) {
          location = {
            lat: geo[0].latitude,
            lng: geo[0].longitude
          };
        }
      } catch (err) {
        console.log("Geocoder error:", err.message);
      }
    }

    /* ---------- IMAGE UPLOAD ---------- */

    let imageUrl = "";

    if (image) {

      const uploadResponse = await cloudinary.uploader.upload(image, {
        folder: "complaints"
      });

      imageUrl = uploadResponse.secure_url;

    }

    /* ---------- AI IMAGE VERIFICATION ---------- */

    if (imageUrl) {
      try {
        const apiKey = process.env.OPENAI_API_KEY;
        if (apiKey) {
          const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
              model: "gpt-4o",
              messages: [{
                role: "user",
                content: [
                  { type: "text", text: "Is this image a real photograph of a civic issue (like a pothole, garbage, water leak, or broken infrastructure)? Answer strictly with 'YES' or 'NO'." },
                  { type: "image_url", image_url: { url: imageUrl } }
                ]
              }],
              max_tokens: 10
            })
          });

          const aiData = await aiResponse.json();
          if (aiData.choices && aiData.choices.length > 0) {
            const aiText = aiData.choices[0].message.content.toUpperCase();
            if (aiText.includes("NO")) {
              return res.status(400).json({ message: "Image rejected. AI detected this is not a valid civic issue." });
            }
          }
        } else {
          console.log("⚠️ OPENAI_API_KEY is missing. Skipping AI Verification.");
        }
      } catch (aiErr) {
        console.error("AI Verification failed:", aiErr);
      }
    }

    /* ---------- CATEGORY DETECTION ---------- */

    let category = "General";
    let priority = "Low";

    const text = description.toLowerCase();

    if (text.includes("pothole") || text.includes("road")) {
      category = "Road Issue";
      priority = "High";
    }
    else if (text.includes("garbage") || text.includes("waste")) {
      category = "Sanitation";
      priority = "Medium";
    }
    else if (text.includes("water") || text.includes("leak")) {
      category = "Water Supply";
      priority = "High";
    }
    else if (text.includes("light") || text.includes("electric")) {
      category = "Electricity";
      priority = "Medium";
    }

    /* ---------- CREATE COMPLAINT ---------- */

    const newComplaint = await Complaint.create({
      user: req.user._id,
      city,
      state,
      address,
      description,
      category,
      priority,
      image: imageUrl,
      location
    });

    res.status(201).json({
      message: "Complaint submitted successfully",
      complaint: newComplaint
    });

  } catch (error) {

    console.error("Error creating complaint:", error);

    res.status(500).json({
      message: "Server error while submitting complaint"
    });

  }
};

/* ---------- GET ALL COMPLAINTS ---------- */

export const getAllComplaints = async (req, res) => {

  try {

    const complaints = await Complaint
      .find()
      .populate("user", "email")
      .populate("comments.user", "fullName email");

    res.json(complaints);

  } catch (err) {

    console.error("GET ALL COMPLAINTS ERROR:", err);
    res.status(500).json({
      message: `Backend Crash: ${err.message}`
    });

  }

};

/* ---------- GET MY COMPLAINTS ---------- */

export const getMyComplaints = async (req, res) => {

  try {

    const complaints = await Complaint.find({
      user: req.user._id
    });

    res.json(complaints);

  } catch (err) {

    console.error("GET MY COMPLAINTS ERROR:", err);
    res.status(500).json({
      message: `Backend Crash: ${err.message}`
    });

  }

};

/* ---------- UPDATE STATUS ---------- */

export const updateComplaintStatus = async (req, res) => {

  try {

    const { status } = req.body;

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json(complaint);

  } catch (err) {

    res.status(500).json({
      message: "Failed to update complaint"
    });

  }

};

/* ---------- UPVOTE COMPLAINT ---------- */

export const upvoteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { $inc: { upvotes: 1 } },
      { new: true }
    );

    res.json({ message: "Upvoted successfully", complaint });
  } catch (err) {
    console.error("Upvote error:", err);
    res.status(500).json({
      message: "Failed to upvote complaint"
    });
  }
};

/* ---------- ADD COMMENT ---------- */

export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const complaintId = req.params.id;

    if (!text) {
      return res.status(400).json({ message: "Comment text is required." });
    }

    // Fallback dummy ID to act as a "showpiece" if Auth isn't strictly implemented
    const dummyUserId = req.user ? req.user._id : "000000000000000000000000";

    // Force push the comment via findByIdAndUpdate to bypass schema validation hurdles
    const updatedComplaint = await Complaint.findByIdAndUpdate(
      complaintId,
      { $push: { comments: { user: dummyUserId, text: text, createdAt: new Date() } } },
      { new: true }
    ).populate("comments.user", "fullName email");

    if (!updatedComplaint) {
      return res.status(404).json({ message: "Complaint not found." });
    }

    res.status(201).json({ message: "Comment added", complaint: updatedComplaint });
  } catch (err) {
    console.error("Add comment error:", err);
    res.status(500).json({ message: "Failed to add comment" });
  }
};