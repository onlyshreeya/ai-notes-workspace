const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    userId:         { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title:          { type: String, default: "Untitled Note" },
    content:        { type: String, default: "" },
    tags:           [{ type: String }],
    colorId:        { type: String, default: "default" },
    starred:        { type: Boolean, default: false },
    archived:       { type: Boolean, default: false },
    isPublic:       { type: Boolean, default: false },
    shareId:        { type: String, index: true },
    aiSummary:      { type: String },
    actionItems:    [{ type: String }],
    suggestedTitle: { type: String },   // ← was missing
  },
  { timestamps: true }
);

// Index for fast user lookups
noteSchema.index({ userId: 1, updatedAt: -1 });

module.exports = mongoose.model("Note", noteSchema);
