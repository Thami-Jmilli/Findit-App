import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import config from "../components/config";
import { Spinner, EmptyState, formatDate } from "../utils/helpers";

export default function HelpersPage() {
  const [helpers, setHelpers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${config.baseURL}/helper`, { withCredentials: true })
      .then(r => setHelpers(r.data.gotHelper || []))
      .catch(() => setHelpers([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-extrabold text-slate-900 mb-6">Helper Records</h1>
        {loading ? <div className="flex justify-center py-20"><Spinner /></div>
        : helpers.length === 0 ? <EmptyState icon="🤝" title="No helpers yet" />
        : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    {["#","Name","Mobile","Hostel","Item","Date"].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {helpers.map((h,i) => (
                    <tr key={h._id} className="hover:bg-slate-50">
                      <td className="px-5 py-3 text-slate-400">{i+1}</td>
                      <td className="px-5 py-3 font-semibold text-slate-800">{h.helpername}</td>
                      <td className="px-5 py-3 text-slate-600">{h.mobilenumber}</td>
                      <td className="px-5 py-3 text-slate-600">{h.hostelname}</td>
                      <td className="px-5 py-3 text-slate-500 max-w-xs truncate">{h.itemdetails}</td>
                      <td className="px-5 py-3 text-slate-400">{formatDate(h.date)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
