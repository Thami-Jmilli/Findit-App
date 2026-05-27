import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import config from "../components/config";
import { Spinner, EmptyState, formatDate } from "../utils/helpers";

export default function ClaimantsPage() {
  const [claimants, setClaimants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${config.baseURL}/claimant`, { withCredentials: true })
      .then(r => setClaimants(r.data.gotClaimant || []))
      .catch(() => setClaimants([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-extrabold text-slate-900 mb-6">Claimant Records</h1>
        {loading ? <div className="flex justify-center py-20"><Spinner /></div>
        : claimants.length === 0 ? <EmptyState icon="🙋" title="No claimants yet" />
        : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    {["#","Name","Mobile","Hostel","Proof","Item","Date"].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {claimants.map((c,i) => (
                    <tr key={c._id} className="hover:bg-slate-50">
                      <td className="px-5 py-3 text-slate-400">{i+1}</td>
                      <td className="px-5 py-3 font-semibold text-slate-800">{c.claimantname}</td>
                      <td className="px-5 py-3 text-slate-600">{c.mobilenumber}</td>
                      <td className="px-5 py-3 text-slate-600">{c.hostelname}</td>
                      <td className="px-5 py-3 text-slate-500 max-w-xs truncate">{c.proofofclaim}</td>
                      <td className="px-5 py-3 text-slate-500 max-w-xs truncate">{c.itemdetails}</td>
                      <td className="px-5 py-3 text-slate-400">{formatDate(c.date)}</td>
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
