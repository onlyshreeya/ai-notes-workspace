const Note   = require("../models/Note");
const crypto = require("crypto");

// POST /api/notes
const createNote = async (req, res) => {
  try {
    const { title, content, tags, colorId } = req.body;
    const note = await Note.create({
      userId: req.user.id,
      title:  title  || "Untitled Note",
      content: content || "",
      tags:    tags   || [],
      colorId: colorId || "default",
    });
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/notes
const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.id })
      .sort({ updatedAt: -1 });
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/notes/:id
const updateNote = async (req, res) => {
  try {
    // Ensure user owns the note
    const note = await Note.findOne({ _id: req.params.id, userId: req.user.id });
    if (!note) return res.status(404).json({ message: "Note not found" });

    const allowedFields = ["title","content","tags","colorId","starred","archived"];
    allowedFields.forEach(f => {
      if (req.body[f] !== undefined) note[f] = req.body[f];
    });

    const updated = await note.save();
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/notes/:id
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, userId: req.user.id });
    if (!note) return res.status(404).json({ message: "Note not found" });
    await note.deleteOne();
    res.status(200).json({ message: "Note deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/notes/share/:id  — generate share link
const shareNote = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, userId: req.user.id });
    if (!note) return res.status(404).json({ message: "Note not found" });

    note.isPublic = true;
    note.shareId = note.shareId || crypto.randomBytes(16).toString("hex");

    const updated = await note.save();
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const unshareNote = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, userId: req.user.id });
    if (!note) return res.status(404).json({ message: "Note not found" });

    note.isPublic = false;
    note.shareId = undefined;

    const updated = await note.save();
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/notes/shared/:shareId  — public, no auth
const getSharedNote = async (req, res) => {
  try {
    const note = await Note.findOne({
      shareId:  req.params.shareId,
      isPublic: true,
    });
    if (!note) return res.status(404).json({ message: "Note not found or not public" });
    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/notes/insights  — productivity stats
const getInsights = async (req, res) => {
  try {
    const userId = req.user.id;
    const allNotes = await Note.find({ userId }).sort({ updatedAt: -1 });

    const total    = allNotes.length;
    const aiUsed   = allNotes.filter(n => n.aiSummary).length;
    const archived = allNotes.filter(n => n.archived).length;
    const starred  = allNotes.filter(n => n.starred).length;

    // Most used tags
    const tagCount = {};
    allNotes.forEach(n => (n.tags || []).forEach(t => { tagCount[t] = (tagCount[t]||0)+1; }));
    const topTags = Object.entries(tagCount)
      .sort((a,b)=>b[1]-a[1])
      .slice(0,8)
      .map(([tag,count])=>({ tag, count }));

    // Weekly activity (notes created/edited in last 7 days)
    const week = [];
    for (let i=6; i>=0; i--) {
      const d = new Date(); d.setDate(d.getDate()-i);
      const start = new Date(d); start.setHours(0,0,0,0);
      const end   = new Date(d); end.setHours(23,59,59,999);
      const count = allNotes.filter(n => {
        const u = new Date(n.updatedAt);
        return u>=start && u<=end;
      }).length;
      week.push({ date: start.toISOString().split("T")[0], count });
    }

    // Recently edited
    const recentNotes = allNotes.slice(0,5).map(n=>({
      _id: n._id, title: n.title, updatedAt: n.updatedAt,
    }));

    res.status(200).json({ total, aiUsed, archived, starred, topTags, weeklyActivity: week, recentNotes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createNote, getNotes, updateNote, deleteNote, shareNote, unshareNote, getSharedNote, getInsights };
