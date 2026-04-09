import dotenv from "dotenv";
dotenv.config(); // ✅ MUST BE FIRST

import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

import { connectDB } from "./config/db.js";
import complaintRouter from "./routes/complaintRoutes.js";
import userRouter from "./routes/userRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

/* ---------- MIDDLEWARE ---------- */

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));

/* ---------- STATIC FOLDER FOR MULTER ---------- */

app.use("/uploads", express.static("uploads"));

/* ---------- ROUTES ---------- */

app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.use("/api/auth", userRouter);
app.use("/api/complaint", complaintRouter);

/* ---------- DATABASE ---------- */

await connectDB();

/* ---------- SERVER START ---------- */

app.listen(PORT, () => {
  console.log(`server is running on PORT: ${PORT}`);
});