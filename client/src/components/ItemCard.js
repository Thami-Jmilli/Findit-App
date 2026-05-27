import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import config from "./config";
import { StatusBadge, TypeBadge, formatDate, Spinner } from "../utils/helpers";

export default function ItemCard({ item, onDelete, onStatusChange, isAdmin }) {

  const [claimForm, setClaimForm] = useState({ name:"", mobile:"", hostel:"", proof:"" });
  const [helperForm, setHelperForm] = useState({ name:"", mobile:"", hostel:"" });
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleHelp = async () => {
    if (!helperForm.name || !helperForm.mobile || !helperForm.hostel) { toast.error("Please fill all fields"); return; }
    setLoading(true);
    try {
      await axios.post(`${config.baseURL}/helper`, {
        helpername: helperForm.name, mobilenumber: helperForm.mobile,
        hostelname: helperForm.hostel, itemdetails: `${item.itemname} — ${item.itemdescription}`,
      });
      toast.success("Thank you for helping! The item will be marked as being handled.");
      setShowModal(false);
    } catch { toast.error("Failed to submit. Try again."); }
    finally { setLoading(false); }
  };

  const handleClaim = async () => {
    if (!claimForm.name || !claimForm.mobile || !claimForm.hostel || !claimForm.proof) {
      toast.error("Please fill all fields including proof of claim"); return;
    }
    setLoading(true);
    try {
      await axios.post(`${config.baseURL}/claimant`, {
        claimantname: claimForm.name, mobilenumber: claimForm.mobile,
        hostelname: claimForm.hostel, proofofclaim: claimForm.proof,
        itemdetails: `${item.itemname} — ${item.itemdescription}`,
      });
      toast.success("Claim submitted! An admin will review it shortly.");
      setShowModal(false);
    } catch { toast.error("Failed to submit. Try again."); }
    finally { setLoading(false); }
  };

  const handleAdminStatus = async (status) => {
    try {
      await axios.put(`${config.baseURL}/item/status/${item.id || item._id}`, { status }, { withCredentials: true });
      toast.success(`Status updated to ${status}`);
      onStatusChange?.();
    } catch { toast.error("Failed to update status"); }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${item.itemname}"? This cannot be undone.`)) return;
    try {
      await axios.delete(`${config.baseURL}/item/${item.id || item._id}`, { withCredentials: true });
      toast.success("Item deleted");
      onDelete?.();
    } catch { toast.error("Failed to delete"); }
  };

  return (
    <>
      <div className="card p-5 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <TypeBadge type={item.concerntype} />
            <StatusBadge status={item.status} />
            {item.category && item.category !== "Other" && (
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{item.category}</span>
            )}
          </div>
          <span className="text-xs text-slate-400 shrink-0">{formatDate(item.date)}</span>
        </div>

        <h3 className="font-bold text-slate-900 mb-1 text-base">{item.itemname}</h3>
        <p className="text-sm text-slate-500 line-clamp-2 mb-3">{item.itemdescription}</p>

        {item.location && (
          <p className="text-xs text-slate-400 mb-3">📍 {item.location}</p>
        )}

        {item.images?.length > 0 && (
          <div className="flex gap-2 mb-3 flex-wrap">
            {item.images.slice(0,2).map((img,i) => (
              <img key={i} src={img} alt={`img-${i}`} className="w-16 h-16 object-cover rounded-xl border border-slate-200" />
            ))}
            {item.images.length > 2 && (
              <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center text-xs text-slate-500 font-semibold border border-slate-200">
                +{item.images.length - 2}
              </div>
            )}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100">
          {isAdmin ? (
            <>
              <select className="input text-xs py-1.5 w-auto" defaultValue={item.status}
                onChange={e => handleAdminStatus(e.target.value)}>
                {["pending","approved","matched","rejected","returned"].map(s => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>
                ))}
              </select>
              <button onClick={handleDelete} className="btn-danger text-xs px-3 py-1.5">🗑 Delete</button>
            </>
          ) : (
            item.concerntype === "lost" ? (
              <button onClick={() => setShowModal(true)} className="btn-primary text-xs px-3 py-1.5">🤝 I Can Help</button>
            ) : (
              <button onClick={() => setShowModal(true)} className="btn-primary text-xs px-3 py-1.5">✋ This is Mine</button>
            )
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="card w-full max-w-md p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900">
                {item.concerntype === "lost" ? "Offer to Help" : "Claim this Item"}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 text-xl leading-none">✕</button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="label">Your Name</label>
                <input className="input" placeholder="Full name"
                  onChange={e => item.concerntype === "lost"
                    ? setHelperForm({...helperForm, name: e.target.value})
                    : setClaimForm({...claimForm, name: e.target.value})} />
              </div>
              <div>
                <label className="label">Mobile Number</label>
                <input className="input" placeholder="+27 xx xxx xxxx"
                  onChange={e => item.concerntype === "lost"
                    ? setHelperForm({...helperForm, mobile: e.target.value})
                    : setClaimForm({...claimForm, mobile: e.target.value})} />
              </div>
              <div>
                <label className="label">Hostel / Location</label>
                <input className="input" placeholder="e.g. Block C"
                  onChange={e => item.concerntype === "lost"
                    ? setHelperForm({...helperForm, hostel: e.target.value})
                    : setClaimForm({...claimForm, hostel: e.target.value})} />
              </div>
              {item.concerntype === "found" && (
                <div>
                  <label className="label">Proof of Ownership</label>
                  <input className="input" placeholder="Describe proof (receipt, serial no., etc.)"
                    onChange={e => setClaimForm({...claimForm, proof: e.target.value})} />
                </div>
              )}
              <button disabled={loading} onClick={item.concerntype === "lost" ? handleHelp : handleClaim}
                className="btn-primary w-full justify-center mt-2">
                {loading ? <Spinner sm /> : item.concerntype === "lost" ? "Submit Help" : "Submit Claim"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
