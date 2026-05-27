import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import Navbar from "../components/Navbar";
import config from "../components/config";
import { Spinner, StatusBadge, TypeBadge, EmptyState, formatDate } from "../utils/helpers";

function StatCard({ icon, label, value, color }) {
  return (
    <div className={`card p-5 flex items-center gap-4 border-l-4 ${color}`}>
      <span className="text-3xl">{icon}</span>
      <div>
        <p className="text-2xl font-extrabold text-slate-900">{value ?? "—"}</p>
        <p className="text-xs text-slate-500 font-medium">{label}</p>
      </div>
    </div>
  );
}

export default function UserDashboard() {
  const user = useSelector(s => s.user.user);
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [itemsRes, statsRes] = await Promise.all([
          axios.get(`${config.baseURL}/item/user/${user._id}`, { withCredentials: true }),
          axios.get(`${config.baseURL}/stats`, { withCredentials: true }),
        ]);
        setItems(itemsRes.data.gotItems || []);
        setStats(statsRes.data.stats);
      } catch (err) {
        console.error(err);
      } finally { setLoading(false); }
    };
    if (user?._id) load();
  }, [user]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">
              Welcome back, {user?.username} 👋
            </h1>
            <p className="text-slate-500 text-sm mt-1">Here's what's happening with your reports</p>
          </div>
          <Link to="/report" className="btn-primary self-start sm:self-auto">
            ➕ New Report
          </Link>
        </div>

        {/* Global stats */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <StatCard icon="📦" label="Total Reports" value={stats.total}   color="border-brand-500" />
            <StatCard icon="🔴" label="Lost Items"    value={stats.lost}    color="border-orange-400" />
            <StatCard icon="🟢" label="Found Items"   value={stats.found}   color="border-teal-400" />
            <StatCard icon="⏳" label="Pending"       value={stats.pending} color="border-amber-400" />
            <StatCard icon="🔗" label="Matched"       value={stats.matched} color="border-purple-400" />
            <StatCard icon="✅" label="Returned"      value={stats.returned}color="border-green-400" />
          </div>
        )}

        {/* My recent reports */}
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h2 className="font-bold text-slate-800">My Recent Reports</h2>
            <Link to="/my-items" className="text-sm text-brand-600 font-semibold hover:underline">View all</Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-16"><Spinner /></div>
          ) : items.length === 0 ? (
            <EmptyState icon="📋" title="No reports yet"
              desc="You haven't submitted any lost or found reports."
              action={<Link to="/report" className="btn-primary">Submit your first report</Link>} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    {["Item","Type","Status","Date",""].map(h => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.slice(0,5).map(item => (
                    <tr key={item._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-slate-800">{item.itemname}</td>
                      <td className="px-6 py-4"><TypeBadge type={item.concerntype} /></td>
                      <td className="px-6 py-4"><StatusBadge status={item.status} /></td>
                      <td className="px-6 py-4 text-slate-500">{formatDate(item.date)}</td>
                      <td className="px-6 py-4 text-right">
                        <Link to="/my-items" className="text-brand-600 text-xs font-semibold hover:underline">Details</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
