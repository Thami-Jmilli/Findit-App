import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { login } from "../utils/userSlice";
import config from "../components/config";
import Navbar from "../components/Navbar";
import { Spinner } from "../utils/helpers";

export default function SigninPage() {
  const [form, setForm]   = useState({ email:"", password:"" });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${config.baseURL}/login`, form, { withCredentials: true });
      const { token, user } = res.data;
      localStorage.setItem("authToken", token);
      dispatch(login(user));
      toast.success(`Welcome back, ${user.username}!`);
      navigate(user.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
              <span className="text-white font-extrabold text-lg">F</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900">Welcome back</h1>
            <p className="text-slate-500 text-sm mt-1">Sign in to your FindIt account</p>
          </div>

          <div className="card p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="label">Email address</label>
                <input className="input" type="email" required placeholder="you@example.com"
                  value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
              </div>
              <div>
                <label className="label">Password</label>
                <input className="input" type="password" required placeholder="••••••••"
                  value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">
                {loading ? <Spinner sm /> : "Sign In"}
              </button>
            </form>
            <p className="text-center text-sm text-slate-500 mt-6">
              Don't have an account?{" "}
              <Link to="/sign-up" className="text-brand-600 font-semibold hover:underline">Sign up free</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
