const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const supabase = require("../config/supabase");

// ─────────────────────────────────────────────────────────────
// SIGNUP
// ─────────────────────────────────────────────────────────────
const signup = async (req, res) => {
  try {
    const { username, rollno, email, password } = req.body;

    // Check existing user
    const { data: existingUser } = await supabase
      .from("users")
      .select("*")
      .or(`email.eq.${email},rollno.eq.${rollno}`)
      .maybeSingle();

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email or Roll No already exists",
      });
    }

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // CREATE ADMIN ACCOUNT AUTOMATICALLY
    // Change this email to YOUR email
    let role = "user";

    if (email === "admin@findit.com") {
      role = "admin";
    }

    // Insert user
    const { data: user, error } = await supabase
      .from("users")
      .insert([
        {
          username,
          rollno,
          email,
          password: hashedPassword,
          role,
        },
      ])
      .select()
      .single();

    if (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Database error",
      });
    }

    // Create token
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d",
      }
    );

    // IMPORTANT FOR VERCEL + RENDER
    res.cookie("Authorization", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log("Signup error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ─────────────────────────────────────────────────────────────
// LOGIN
// ─────────────────────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (error || !user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Compare password
    const match = bcrypt.compareSync(password, user.password);

    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Create token
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d",
      }
    );

    // IMPORTANT
    res.cookie("Authorization", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log("Login error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ─────────────────────────────────────────────────────────────
// LOGOUT
// ─────────────────────────────────────────────────────────────
const logout = (req, res) => {
  res.clearCookie("Authorization", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  res.json({
    success: true,
    message: "Logged out",
  });
};

// ─────────────────────────────────────────────────────────────
// FETCH USER
// ─────────────────────────────────────────────────────────────
const fetchUser = async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("id, username, rollno, email, role, created_at")
      .eq("id", req.params.id)
      .single();

    if (error || !user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ─────────────────────────────────────────────────────────────
// FETCH ALL USERS
// ─────────────────────────────────────────────────────────────
const fetchAllUsers = async (req, res) => {
  try {
    const { data: users, error } = await supabase
      .from("users")
      .select("id, username, rollno, email, role, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.log(error);

      return res.status(500).json({
        success: false,
        message: "Database error",
      });
    }

    res.json({
      success: true,
      users,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ─────────────────────────────────────────────────────────────
// CHECK AUTH
// ─────────────────────────────────────────────────────────────
const checkAuth = (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
};

module.exports = {
  signup,
  login,
  logout,
  fetchUser,
  fetchAllUsers,
  checkAuth,
};