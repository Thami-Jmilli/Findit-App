import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";

import Navbar from "../components/Navbar";
import ItemCard from "../components/ItemCard";
import config from "../components/config";

import { Spinner, EmptyState } from "../utils/helpers";

export default function MyItemsPage() {
  const user = useSelector((s) => s.user.user);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = useCallback(async () => {
    if (!user?._id) return;

    try {
      const res = await axios.get(
        `${config.baseURL}/item/user/${user._id}`,
        {
          withCredentials: true,
        }
      );

      setItems(res.data.gotItems || []);
    } catch (error) {
      toast.error("Failed to load your items");
    } finally {
      setLoading(false);
    }
  }, [user]);

  const handleResolve = async (id) => {
    const confirmDelete = window.confirm(
      "Mark as resolved and remove this report?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`${config.baseURL}/item/${id}`, {
        withCredentials: true,
      });

      toast.success("Report removed");

      fetchItems();
    } catch (error) {
      toast.error("Failed to remove report");
    }
  };

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">
              My Reports
            </h1>

            <p className="text-slate-500 text-sm mt-1">
              All your submitted reports
            </p>
          </div>

          <Link
            to="/report"
            className="btn-primary self-start sm:self-auto"
          >
            ➕ New Report
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner />
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            icon="📋"
            title="No reports yet"
            desc="Start by reporting a lost or found item."
            action={
              <Link to="/report" className="btn-primary">
                Submit first report
              </Link>
            }
          />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <div key={item._id} className="relative">
                <ItemCard item={item} />

                <div className="mt-2">
                  <button
                    onClick={() => handleResolve(item._id)}
                    className="btn-secondary w-full justify-center text-xs py-2 text-red-600 border-red-200 hover:bg-red-50"
                  >
                    ✓ Mark as Resolved & Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}