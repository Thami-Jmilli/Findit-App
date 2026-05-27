const jwt      = require("jsonwebtoken");
const supabase = require("../config/supabase");

const requireAuth = async (req, res, next) => {
  try {
    const token = req.cookies.Authorization;
    if (!token) return res.status(401).json({ success: false, message: "No token provided" });

    const decoded = jwt.verify(token, process.env.SECRETKEY);

    if (Date.now() > decoded.expirationTime) {
      return res.status(401).json({ success: false, message: "Token expired" });
    }

    // Fetch user from Supabase instead of MongoDB
    const { data: user, error } = await supabase
      .from("users")
      .select("id, username, rollno, email, role, created_at")
      .eq("id", decoded.sub)
      .single();

    if (error || !user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("requireAuth error:", error.message);
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
};

module.exports = requireAuth;
