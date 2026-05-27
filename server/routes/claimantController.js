const supabase = require("../config/supabase");

const fetchClaimants = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("claimants")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    res.json({ gotClaimant: data });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const fetchClaimant = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("claimants")
      .select("*")
      .eq("id", req.params.id)
      .single();
    if (error) throw error;
    res.json({ gotClaimant: data });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const createClaimant = async (req, res) => {
  try {
    const { claimantname, mobilenumber, hostelname, proofofclaim, itemdetails } = req.body;
    const { data, error } = await supabase
      .from("claimants")
      .insert({ claimantname, mobilenumber, hostelname, proofofclaim, itemdetails })
      .select()
      .single();
    if (error) throw error;
    res.json({ createdClaimant: data });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const updateClaimant = async (req, res) => {
  try {
    const { claimantname, mobilenumber, hostelname, proofofclaim, itemdetails } = req.body;
    const { data, error } = await supabase
      .from("claimants")
      .update({ claimantname, mobilenumber, hostelname, proofofclaim, itemdetails })
      .eq("id", req.params.id)
      .select()
      .single();
    if (error) throw error;
    res.json({ updatedClaimant: data });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const deleteClaimant = async (req, res) => {
  try {
    const { error } = await supabase.from("claimants").delete().eq("id", req.params.id);
    if (error) throw error;
    res.json({ success: true, message: "Claimant deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = { fetchClaimant, fetchClaimants, createClaimant, updateClaimant, deleteClaimant };
