import cloudinary from "../config/cloudinary.js";
import geocoder from "../config/geocoder.js";
import Complaint from "../models/Complaint.js";

export const createComplaint = async (req, res) => {
  try {

    const { city, state, address, description, image } = req.body;

    if (!city || !state || !address || !description) {
      return res.status(400).json({
        message: "City, state, address and description are required."
      });
    }

    /* ---------- GEOCODING ---------- */

    let location = { lat: 0, lng: 0 };

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

    /* ---------- IMAGE UPLOAD ---------- */

    let imageUrl = "";

    if (image) {

      const uploadResponse = await cloudinary.uploader.upload(image, {
        folder: "complaints"
      });

      imageUrl = uploadResponse.secure_url;

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
      .populate("user", "email");

    res.json(complaints);

  } catch (err) {

    res.status(500).json({
      message: "Failed to fetch complaints"
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

    res.status(500).json({
      message: "Failed to fetch complaints"
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