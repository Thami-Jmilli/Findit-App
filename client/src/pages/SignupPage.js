import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import config from "../components/config";
import Navbar from "../components/Navbar";
import { Spinner } from "../utils/helpers";

export default function SignupPage() {
  const [form, setForm] = useState({ username:"", rollno:"", email:"", password:"", confirm:"" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast.error("Passwords do not match"); return; }
    if (form.password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    setLoading(true);
    try {
      await axios.post(`${config.baseURL}/signup`, {
        username: form.username, rollno: form.rollno, email: form.email, password: form.password,
      });
      toast.success("Account created! Please sign in.");
      navigate("/sign-in");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const f = (k) => ({ value: form[k], onChange: e => setForm({...form, [k]: e.target.value }) });

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
              <span className="text-white font-extrabold text-lg">F</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900">Create an account</h1>
            <p className="text-slate-500 text-sm mt-1">Join FindIt — free forever</p>
          </div>

          <div className="card p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Full name</label>
                <input className="input" required placeholder="John Doe" {...f("username")} />
              </div>
              <div>
                <label className="label">Student / Roll No</label>
                <input className="input" required placeholder="e.g. STU2024001" {...f("rollno")} />
              </div>
              <div>
                <label className="label">Email address</label>
                <input className="input" type="email" required placeholder="you@university.ac.za" {...f("email")} />
              </div>
              <div>
                <label className="label">Password</label>
                <input className="input" type="password" required placeholder="Min 6 characters" {...f("password")} />
              </div>
              <div>
                <label className="label">Confirm password</label>
                <input className="input" type="password" required placeholder="Repeat password" {...f("confirm")} />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">
                {loading ? <Spinner sm /> : "Create Account"}
              </button>
            </form>
            <p className="text-center text-sm text-slate-500 mt-6">
              Already have an account?{" "}
              <Link to="/sign-in" className="text-brand-600 font-semibold hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
