const supabase = require("../config/supabase");

const fetchHelpers = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("helpers")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    res.json({ gotHelper: data });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const fetchHelper = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("helpers")
      .select("*")
      .eq("id", req.params.id)
      .single();
    if (error) throw error;
    res.json({ gotHelper: data });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const createHelper = async (req, res) => {
  try {
    const { helpername, mobilenumber, hostelname, itemdetails } = req.body;
    const { data, error } = await supabase
      .from("helpers")
      .insert({ helpername, mobilenumber, hostelname, itemdetails })
      .select()
      .single();
    if (error) throw error;
    res.json({ createdHelper: data });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const updateHelper = async (req, res) => {
  try {
    const { helpername, mobilenumber, hostelname, itemdetails } = req.body;
    const { data, error } = await supabase
      .from("helpers")
      .update({ helpername, mobilenumber, hostelname, itemdetails })
      .eq("id", req.params.id)
      .select()
      .single();
    if (error) throw error;
    res.json({ updatedHelper: data });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const deleteHelper = async (req, res) => {
  try {
    const { error } = await supabase.from("helpers").delete().eq("id", req.params.id);
    if (error) throw error;
    res.json({ success: true, message: "Helper deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = { fetchHelper, fetchHelpers, createHelper, updateHelper, deleteHelper };
