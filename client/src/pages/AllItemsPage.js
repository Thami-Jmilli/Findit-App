import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import ItemCard from "../components/ItemCard";
import config from "../components/config";
import { Spinner, EmptyState } from "../utils/helpers";

export default function AllItemsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ type: "", status: "" });

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter.type)   params.type   = filter.type;
      if (filter.status) params.status = filter.status;
      const res = await axios.get(`${config.baseURL}/item`, { params });
      setItems(res.data.gotItem || []);
    } catch { setItems([]); }
    finally { setLoading(false); }
  }, [filter]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const FilterBtn = ({ label, active, onClick }) => (
    <button onClick={onClick}
      className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
        active ? "bg-brand-600 text-white shadow-sm" : "bg-white text-slate-600 border border-slate-200 hover:border-brand-300"
      }`}>
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-slate-900">Browse Reports</h1>
          <p className="text-slate-500 text-sm mt-1">{items.length} report{items.length !== 1 ? "s" : ""} found</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <FilterBtn label="All Types" active={!filter.type} onClick={() => setFilter({...filter, type: ""})} />
          <FilterBtn label="🔴 Lost" active={filter.type==="lost"} onClick={() => setFilter({...filter, type: "lost"})} />
          <FilterBtn label="🟢 Found" active={filter.type==="found"} onClick={() => setFilter({...filter, type: "found"})} />
          <div className="w-px bg-slate-200 mx-1" />
          <FilterBtn label="All Status" active={!filter.status} onClick={() => setFilter({...filter, status: ""})} />
          {["pending","approved","matched","returned"].map(s => (
            <FilterBtn key={s} label={s.charAt(0).toUpperCase()+s.slice(1)}
              active={filter.status===s} onClick={() => setFilter({...filter, status: s})} />
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Spinner /></div>
        ) : items.length === 0 ? (
          <EmptyState icon="🔍" title="No items found" desc="Try adjusting your filters." />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {items.map(item => (
              <ItemCard key={item._id} item={item} onDelete={fetchItems} onStatusChange={fetchItems} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
