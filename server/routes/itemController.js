const supabase = require("../config/supabase");

// ── FETCH ALL ITEMS (with optional filters) ───────────────────────────────────
const fetchItems = async (req, res) => {
  try {
    let query = supabase.from("items").select("*").order("created_at", { ascending: false });

    if (req.query.type)   query = query.eq("concerntype", req.query.type);
    if (req.query.status) query = query.eq("status", req.query.status);

    const { data, error } = await query;
    if (error) throw error;

    res.json({ success: true, gotItem: data });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ── FETCH ITEMS FOR SPECIFIC USER ─────────────────────────────────────────────
const fetchUserSpecificItems = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("items")
      .select("*")
      .eq("user_id", req.params.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json({ success: true, gotItems: data });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ── FETCH SINGLE ITEM ─────────────────────────────────────────────────────────
const fetchItem = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("items")
      .select("*")
      .eq("id", req.params.id)
      .single();

    if (error || !data) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }

    res.json({ success: true, gotItem: data });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ── CREATE ITEM ───────────────────────────────────────────────────────────────
const createItem = async (req, res) => {
  try {
    const { itemname, itemdescription, concerntype, images, category, location } = req.body;

    const { data, error } = await supabase
      .from("items")
      .insert({
        user_id:         req.params.id,
        itemname:        itemname,
        itemdescription: itemdescription,
        concerntype:     concerntype,
        category:        category || "Other",
        location:        location || "",
        images:          images || [],
        status:          "pending",
      })
      .select()
      .single();

    if (error) throw error;

    // Map _id for frontend compatibility
    res.json({ success: true, item: { ...data, _id: data.id } });
  } catch (error) {
    console.error("createItem error:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ── UPDATE ITEM ───────────────────────────────────────────────────────────────
const updateItem = async (req, res) => {
  try {
    const { itemname, itemdescription, concerntype, category, location } = req.body;

    const { data, error } = await supabase
      .from("items")
      .update({ itemname, itemdescription, concerntype, category, location })
      .eq("id", req.params.id)
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, item: { ...data, _id: data.id } });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ── UPDATE ITEM STATUS (admin only) ──────────────────────────────────────────
const updateItemStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["pending", "approved", "matched", "rejected", "returned"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const { data, error } = await supabase
      .from("items")
      .update({ status })
      .eq("id", req.params.id)
      .select()
      .single();

    if (error || !data) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }

    res.json({ success: true, item: { ...data, _id: data.id } });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ── DELETE ITEM (admin only) ──────────────────────────────────────────────────
const deleteItem = async (req, res) => {
  try {
    const { error } = await supabase
      .from("items")
      .delete()
      .eq("id", req.params.id);

    if (error) throw error;

    res.json({ success: true, message: "Item deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ── GET STATS ─────────────────────────────────────────────────────────────────
const getStats = async (req, res) => {
  try {
    const { data, error } = await supabase.from("items").select("concerntype, status");
    if (error) throw error;

    const rows = data || [];
    res.json({
      success: true,
      stats: {
        total:    rows.length,
        lost:     rows.filter(r => r.concerntype === "lost").length,
        found:    rows.filter(r => r.concerntype === "found").length,
        pending:  rows.filter(r => r.status === "pending").length,
        matched:  rows.filter(r => r.status === "matched").length,
        returned: rows.filter(r => r.status === "returned").length,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {
  fetchItem, fetchUserSpecificItems, fetchItems,
  createItem, updateItem, updateItemStatus,
  deleteItem, getStats,
};
