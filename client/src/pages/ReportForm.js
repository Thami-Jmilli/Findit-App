import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import config from "../components/config";
import { Spinner, CATEGORIES } from "../utils/helpers";

export default function ReportForm() {
  const user = useSelector(s => s.user.user);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [form, setForm] = useState({
    itemname: "", itemdescription: "", concerntype: "lost", category: "Other", location: "",
  });

  const f = (k) => ({ value: form[k], onChange: e => setForm({...form, [k]: e.target.value}) });

  const convertToBase64 = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 3) { toast.error("Max 3 images allowed"); return; }
    files.forEach(file => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => setImages(prev => [...prev, reader.result]);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.itemname.trim() || !form.itemdescription.trim()) {
      toast.error("Please fill in all required fields"); return;
    }
    setLoading(true);
    try {
      await axios.post(`${config.baseURL}/item/${user._id}`, { ...form, images });
      toast.success("Report submitted successfully!");
      navigate("/my-items");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit report");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-slate-900">Submit a Report</h1>
          <p className="text-slate-500 text-sm mt-1">Report a lost or found item in your area</p>
        </div>

        <div className="card p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Type toggle */}
            <div>
              <label className="label">Report Type *</label>
              <div className="flex gap-3">
                {[["lost","🔴"],["found","🟢"]].map(([t, ico]) => (
                  <label key={t} className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all ${
                    form.concerntype === t
                      ? t === "lost" ? "border-orange-400 bg-orange-50 text-orange-700" : "border-teal-400 bg-teal-50 text-teal-700"
                      : "border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}>
                    <input type="radio" className="sr-only" value={t} checked={form.concerntype===t}
                      onChange={() => setForm({...form, concerntype: t})} />
                    <span>{ico}</span>
                    <span className="font-semibold capitalize">{t} Item</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="label">Item Name *</label>
              <input className="input" required placeholder="e.g. Blue Nike backpack" {...f("itemname")} />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Category</label>
                <select className="input" {...f("category")}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Location</label>
                <input className="input" placeholder="e.g. Main Library" {...f("location")} />
              </div>
            </div>

            <div>
              <label className="label">Description *</label>
              <textarea className="input resize-none h-28" required
                placeholder="Describe the item — color, brand, distinguishing features…"
                {...f("itemdescription")} />
            </div>

            <div>
              <label className="label">Photos (max 3)</label>
              <input type="file" accept="image/*" multiple onChange={convertToBase64}
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100" />
              {images.length > 0 && (
                <div className="flex gap-2 mt-3 flex-wrap">
                  {images.map((img, i) => (
                    <div key={i} className="relative">
                      <img src={img} alt={`preview-${i}`} className="w-20 h-20 object-cover rounded-xl border border-slate-200" />
                      <button type="button" onClick={() => setImages(images.filter((_,j)=>j!==i))}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600">✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center py-3">
                {loading ? <Spinner sm /> : "Submit Report"}
              </button>
              <button type="button" onClick={() => navigate(-1)} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
