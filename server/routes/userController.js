const bcrypt   = require("bcryptjs");
const jwt      = require("jsonwebtoken");
const supabase = require("../config/supabase");

// ── SIGNUP ────────────────────────────────────────────────────────────────────
const signup = async (req, res) => {
  try {
    const { username, rollno, email, password } = req.body;

    // Check if email or rollno already exists
    const { data: existing } = await supabase
      .from("users")
      .select("id")
      .or(`email.eq.${email},rollno.eq.${rollno}`)
      .maybeSingle();

    if (existing) {
      return res.status(409).json({ success: false, message: "Email or Roll No already registered" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const { data: user, error } = await supabase
      .from("users")
      .insert({ username, rollno, email, password: hashedPassword, role: "user" })
      .select("id, username, email, role")
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      user: { _id: user.id, username: user.username, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("Signup error:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ── LOGIN ─────────────────────────────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data: user, error } = await supabase
      .from("users")
      .select("id, username, email, role, password")
      .eq("email", email)
      .single();

    if (error || !user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const passwordMatch = bcrypt.compareSync(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const expirationTime = Date.now() + 1000 * 60 * 60 * 24 * 30;
    const token = jwt.sign(
      { sub: user.id, role: user.role, expirationTime },
      process.env.SECRETKEY
    );

    res.cookie("Authorization", token, {
      expires: new Date(expirationTime),
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    res.json({
      success: true,
      token,
      user: { _id: user.id, username: user.username, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ── LOGOUT ────────────────────────────────────────────────────────────────────
const logout = (req, res) => {
  res.clearCookie("Authorization");
  res.json({ success: true });
};

// ── FETCH SINGLE USER ─────────────────────────────────────────────────────────
const fetchUser = async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("id, username, rollno, email, role, created_at")
      .eq("id", req.params.id)
      .single();

    if (error || !user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ── FETCH ALL USERS (admin) ───────────────────────────────────────────────────
const fetchAllUsers = async (req, res) => {
  try {
    const { data: users, error } = await supabase
      .from("users")
      .select("id, username, rollno, email, role, created_at")
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ── CHECK AUTH ────────────────────────────────────────────────────────────────
const checkAuth = (req, res) => {
  const u = req.user;
  res.json({
    success: true,
    user: { _id: u.id, username: u.username, email: u.email, role: u.role },
  });
};

module.exports = { signup, login, logout, fetchUser, fetchAllUsers, checkAuth };
