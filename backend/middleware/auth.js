import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

export const authMiddleware = async(req, res, next) => {
  try {
    const token = req.headers.token||req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET,role);
    const user=await userModel.findById(decoded.id);
if(!user) return res.status(401).json({message:"unauthorised, user not found"})
    req.user = user; // ✅ This line is essential

    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

function isAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Access denied: Admins only" });
  }
  next();
}

