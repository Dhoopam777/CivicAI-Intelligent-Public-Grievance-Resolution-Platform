import express from "express";
import multer from "multer";

import {
    createComplaint,
    getAllComplaints,
    getMyComplaints,
    updateComplaintStatus
} from "../controllers/complaintController.js";

import { protectRoute } from "../middleware/auth.js";

const router = express.Router();

/* -------- MULTER CONFIG -------- */

const upload = multer({
  dest: "uploads/"
});

/* -------- ROUTES -------- */

router.post(
  "/",
  protectRoute,
  upload.single("image"),
  createComplaint
);

router.get(
  "/",
  protectRoute,
  getAllComplaints
);

router.get(
  "/my",
  protectRoute,
  getMyComplaints
);

router.put(
  "/:id",
  protectRoute,
  updateComplaintStatus
);

export default router;