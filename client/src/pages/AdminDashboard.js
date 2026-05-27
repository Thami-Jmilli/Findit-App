import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import ItemCard from "../components/ItemCard";
import config from "../components/config";
import { Spinner, EmptyState, StatusBadge, TypeBadge, formatDate } from "../utils/helpers";

function StatCard({ icon, label, value, bg }) {
  return (
    <div className={`card p-5 ${bg}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        <span className="text-3xl font-extrabold text-slate-900">{value ?? "—"}</span>
      </div>
      <p className="text-sm font-semibold text-slate-600">{label}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const [tab, setTab] = useState("items");
  const [items, setItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [claimants, setClaimants] = useState([]);
  const [helpers, setHelpers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ type: "", status: "" });

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter.type)   params.type   = filter.type;
      if (filter.status) params.status = filter.status;
      const [itemsRes, statsRes, usersRes, claimantsRes, helpersRes] = await Promise.all([
        axios.get(`${config.baseURL}/item`, { params, withCredentials: true }),
        axios.get(`${config.baseURL}/stats`, { withCredentials: true }),
        axios.get(`${config.baseURL}/admin/users`, { withCredentials: true }),
        axios.get(`${config.baseURL}/claimant`, { withCredentials: true }),
        axios.get(`${config.baseURL}/helper`, { withCredentials: true }),
      ]);
      setItems(itemsRes.data.gotItem || []);
      setStats(statsRes.data.stats);
      setUsers(usersRes.data.users || []);
      setClaimants(claimantsRes.data.gotClaimant || []);
      setHelpers(helpersRes.data.gotHelper || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [filter]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const deleteClaimant = async (id) => {
    if (!window.confirm("Delete this claimant record?")) return;
    try { await axios.delete(`${config.baseURL}/claimant/${id}`, { withCredentials: true });
      setClaimants(claimants.filter(c => c._id !== id));
    } catch {}
  };
  const deleteHelper = async (id) => {
    if (!window.confirm("Delete this helper record?")) return;
    try { await axios.delete(`${config.baseURL}/helper/${id}`, { withCredentials: true });
      setHelpers(helpers.filter(h => h._id !== id));
    } catch {}
  };

  const Tab = ({ id, label, count }) => (
    <button onClick={() => setTab(id)}
      className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
        tab === id ? "bg-brand-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
      }`}>
      {label} {count != null && <span className={`ml-1 text-xs px-1.5 py-0.5 rounded-full ${tab===id ? "bg-white/20" : "bg-slate-200"}`}>{count}</span>}
    </button>
  );

  const FilterBtn = ({ label, active, onClick }) => (
    <button onClick={onClick} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
      active ? "bg-brand-600 text-white" : "bg-white text-slate-600 border border-slate-200 hover:border-brand-300"}`}>
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Full control over all reports and users</p>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <StatCard icon="📦" label="Total" value={stats.total}   bg="border-t-4 border-brand-500" />
            <StatCard icon="🔴" label="Lost"  value={stats.lost}    bg="border-t-4 border-orange-400" />
            <StatCard icon="🟢" label="Found" value={stats.found}   bg="border-t-4 border-teal-400" />
            <StatCard icon="⏳" label="Pending" value={stats.pending} bg="border-t-4 border-amber-400" />
            <StatCard icon="🔗" label="Matched" value={stats.matched} bg="border-t-4 border-purple-400" />
            <StatCard icon="✅" label="Returned" value={stats.returned} bg="border-t-4 border-green-400" />
          </div>
        )}

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Tab id="items"    label="All Reports"  count={items.length} />
          <Tab id="users"    label="Users"        count={users.length} />
          <Tab id="claimants" label="Claimants"  count={claimants.length} />
          <Tab id="helpers"  label="Helpers"      count={helpers.length} />
        </div>

        {/* Items tab filters */}
        {tab === "items" && (
          <div className="flex flex-wrap gap-2 mb-4">
            <FilterBtn label="All Types" active={!filter.type} onClick={() => setFilter({...filter, type: ""})} />
            <FilterBtn label="🔴 Lost"  active={filter.type==="lost"}  onClick={() => setFilter({...filter, type: "lost"})} />
            <FilterBtn label="🟢 Found" active={filter.type==="found"} onClick={() => setFilter({...filter, type: "found"})} />
            <div className="w-px bg-slate-200 mx-1" />
            {["","pending","approved","matched","rejected","returned"].map(s => (
              <FilterBtn key={s||"all"} label={s ? s.charAt(0).toUpperCase()+s.slice(1) : "All Status"}
                active={filter.status===s} onClick={() => setFilter({...filter, status: s})} />
            ))}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20"><Spinner /></div>
        ) : (
          <>
            {/* Items grid */}
            {tab === "items" && (
              items.length === 0 ? <EmptyState icon="📭" title="No reports" /> : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {items.map(item => (
                    <ItemCard key={item._id} item={item} isAdmin onDelete={fetchAll} onStatusChange={fetchAll} />
                  ))}
                </div>
              )
            )}

            {/* Users table */}
            {tab === "users" && (
              <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        {["#","Name","Roll No","Email","Role","Joined"].map(h => (
                          <th key={h} className="px-5 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wide">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {users.map((u,i) => (
                        <tr key={u._id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-5 py-3 text-slate-400">{i+1}</td>
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 bg-brand-100 rounded-full flex items-center justify-center text-xs font-bold text-brand-700">
                                {u.username?.[0]?.toUpperCase()}
                              </div>
                              <span className="font-semibold text-slate-800">{u.username}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3 font-mono text-slate-600 text-xs">{u.rollno}</td>
                          <td className="px-5 py-3 text-slate-600">{u.email}</td>
                          <td className="px-5 py-3">
                            <span className={`badge-${u.role === "admin" ? "approved" : "pending"}`}>{u.role}</span>
                          </td>
                          <td className="px-5 py-3 text-slate-500">{formatDate(u.date)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Claimants */}
            {tab === "claimants" && (
              claimants.length === 0 ? <EmptyState icon="🙋" title="No claimants yet" /> : (
                <div className="card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                          {["Name","Mobile","Hostel","Proof","Item","Date",""].map(h => (
                            <th key={h} className="px-5 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wide">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {claimants.map(c => (
                          <tr key={c._id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-5 py-3 font-semibold text-slate-800">{c.claimantname}</td>
                            <td className="px-5 py-3 text-slate-600">{c.mobilenumber}</td>
                            <td className="px-5 py-3 text-slate-600">{c.hostelname}</td>
                            <td className="px-5 py-3 text-slate-500 max-w-xs truncate">{c.proofofclaim}</td>
                            <td className="px-5 py-3 text-slate-500 max-w-xs truncate">{c.itemdetails}</td>
                            <td className="px-5 py-3 text-slate-400">{formatDate(c.date)}</td>
                            <td className="px-5 py-3">
                              <button onClick={() => deleteClaimant(c._id)} className="text-red-500 hover:text-red-700 text-xs font-semibold">Delete</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )
            )}

            {/* Helpers */}
            {tab === "helpers" && (
              helpers.length === 0 ? <EmptyState icon="🤝" title="No helpers yet" /> : (
                <div className="card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                          {["Name","Mobile","Hostel","Item","Date",""].map(h => (
                            <th key={h} className="px-5 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wide">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {helpers.map(h => (
                          <tr key={h._id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-5 py-3 font-semibold text-slate-800">{h.helpername}</td>
                            <td className="px-5 py-3 text-slate-600">{h.mobilenumber}</td>
                            <td className="px-5 py-3 text-slate-600">{h.hostelname}</td>
                            <td className="px-5 py-3 text-slate-500 max-w-xs truncate">{h.itemdetails}</td>
                            <td className="px-5 py-3 text-slate-400">{formatDate(h.date)}</td>
                            <td className="px-5 py-3">
                              <button onClick={() => deleteHelper(h._id)} className="text-red-500 hover:text-red-700 text-xs font-semibold">Delete</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )
            )}
          </>
        )}
      </div>
    </div>
  );
}
