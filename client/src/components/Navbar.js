import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectUser } from "../utils/userSlice";
import axios from "axios";
import config from "./config";
import toast from "react-hot-toast";

export default function Navbar() {
  const user     = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen]   = useState(false);

  const isActive = (p) => location.pathname === p;

  const handleLogout = async () => {
    try { await axios.get(`${config.baseURL}/logout`, { withCredentials: true }); } catch {}
    dispatch(logout());
    localStorage.removeItem("authToken");
    toast.success("Signed out successfully");
    navigate("/");
    setOpen(false);
  };

  const NavLink = ({ to, children }) => (
    <Link to={to} onClick={() => setOpen(false)}
      className={`text-sm font-semibold px-3 py-2 rounded-lg transition-colors ${
        isActive(to) ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
      }`}>
      {children}
    </Link>
  );

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <span className="font-extrabold text-slate-900 text-lg">FindIt</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/">Home</NavLink>
            {user && (
              <>
                <NavLink to="/dashboard">Dashboard</NavLink>
                <NavLink to="/my-items">My Reports</NavLink>
                <NavLink to="/all-items">Browse</NavLink>
                <NavLink to="/report">+ Report</NavLink>
                {user.role === "admin" && <NavLink to="/admin">Admin</NavLink>}
              </>
            )}
          </div>

          {/* Desktop auth */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center">
                    <span className="text-brand-700 font-bold text-xs">{user.username?.[0]?.toUpperCase()}</span>
                  </div>
                  <div className="hidden lg:block">
                    <p className="text-xs font-semibold text-slate-800 leading-none">{user.username}</p>
                    <p className="text-xs text-slate-400">{user.role}</p>
                  </div>
                </div>
                <button onClick={handleLogout} className="btn-ghost text-red-600 hover:bg-red-50">Sign Out</button>
              </div>
            ) : (
              <>
                <Link to="/sign-in" className="btn-ghost">Sign In</Link>
                <Link to="/sign-up" className="btn-primary">Get Started</Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {open
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 py-3 space-y-1">
          <NavLink to="/">Home</NavLink>
          {user && (
            <>
              <NavLink to="/dashboard">Dashboard</NavLink>
              <NavLink to="/my-items">My Reports</NavLink>
              <NavLink to="/all-items">Browse</NavLink>
              <NavLink to="/report">+ New Report</NavLink>
              {user.role === "admin" && <NavLink to="/admin">Admin Panel</NavLink>}
              <button onClick={handleLogout} className="block w-full text-left text-sm font-semibold px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg">
                Sign Out
              </button>
            </>
          )}
          {!user && (
            <>
              <NavLink to="/sign-in">Sign In</NavLink>
              <NavLink to="/sign-up">Sign Up</NavLink>
            </>
          )}
          {user && (
            <div className="flex items-center gap-2 px-3 py-2 border-t border-slate-100 mt-2 pt-2">
              <div className="w-7 h-7 bg-brand-100 rounded-full flex items-center justify-center">
                <span className="text-brand-700 font-bold text-xs">{user.username?.[0]?.toUpperCase()}</span>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-800">{user.username}</p>
                <p className="text-xs text-slate-400 capitalize">{user.role}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
