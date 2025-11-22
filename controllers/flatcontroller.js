const Flat = require("../models/Flat");
const path = require("path");
const mongoose = require("mongoose");

// Upload handler will still be in routes (with multer)
exports.createFlat = async (req, res) => {
  try {
    const { userId, flataddress, rent } = req.body;

    if (!userId) return res.status(400).json({ error: "Missing userId" });
    if (!flataddress || flataddress.trim() === "")
      return res.status(400).json({ error: "Flat address is required" });
    if (!rent || isNaN(rent) || rent <= 0)
      return res.status(400).json({ error: "Valid rent amount is required" });
    if (!req.files || req.files.length === 0)
      return res.status(400).json({ error: "No files uploaded." });

    const imagePaths = req.files.map(file =>
      path.join("uploads", file.filename).replace(/\\/g, "/")
    );

    const newFlat = new Flat({
      ownerId: userId,
      images: imagePaths,
      flataddress,
      rent,
    });

    await newFlat.save();

    res.status(201).json({
      message: "Flat details saved successfully",
      flat: newFlat,
    });
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getAllFlats = async (req, res) => {
  try {
    const flats = await Flat.find().populate("ownerId");
    res.status(200).json(flats);
  } catch (err) {
    console.error("Fetch Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getFlatsByOwner = async (req, res) => {
  try {
    const { ownerId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(ownerId))
      return res.status(400).json({ error: "Invalid ownerId format" });

    const flats = await Flat.find({ ownerId })
      .populate("ownerId")
      .sort({ createdAt: -1 });

    if (!flats.length)
      return res.status(404).json({ message: "No flats found for this owner" });

    res.status(200).json(flats);
  } catch (err) {
    console.error("Fetch Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteFlat = async (req, res) => {
  try {
    const { flatId } = req.params;
    const flat = await Flat.findById(flatId);
    if (!flat) return res.status(404).json({ error: "Flat not found" });

    const { ownerId } = req.body;
    if (flat.ownerId.toString() !== ownerId)
      return res.status(403).json({ error: "Not allowed to delete this flat" });

    await Flat.findByIdAndDelete(flatId);
    res.status(200).json({ message: "Flat deleted successfully" });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
