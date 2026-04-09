import express from "express";
import multer from "multer";

import {
  addComment,
  createComplaint,
  getAllComplaints,
  getMyComplaints,
  updateComplaintStatus,
  upvoteComplaint
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

router.put(
  "/:id/upvote",
  protectRoute,
  upvoteComplaint
);

router.post(
  "/:id/comment",
  protectRoute,
  addComment
);

export default router;