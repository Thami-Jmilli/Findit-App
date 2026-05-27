import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="flex items-center justify-center px-4 py-24 text-center">
        <div>
          <p className="text-8xl font-black text-brand-100 mb-4">404</p>
          <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Page Not Found</h1>
          <p className="text-slate-500 mb-8">The page you're looking for doesn't exist.</p>
          <Link to="/" className="btn-primary">← Go Home</Link>
        </div>
      </div>
    </div>
  );
}
