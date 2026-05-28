const jwt = require("jsonwebtoken");
const supabase = require("../config/supabase");

const requireAuth = async (req, res, next) => {
  try {
    // Get token from cookie
    const token = req.cookies.Authorization;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token found",
      });
    }

    // VERIFY TOKEN
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // FIND USER
    const { data: user, error } = await supabase
      .from("users")
      .select("id, username, rollno, email, role")
      .eq("id", decoded.id)
      .single();

    if (error || !user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // Save user to request
    req.user = user;

    next();
  } catch (error) {
    console.log("AUTH ERROR:", error);

    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
};

module.exports = requireAuth;