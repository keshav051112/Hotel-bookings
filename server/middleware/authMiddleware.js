import User from "../models/user.js";

// Middleware to check user is authenticated
export const protect = async (req, res, next) => {
  try {
    const { userId } =  await req.auth(); // Clerk injects this in request
    

    if (!userId) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: "Authentication failed", error: error.message });
  }
};
