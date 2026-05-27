import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 text-white">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6 backdrop-blur-sm">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Campus & Community Lost and Found
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              Reunite People<br />
              <span className="text-brand-300">With What Matters</span>
            </h1>
            <p className="text-lg text-brand-100 max-w-xl mb-10">
              Report lost or found items, and let our community bring them back together. Simple, fast, and free.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/sign-up" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-brand-700 rounded-xl font-bold hover:bg-brand-50 transition-colors shadow-lg">
                Get Started Free →
              </Link>
              <Link to="/all-items" className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/20 text-white rounded-xl font-bold hover:bg-white/20 transition-colors backdrop-blur-sm">
                Browse Reports
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-slate-50 border-y border-slate-200 py-12">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-3 gap-8 text-center">
          {[["2,400+","Items Reported"],["89%","Items Matched"],["500+","Active Users"]].map(([v,l])=>(
            <div key={l}>
              <p className="text-3xl font-extrabold text-brand-600">{v}</p>
              <p className="text-sm text-slate-500 mt-1">{l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-extrabold text-slate-900 text-center mb-3">How It Works</h2>
        <p className="text-slate-500 text-center mb-12 max-w-xl mx-auto">Three simple steps to get your item back or help someone else.</p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon:"📋", n:"01", title:"Submit a Report", desc:"Describe what you lost or found — category, location, date, and any photos." },
            { icon:"🔍", n:"02", title:"Admins Verify",   desc:"Our team reviews and matches lost and found reports intelligently." },
            { icon:"🎉", n:"03", title:"Get Reunited",    desc:"Once matched, we connect both parties so the item can be returned." },
          ].map((f)=>(
            <div key={f.n} className="card p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{f.icon}</span>
                <span className="text-xs font-mono font-bold text-brand-400 bg-brand-50 px-2 py-1 rounded-lg">{f.n}</span>
              </div>
              <h3 className="font-bold text-slate-900 mb-2">{f.title}</h3>
              <p className="text-sm text-slate-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-600 py-16 text-center text-white">
        <h2 className="text-3xl font-extrabold mb-3">Lost something? Found something?</h2>
        <p className="text-brand-100 mb-8 max-w-md mx-auto">Join your community and help reconnect people with their lost belongings.</p>
        <Link to="/sign-up" className="inline-flex items-center gap-2 px-8 py-3 bg-white text-brand-700 font-bold rounded-xl hover:bg-brand-50 transition-colors shadow-lg">
          Create a Free Account →
        </Link>
      </section>

      <footer className="text-center py-8 text-sm text-slate-400">
        © {new Date().getFullYear()} FindIt. A community lost & found platform.
      </footer>
    </div>
  );
}
