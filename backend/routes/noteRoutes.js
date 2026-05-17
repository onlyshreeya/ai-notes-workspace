const express        = require("express");
const router         = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  createNote, getNotes, updateNote, deleteNote,
  shareNote, unshareNote, getSharedNote, getInsights,
} = require("../controllers/noteController");
const { generateSummary } = require("../controllers/aiController");

// ── Public routes (no auth) ──────────────────────────────
router.get("/shared/:shareId", getSharedNote);

// ── Protected routes ─────────────────────────────────────
router.get("/insights",           authMiddleware, getInsights);
router.get("/",                   authMiddleware, getNotes);
router.post("/",                  authMiddleware, createNote);

// IMPORTANT: specific routes BEFORE /:id to avoid conflicts
router.put("/share/:id",          authMiddleware, shareNote);
router.put("/share/:id/private",  authMiddleware, unshareNote);
router.post("/:id/generate-summary", authMiddleware, generateSummary);  // ← matches frontend

router.put("/:id",                authMiddleware, updateNote);
router.delete("/:id",             authMiddleware, deleteNote);

module.exports = router;
