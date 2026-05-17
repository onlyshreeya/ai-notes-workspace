import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MoonStar, SunMedium } from "lucide-react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../styles/dashboard.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const NOTE_COLORS = [
  { id: "default", bg: "rgba(18, 14, 34, 0.94)", text: "#ffffff", border: "rgba(139, 92, 246, 0.24)", swatch: "#2d1f4e" },
  { id: "lavender", bg: "#ede9fe", text: "#1e1b4b", border: "#c4b5fd", swatch: "#ddd6fe" },
  { id: "mint", bg: "#d1fae5", text: "#064e3b", border: "#6ee7b7", swatch: "#a7f3d0" },
  { id: "peach", bg: "#ffedd5", text: "#431407", border: "#fdba74", swatch: "#fed7aa" },
  { id: "sky", bg: "#e0f2fe", text: "#0c4a6e", border: "#7dd3fc", swatch: "#bae6fd" },
  { id: "rose", bg: "#ffe4e6", text: "#4c0519", border: "#fca5a5", swatch: "#fecaca" },
  { id: "lemon", bg: "#fef9c3", text: "#422006", border: "#fde047", swatch: "#fef08a" },
  { id: "sage", bg: "#dcfce7", text: "#14532d", border: "#86efac", swatch: "#bbf7d0" },
];

const HEADING_STYLES = [
  { id: "none", label: "Body", style: { fontSize: "1rem", fontWeight: 400, fontFamily: "'Figtree', sans-serif" } },
  { id: "h1", label: "H1", style: { fontSize: "2rem", fontWeight: 800, fontFamily: "'Syne', sans-serif" } },
  { id: "h2", label: "H2", style: { fontSize: "1.5rem", fontWeight: 700, fontFamily: "'Syne', sans-serif" } },
  { id: "h3", label: "H3", style: { fontSize: "1.2rem", fontWeight: 600, fontFamily: "'Syne', sans-serif" } },
  { id: "quote", label: "Quote", style: { fontSize: "1.05rem", fontWeight: 400, fontStyle: "italic", fontFamily: "'Figtree', sans-serif" } },
];

const SUGGESTED_TAGS = [
  "personal",
  "work",
  "ideas",
  "meeting",
  "todo",
  "journal",
  "research",
  "urgent",
  "reference",
  "goals",
  "daily",
  "project",
];

const VIEW_META = {
  all: {
    eyebrow: "Workspace",
    title: "All Notes",
    description: "Search, filter, and manage every active note in one clean workspace.",
  },
  starred: {
    eyebrow: "Favorites",
    title: "Starred Notes",
    description: "Keep your most important notes pinned within reach.",
  },
  ai: {
    eyebrow: "Automation",
    title: "AI Insights",
    description: "Review summaries, action items, and suggested titles generated from your notes.",
  },
  archived: {
    eyebrow: "Storage",
    title: "Archived Notes",
    description: "Quietly store notes you want to keep without leaving them in the active feed.",
  },
};

function timeAgo(date) {
  const seconds = (Date.now() - new Date(date)) / 1000;
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

function getFirstName(name = "") {
  return (name || "").split(" ")[0] || "there";
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function formatWeekdayLabel(dateString) {
  return new Date(dateString).toLocaleDateString(undefined, { weekday: "short" });
}

function extractLinks(text = "") {
  return [...(text || "").matchAll(/https?:\/\/[^\s)>\]"]+/g)].map((match) => match[0]);
}

function getColorById(id) {
  return NOTE_COLORS.find((color) => color.id === id) || NOTE_COLORS[0];
}

function escapeHtml(value = "") {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function ShareExportModal({ note, open, onClose, onCreateShareLink, onMakePrivate, onToast }) {
  const [sharing, setSharing] = useState(false);
  const [unsharing, setUnsharing] = useState(false);

  if (!open || !note) return null;

  const isPublic = Boolean(note.isPublic && note.shareId);
  const visibilityLabel = isPublic ? "Public" : "Private";

  const handleCopyShareLink = async () => {
    if (!note?._id) {
      onToast?.("Save the note first to generate a share link.", "error");
      return;
    }

    setSharing(true);
    try {
      const url = await onCreateShareLink(note);
      await navigator.clipboard.writeText(url);
      onToast?.("Share link copied");
      onClose();
    } catch {
      onToast?.("Share failed", "error");
    } finally {
      setSharing(false);
    }
  };

  const handleMakePrivate = async () => {
    if (!note?._id) {
      onToast?.("Save the note first before changing visibility.", "error");
      return;
    }

    setUnsharing(true);
    try {
      await onMakePrivate(note);
      onToast?.("Public link removed");
    } catch {
      onToast?.("Could not update visibility", "error");
    } finally {
      setUnsharing(false);
    }
  };

  const handleSaveAsPdf = () => {
    const printableTitle = note.title || "Untitled Note";
    const printableTags =
      note.tags?.length > 0 ? note.tags.map((tag) => `#${escapeHtml(tag)}`).join(" ") : "No tags";
    const printableContent = escapeHtml(note.content || "No content").replace(/\n/g, "<br />");
    const printWindow = window.open("", "_blank", "width=900,height=700");

    if (!printWindow) {
      onToast?.("Popup blocked. Please allow popups to save as PDF.", "error");
      return;
    }

    printWindow.document.write(`
      <!doctype html>
      <html>
        <head>
          <title>${escapeHtml(printableTitle)}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 48px;
              color: #161616;
              line-height: 1.7;
            }
            h1 {
              margin: 0 0 8px;
              font-size: 28px;
            }
            .meta {
              margin-bottom: 24px;
              color: #666;
              font-size: 14px;
            }
            .content {
              white-space: normal;
              font-size: 15px;
            }
          </style>
        </head>
        <body>
          <h1>${escapeHtml(printableTitle)}</h1>
          <div class="meta">${printableTags}</div>
          <div class="content">${printableContent}</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    onClose();
  };

  return (
    <div className="ep-modal-backdrop" onClick={onClose}>
      <div className="ep-modal" onClick={(event) => event.stopPropagation()}>
        <div className="ep-modal-head">
          <div>
            <p className="ep-kicker">Share & Export</p>
            <h3 className="ep-modal-title">{note.title || "Untitled note"}</h3>
          </div>
          <button className="ep-modal-close" onClick={onClose}>
            x
          </button>
        </div>
        <div className="ep-modal-actions">
          <div className="ep-visibility-status">
            <span className="ep-visibility-label">Visibility</span>
            <strong className={`ep-visibility-pill ${isPublic ? "public" : "private"}`}>{visibilityLabel}</strong>
          </div>
          <button className="ep-modal-action" onClick={handleCopyShareLink} disabled={sharing}>
            <strong>{sharing ? (isPublic ? "Copying..." : "Generating...") : "Copy public link"}</strong>
            <span>{isPublic ? "Copy the current public link to your clipboard." : "Create a public link and copy it to your clipboard."}</span>
          </button>
          {isPublic && (
            <button className="ep-modal-action ep-modal-action-danger" onClick={handleMakePrivate} disabled={unsharing}>
              <strong>{unsharing ? "Updating..." : "Make private again"}</strong>
              <span>Turn off public access and clear the current share link.</span>
            </button>
          )}
          <button className="ep-modal-action" onClick={handleSaveAsPdf}>
            <strong>Save as PDF</strong>
            <span>Open the browser print dialog so you can save this note as a PDF.</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteConfirmModal({ note, open, deleting, onClose, onConfirm }) {
  if (!open || !note) return null;

  return (
    <div className="ep-modal-backdrop" onClick={deleting ? undefined : onClose}>
      <div className="ep-modal ep-modal-sm" onClick={(event) => event.stopPropagation()}>
        <div className="ep-modal-head">
          <div>
            <p className="ep-kicker">Delete Note</p>
            <h3 className="ep-modal-title">{note.title || "Untitled note"}</h3>
          </div>
          <button className="ep-modal-close" onClick={onClose} disabled={deleting}>
            x
          </button>
        </div>

        <div className="ep-modal-body">
          <p className="ep-modal-copy">
            This note will be permanently removed from your workspace. This action cannot be undone.
          </p>
        </div>

        <div className="ep-modal-footer">
          <button className="ep-modal-secondary" onClick={onClose} disabled={deleting}>
            Cancel
          </button>
          <button className="ep-modal-primary-danger" onClick={() => onConfirm(note._id)} disabled={deleting}>
            {deleting ? "Deleting..." : "Delete note"}
          </button>
        </div>
      </div>
    </div>
  );
}

function DashboardHero({ eyebrow, title, description, onAction }) {
  return (
    <div className="db-page-hero">
      <div>
        <p className="db-page-eyebrow">{eyebrow}</p>
        <h1 className="db-page-title">{title}</h1>
        <p className="db-page-description">{description}</p>
      </div>
      <button className="db-new-btn" onClick={onAction}>
        New Note
      </button>
    </div>
  );
}

function AiPanel({ note, token, onAiDone }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(
    note?.aiSummary
      ? { summary: note.aiSummary, actionItems: note.actionItems || [], suggestedTitle: note.suggestedTitle || "" }
      : null
  );

  useEffect(() => {
    setResult(
      note?.aiSummary
        ? { summary: note.aiSummary, actionItems: note.actionItems || [], suggestedTitle: note.suggestedTitle || "" }
        : null
    );
  }, [note]);

  const generate = async () => {
    if (!note?._id) return;
    setLoading(true);
    try {
      const res = await axios.post(
        `${API}/notes/${note._id}/generate-summary`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResult(res.data);
      onAiDone && onAiDone(res.data);
    } catch {
      setResult({ summary: "Failed to generate. Please try again.", actionItems: [], suggestedTitle: "" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-pane">
      <div className="ai-pane-head">
        <div className="ai-pane-badge">AI</div>
        <div>
          <div className="ai-pane-title">AI Insights</div>
          <div className="ai-pane-sub">Smart summaries, action items, and title suggestions</div>
        </div>
      </div>

      {!result ? (
        <div className="ai-pane-empty">
          <div className="ai-orb-wrap">
            <div className="ai-orb-1" />
            <div className="ai-orb-2" />
          </div>
          <p>Generate a smart summary and pull action items directly from this note.</p>
          <button className="ai-gen-btn" onClick={generate} disabled={loading || !note?._id}>
            {loading ? <span className="spin-ring" /> : "Generate AI Summary"}
          </button>
          {!note?._id && <p className="ai-hint">Save the note first to enable AI.</p>}
        </div>
      ) : (
        <div className="ai-pane-results">
          {result.suggestedTitle && (
            <div className="ai-result-card">
              <div className="ai-result-label">Suggested Title</div>
              <div className="ai-result-value ai-result-title">"{result.suggestedTitle}"</div>
            </div>
          )}

          <div className="ai-result-card">
            <div className="ai-result-label">Summary</div>
            <div className="ai-result-value">{result.summary}</div>
          </div>

          {result.actionItems?.length > 0 && (
            <div className="ai-result-card">
              <div className="ai-result-label">Action Items</div>
              <ul className="ai-action-list">
                {result.actionItems.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          <button className="ai-regen-btn" onClick={generate} disabled={loading}>
            {loading ? <span className="spin-ring" /> : "Regenerate"}
          </button>
        </div>
      )}
    </div>
  );
}

function NoteEditorPanel({
  note,
  isNew,
  onSave,
  onClose,
  token,
  availableTags = [],
  onOpenShareModal,
  onToggleArchive,
}) {
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState(note?.tags || []);
  const [tagMenuOpen, setTagMenuOpen] = useState(false);
  const [colorId, setColorId] = useState(note?.colorId || "default");
  const [headingId, setHeadingId] = useState("none");
  const [activeTab, setActiveTab] = useState("write");
  const [savedNote, setSavedNote] = useState(note || null);
  const [saving, setSaving] = useState(false);
  const [saveState, setSaveState] = useState("idle");
  const [images, setImages] = useState([]);
  const fileRef = useRef();
  const lastSavedSnapshotRef = useRef("");

  const color = getColorById(colorId);
  const isLight = colorId !== "default";
  const links = extractLinks(content);
  const heading = HEADING_STYLES.find((item) => item.id === headingId) || HEADING_STYLES[0];
  const tagSuggestions = [...new Set([...availableTags, ...SUGGESTED_TAGS])]
    .filter((tag) => !tags.includes(tag))
    .filter((tag) => !tagInput.trim() || tag.toLowerCase().includes(tagInput.trim().toLowerCase()))
    .slice(0, 8);

  const snapshot = JSON.stringify({
    title: title || "Untitled Note",
    content,
    tags: [...tags].sort(),
    colorId,
  });

  useEffect(() => {
    setTitle(note?.title || "");
    setContent(note?.content || "");
    setTags(note?.tags || []);
    setColorId(note?.colorId || "default");
    setSavedNote(note || null);
    setImages([]);
    setHeadingId("none");
    setActiveTab("write");
    setTagMenuOpen(false);
    lastSavedSnapshotRef.current = JSON.stringify({
      title: note?.title || "Untitled Note",
      content: note?.content || "",
      tags: [...(note?.tags || [])].sort(),
      colorId: note?.colorId || "default",
    });
    setSaveState("idle");
  }, [note, isNew]);

  const addTagValue = (value) => {
    const nextTag = value.trim().replace(/^#/, "");
    if (!nextTag || tags.includes(nextTag)) return;
    setTags([...tags, nextTag]);
    setTagInput("");
    setTagMenuOpen(false);
  };

  const addTag = (event) => {
    if ((event.key === "Enter" || event.key === ",") && tagInput.trim()) {
      event.preventDefault();
      addTagValue(tagInput);
    }
    if (event.key === "Escape") {
      setTagMenuOpen(false);
    }
  };

  const handleImageAdd = (event) => {
    Array.from(event.target.files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (loadEvent) => setImages((current) => [...current, loadEvent.target.result]);
      reader.readAsDataURL(file);
    });
  };

  const pasteLink = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text.startsWith("http")) {
        setContent((current) => current + (current ? "\n" : "") + text);
      }
    } catch {
      const url = prompt("Paste a URL:");
      if (url) {
        setContent((current) => current + (current ? "\n" : "") + url);
      }
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveState("saving");
    const result = await onSave({ title: title || "Untitled Note", content, tags, colorId });
    if (result) {
      setSavedNote(result);
      lastSavedSnapshotRef.current = JSON.stringify({
        title: result.title || "Untitled Note",
        content: result.content || "",
        tags: [...(result.tags || [])].sort(),
        colorId: result.colorId || "default",
      });
      setSaveState("saved");
    } else {
      setSaveState("idle");
    }
    setSaving(false);
    return result;
  };

  useEffect(() => {
    if (activeTab !== "write" || saving) return;
    if (snapshot === lastSavedSnapshotRef.current) return;

    const hasMeaningfulDraft =
      Boolean(title.trim()) || Boolean(content.trim()) || tags.length > 0 || colorId !== "default";

    if (!hasMeaningfulDraft) return;

    setSaveState("pending");
    const timeoutId = setTimeout(async () => {
      await handleSave();
    }, 1200);

    return () => clearTimeout(timeoutId);
  }, [snapshot, activeTab, saving]);

  return (
    <div className="ep-wrap">
      <div
        className="ep-panel"
        style={{
          "--ep-bg": color.bg,
          "--ep-text": color.text,
          "--ep-border": color.border,
          "--ep-muted": isLight ? "rgba(0, 0, 0, 0.68)" : "rgba(255, 255, 255, 0.68)",
          "--ep-faint": isLight ? "rgba(0, 0, 0, 0.42)" : "rgba(255, 255, 255, 0.34)",
          "--ep-placeholder": isLight ? "rgba(0, 0, 0, 0.24)" : "rgba(255, 255, 255, 0.22)",
          "--ep-surface": isLight ? "rgba(255, 255, 255, 0.42)" : "rgba(255, 255, 255, 0.04)",
          "--ep-surface-strong": isLight ? "rgba(255, 255, 255, 0.56)" : "rgba(255, 255, 255, 0.06)",
          "--ep-surface-soft": isLight ? "rgba(255, 255, 255, 0.32)" : "rgba(255, 255, 255, 0.035)",
          "--ep-line": isLight ? "rgba(0, 0, 0, 0.08)" : "rgba(255, 255, 255, 0.06)",
          "--ep-chip-border": isLight ? "rgba(0, 0, 0, 0.12)" : "rgba(139, 92, 246, 0.24)",
          "--ep-chip-bg": isLight ? "rgba(0, 0, 0, 0.06)" : "rgba(139, 92, 246, 0.12)",
          "--ep-dropdown-bg": isLight ? "rgba(255, 255, 255, 0.96)" : "rgba(10, 9, 18, 0.96)",
        }}
      >
        <div className="ep-header" style={{ borderBottomColor: isLight ? "rgba(0, 0, 0, 0.1)" : undefined }}>
          <div className="ep-header-meta">
            <button className="ep-close-btn" onClick={onClose}>
              Back
            </button>
            <div>
              <p className="ep-kicker">{isNew ? "New note" : "Editing note"}</p>
              <h2 className="ep-header-title">{title || "Untitled note"}</h2>
            </div>
          </div>

          <div className="ep-header-actions">
            {savedNote?._id && (
              <button className="ep-ghost-btn" onClick={() => onToggleArchive(savedNote || note)}>
                {(savedNote || note)?.archived ? "Restore" : "Archive"}
              </button>
            )}
            <button className="ep-ghost-btn" onClick={() => onOpenShareModal(savedNote || note)}>
              Share
            </button>
            <div className="ep-tab-strip">
              <button className={`ep-tab ${activeTab === "write" ? "on" : ""}`} onClick={() => setActiveTab("write")}>
                Write
              </button>
              <button className={`ep-tab ${activeTab === "ai" ? "on" : ""}`} onClick={() => setActiveTab("ai")}>
                AI
              </button>
            </div>

            <button className="ep-save-btn" onClick={handleSave} disabled={saving}>
              {saving ? <span className="spin-ring spin-dark" /> : saveState === "pending" ? "Saving soon" : saveState === "saved" ? "Saved" : "Save note"}
            </button>
          </div>
        </div>

        {activeTab === "write" ? (
          <div className="ep-body-wrap" style={{ background: color.bg, color: color.text }}>
            <div className="ep-editor-grid">
              <div className="ep-editor-main">
                <input
                  className="ep-note-title"
                  placeholder="Note title..."
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  style={{ color: color.text }}
                  autoFocus
                />

                <textarea
                  className="ep-textarea"
                  placeholder="Start writing your note. Capture ideas, meeting takeaways, tasks, or anything you need to revisit."
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                  style={{ color: color.text, ...heading.style, lineHeight: 1.9 }}
                />

                {images.length > 0 && (
                  <div className="ep-images-row">
                    {images.map((src, index) => (
                      <div key={index} className="ep-img-thumb">
                        <img src={src} alt="" />
                        <button onClick={() => setImages(images.filter((_, imageIndex) => imageIndex !== index))}>x</button>
                      </div>
                    ))}
                  </div>
                )}

                {links.length > 0 && (
                  <div className="ep-links-box" style={{ borderColor: isLight ? "rgba(0, 0, 0, 0.08)" : undefined }}>
                    <div className="ep-links-label" style={{ color: isLight ? "rgba(0, 0, 0, 0.4)" : undefined }}>
                      Links in this note
                    </div>
                    {links.map((link, index) => (
                      <a
                        key={index}
                        href={link}
                        target="_blank"
                        rel="noreferrer"
                        className="ep-link-chip"
                        style={
                          isLight
                            ? { color: color.text, background: "rgba(0, 0, 0, 0.08)", borderColor: "rgba(0, 0, 0, 0.12)" }
                            : {}
                        }
                      >
                        {link.length > 72 ? `${link.slice(0, 72)}...` : link}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              <aside className="ep-editor-side">
                <div className="ep-side-card" style={{ borderColor: isLight ? "rgba(0, 0, 0, 0.08)" : undefined }}>
                  <span className="ep-form-label" style={{ color: isLight ? "rgba(0, 0, 0, 0.45)" : undefined }}>
                    Color
                  </span>
                  <div className="ep-swatches">
                    {NOTE_COLORS.map((item) => (
                      <button
                        key={item.id}
                        className={`ep-swatch ${colorId === item.id ? "sel" : ""}`}
                        style={{ background: item.swatch, borderColor: item.border }}
                        onClick={() => setColorId(item.id)}
                        title={item.id}
                      />
                    ))}
                  </div>
                </div>

                <div className="ep-side-card" style={{ borderColor: isLight ? "rgba(0, 0, 0, 0.08)" : undefined }}>
                  <span className="ep-form-label" style={{ color: isLight ? "rgba(0, 0, 0, 0.45)" : undefined }}>
                    Style
                  </span>
                  <div className="ep-style-pills">
                    {HEADING_STYLES.map((item) => (
                      <button
                        key={item.id}
                        className={`ep-style-pill ${headingId === item.id ? "on" : ""}`}
                        onClick={() => setHeadingId(item.id)}
                        style={isLight ? { color: color.text, borderColor: "rgba(0, 0, 0, 0.15)" } : {}}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="ep-side-card" style={{ borderColor: isLight ? "rgba(0, 0, 0, 0.08)" : undefined }}>
                  <span className="ep-form-label" style={{ color: isLight ? "rgba(0, 0, 0, 0.45)" : undefined }}>
                    Tags
                  </span>
                  <div className="ep-tags-field">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="ep-tag-chip"
                        style={
                          isLight
                            ? { background: "rgba(0, 0, 0, 0.1)", color: color.text, borderColor: "rgba(0, 0, 0, 0.15)" }
                            : {}
                        }
                      >
                        #{tag}
                        <button onClick={() => setTags(tags.filter((value) => value !== tag))} style={{ color: color.text }}>
                          x
                        </button>
                      </span>
                    ))}
                    <input
                      className="ep-tags-input"
                      placeholder="tag, press Enter..."
                      value={tagInput}
                      onChange={(event) => {
                        setTagInput(event.target.value);
                        setTagMenuOpen(true);
                      }}
                      onKeyDown={addTag}
                      onFocus={() => setTagMenuOpen(true)}
                      onBlur={() => setTimeout(() => setTagMenuOpen(false), 120)}
                      style={{ color: color.text }}
                    />
                  </div>
                  {tagMenuOpen && tagSuggestions.length > 0 && (
                    <div
                      className="ep-tags-dropdown"
                      style={
                        isLight
                          ? { background: "rgba(255, 255, 255, 0.96)", borderColor: "rgba(0, 0, 0, 0.08)" }
                          : {}
                      }
                    >
                      {tagSuggestions.map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          className="ep-tags-option"
                          onMouseDown={() => addTagValue(tag)}
                          style={isLight ? { color: color.text } : {}}
                        >
                          <span>#{tag}</span>
                          <small>Add tag</small>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="ep-side-card" style={{ borderColor: isLight ? "rgba(0, 0, 0, 0.08)" : undefined }}>
                  <span className="ep-form-label" style={{ color: isLight ? "rgba(0, 0, 0, 0.45)" : undefined }}>
                    Tools
                  </span>
                  <div className="ep-toolbar">
                    <button
                      className="ep-tool-btn"
                      onClick={() => fileRef.current.click()}
                      style={
                        isLight
                          ? { color: color.text, borderColor: "rgba(0, 0, 0, 0.12)", background: "rgba(0, 0, 0, 0.06)" }
                          : {}
                      }
                    >
                      Image
                    </button>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      multiple
                      style={{ display: "none" }}
                      onChange={handleImageAdd}
                    />
                    <button
                      className="ep-tool-btn"
                      onClick={pasteLink}
                      style={
                        isLight
                          ? { color: color.text, borderColor: "rgba(0, 0, 0, 0.12)", background: "rgba(0, 0, 0, 0.06)" }
                          : {}
                      }
                    >
                      Link
                    </button>
                  </div>
                </div>

                <div className="ep-side-card ep-side-card-meta" style={{ borderColor: isLight ? "rgba(0, 0, 0, 0.08)" : undefined }}>
                  <span className="ep-form-label" style={{ color: isLight ? "rgba(0, 0, 0, 0.45)" : undefined }}>
                    Stats
                  </span>
                  <div className="ep-meta-row">
                    <span>Characters</span>
                    <strong>{content.length}</strong>
                  </div>
                  <div className="ep-meta-row">
                    <span>Links</span>
                    <strong>{links.length}</strong>
                  </div>
                  <div className="ep-meta-row">
                    <span>Tags</span>
                    <strong>{tags.length}</strong>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        ) : (
          <AiPanel note={savedNote} token={token} onAiDone={() => {}} />
        )}
      </div>
    </div>
  );
}

function NoteCard({ note, onEdit, onDelete, onStar, onShare, onArchive }) {
  const color = getColorById(note.colorId);
  const isLight = note.colorId && note.colorId !== "default";
  const links = extractLinks(note.content);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="note-card" onClick={() => onEdit(note)} style={{ background: color.bg, borderColor: color.border, color: color.text }}>
      <div className="nc-top">
        <h3 className="nc-title" style={{ color: color.text }}>
          {note.title}
        </h3>
        <div className="nc-actions" onClick={(event) => event.stopPropagation()}>
          <button
            className="nc-btn nc-menu-trigger"
            onClick={() => setMenuOpen((current) => !current)}
            style={isLight ? { background: "rgba(0, 0, 0, 0.09)", color: color.text, borderColor: "rgba(0, 0, 0, 0.1)" } : {}}
          >
            ...
          </button>
          {menuOpen && (
            <div className="nc-menu" onMouseLeave={() => setMenuOpen(false)}>
              <button
                className="nc-menu-item"
                onClick={() => {
                  onStar(note);
                  setMenuOpen(false);
                }}
              >
                {note.starred ? "Unstar" : "Star"}
              </button>
              <button
                className="nc-menu-item"
                onClick={() => {
                  onShare(note);
                  setMenuOpen(false);
                }}
              >
                Share
              </button>
              <button
                className="nc-menu-item"
                onClick={() => {
                  onArchive(note);
                  setMenuOpen(false);
                }}
              >
                {note.archived ? "Restore" : "Archive"}
              </button>
              <button
                className="nc-menu-item nc-menu-item-delete"
                onClick={() => {
                  onDelete(note._id);
                  setMenuOpen(false);
                }}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {note.content && (
        <p className="nc-preview" style={{ color: isLight ? `${color.text}aa` : undefined }}>
          {note.content.replace(/https?:\/\/\S+/g, "").trim().slice(0, 130)}
          {note.content.length > 130 ? "..." : ""}
        </p>
      )}

      {(note.aiSummary || note.actionItems?.length > 0) && (
        <div className="nc-badges">
          {note.aiSummary && (
            <span
              className="nc-badge nc-badge-ai"
              style={isLight ? { background: "rgba(0, 0, 0, 0.1)", color: color.text, borderColor: "rgba(0, 0, 0, 0.15)" } : {}}
            >
              AI Summary
            </span>
          )}
          {note.actionItems?.length > 0 && (
            <span
              className="nc-badge nc-badge-act"
              style={isLight ? { background: "rgba(0, 0, 0, 0.1)", color: color.text, borderColor: "rgba(0, 0, 0, 0.15)" } : {}}
            >
              {note.actionItems.length} Actions
            </span>
          )}
        </div>
      )}

      <div className="nc-footer">
        <div className="nc-tags">
          {note.tags?.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="nc-tag"
              style={isLight ? { background: "rgba(0, 0, 0, 0.09)", color: color.text, borderColor: "rgba(0, 0, 0, 0.12)" } : {}}
            >
              #{tag}
            </span>
          ))}
          {links.length > 0 && <span className="nc-tag nc-tag-link">Links {links.length}</span>}
        </div>
        <span className="nc-time" style={{ color: isLight ? `${color.text}70` : undefined }}>
          {timeAgo(note.updatedAt)}
        </span>
      </div>
    </div>
  );
}

function WelcomePage({ userName, onNew }) {
  return (
    <div className="home-page">
      <div className="home-glow-1" />
      <div className="home-glow-2" />
      <div className="home-content">
        <div className="home-badge">Peblo Workplace</div>
        <h1 className="home-greeting">
          {getGreeting()},
          <br />
          <span className="home-name">{getFirstName(userName)}</span>
        </h1>
        <p className="home-sub">
          Your workspace is ready. Capture ideas, organize notes, and let AI do the heavy lifting.
        </p>
        <button className="home-cta" onClick={onNew}>
          Ready to write a note?
        </button>
        <div className="home-features">
          <div className="home-feat">
            <span>Smart Notes</span>
          </div>
          <div className="home-feat">
            <span>AI Summaries</span>
          </div>
          <div className="home-feat">
            <span>Share Links</span>
          </div>
          <div className="home-feat">
            <span>Insights</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function AllNotesPage({ notes, onEdit, onDelete, onStar, onShare, onArchive, onNew, search, setSearch, activeTag, setActiveTag, allTags, loading }) {
  const suggestedTags = [...allTags, ...SUGGESTED_TAGS.filter((tag) => !allTags.includes(tag))];
  const filtered = notes.filter((note) => {
    if (note.archived) return false;
    const query = search.toLowerCase();
    const matchesSearch =
      !query ||
      note.title.toLowerCase().includes(query) ||
      note.content?.toLowerCase().includes(query) ||
      note.tags?.some((tag) => tag.toLowerCase().includes(query));
    const matchesTag = !activeTag || note.tags?.includes(activeTag);
    return matchesSearch && matchesTag;
  });

  const total = notes.filter((note) => !note.archived).length;
  const aiCount = notes.filter((note) => note.aiSummary && !note.archived).length;
  const starCount = notes.filter((note) => note.starred && !note.archived).length;

  return (
    <div className="all-page">
      <div className="search-block">
        <div className="search-box">
          <svg className="search-ico" width="17" height="17" viewBox="0 0 17 17" fill="none">
            <circle cx="7.5" cy="7.5" r="5.5" stroke="currentColor" strokeWidth="1.6" />
            <path d="M12 12L15 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <input
            className="search-inp"
            placeholder="Search notes, tags, content..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          {search && (
            <button className="search-clr" onClick={() => setSearch("")}>
              x
            </button>
          )}
        </div>

        <div className="tag-suggest-row">
          <span className="tag-suggest-lbl">Suggestions</span>
          {suggestedTags.slice(0, 10).map((tag) => (
            <button
              key={tag}
              className={`tag-suggest-pill ${activeTag === tag ? "on" : allTags.includes(tag) ? "used" : ""}`}
              onClick={() => setActiveTag((current) => (current === tag ? null : tag))}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      <div className="stats-strip">
        <div className="stat-box">
          <span className="stat-n">{total}</span>
          <span className="stat-l">Total Notes</span>
        </div>
        <div className="stat-div" />
        <div className="stat-box">
          <span className="stat-n stat-n-ai">{aiCount}</span>
          <span className="stat-l">AI Summaries</span>
        </div>
        <div className="stat-div" />
        <div className="stat-box">
          <span className="stat-n stat-n-star">{starCount}</span>
          <span className="stat-l">Starred</span>
        </div>
        <div className="stat-div" />
        <div className="stat-box">
          <span className="stat-n">{allTags.length}</span>
          <span className="stat-l">Tags</span>
        </div>
      </div>

      {loading ? (
        <div className="state-box">
          <div className="state-spinner" />
          <p>Loading your workspace...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="state-box">
          <div className="state-icon">{search ? "Search" : "Notes"}</div>
          <h3 className="state-title">{search ? "No notes match" : "No notes here yet"}</h3>
          <p className="state-sub">{search ? "Try a different search." : "Create your first note to get started."}</p>
          {!search && (
            <button className="db-new-btn" style={{ marginTop: "1.5rem" }} onClick={onNew}>
              Create first note
            </button>
          )}
        </div>
      ) : (
        <div className="notes-grid">
          {filtered.map((note) => (
            <NoteCard key={note._id} note={note} onEdit={onEdit} onDelete={onDelete} onStar={onStar} onShare={onShare} onArchive={onArchive} />
          ))}
        </div>
      )}
    </div>
  );
}

function StarredPage({ notes, onEdit, onDelete, onStar, onShare, onArchive }) {
  const starred = notes.filter((note) => note.starred && !note.archived);

  if (starred.length === 0) {
    return (
      <div className="state-box">
        <div className="state-icon">Starred</div>
        <h3 className="state-title">No starred notes yet</h3>
        <p className="state-sub">Star notes from your workspace to find them here quickly.</p>
      </div>
    );
  }

  return (
    <div className="inner-page">
      <div className="notes-grid">
        {starred.map((note) => (
          <NoteCard key={note._id} note={note} onEdit={onEdit} onDelete={onDelete} onStar={onStar} onShare={onShare} onArchive={onArchive} />
        ))}
      </div>
    </div>
  );
}

function AiInsightsPage({ notes, insights, loading }) {
  const aiNotes = notes.filter((note) => note.aiSummary && !note.archived);
  const weeklyActivity = insights?.weeklyActivity || [];
  const maxWeeklyCount = Math.max(...weeklyActivity.map((item) => item.count), 1);

  return (
    <div className="inner-page">
      {loading ? (
        <div className="state-box">
          <div className="state-spinner" />
          <p>Loading AI insights...</p>
        </div>
      ) : (
        <>
          <div className="ai-insights-grid">
            <div className="ai-insight-card ai-insight-card-hero">
              <div className="ai-insight-label">AI Usage</div>
              <div className="ai-insight-value">{insights?.aiUsed ?? 0}</div>
              <p className="ai-insight-copy">Notes with generated summaries in your workspace.</p>
            </div>
            <div className="ai-insight-card">
              <div className="ai-insight-label">Coverage</div>
              <div className="ai-insight-value">
                {insights?.total ? `${Math.round(((insights?.aiUsed ?? 0) / insights.total) * 100)}%` : "0%"}
              </div>
              <p className="ai-insight-copy">Share of total notes that already use AI.</p>
            </div>
            <div className="ai-insight-card">
              <div className="ai-insight-label">Starred With AI</div>
              <div className="ai-insight-value">{notes.filter((note) => note.starred && note.aiSummary && !note.archived).length}</div>
              <p className="ai-insight-copy">High-priority notes that also include an AI summary.</p>
            </div>
          </div>

          <div className="ai-weekly-card">
            <div className="ai-weekly-head">
              <div>
                <div className="ai-insight-label">Weekly Activity</div>
                <h3 className="ai-weekly-title">Last 7 days of note updates</h3>
              </div>
              <span className="ai-weekly-total">{weeklyActivity.reduce((sum, item) => sum + item.count, 0)} edits</span>
            </div>

            {weeklyActivity.length > 0 ? (
              <div className="ai-weekly-chart">
                {weeklyActivity.map((item) => (
                  <div key={item.date} className="ai-weekly-bar-wrap">
                    <span className="ai-weekly-count">{item.count}</span>
                    <div className="ai-weekly-bar-track">
                      <div
                        className="ai-weekly-bar-fill"
                        style={{ height: `${Math.max((item.count / maxWeeklyCount) * 100, item.count > 0 ? 12 : 0)}%` }}
                      />
                    </div>
                    <span className="ai-weekly-day">{formatWeekdayLabel(item.date)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="state-sub">No weekly activity yet.</p>
            )}
          </div>
        </>
      )}

      {aiNotes.length === 0 ? (
        <div className="state-box">
          <div className="state-icon">AI</div>
          <h3 className="state-title">No AI summaries yet</h3>
          <p className="state-sub">Open any note, switch to the AI tab, and generate a summary.</p>
        </div>
      ) : (
      <div className="ai-notes-list">
        {aiNotes.map((note) => (
          <div key={note._id} className="ai-note-row">
            <div className="ai-note-row-head">
              <h3 className="ai-note-row-title">{note.title}</h3>
              <span className="ai-note-row-time">{timeAgo(note.updatedAt)}</span>
            </div>
            {note.suggestedTitle && (
              <div className="ai-note-block">
                <div className="ai-note-block-label">Suggested Title</div>
                <p className="ai-note-block-text ai-suggested">"{note.suggestedTitle}"</p>
              </div>
            )}
            {note.aiSummary && (
              <div className="ai-note-block">
                <div className="ai-note-block-label">Summary</div>
                <p className="ai-note-block-text">{note.aiSummary}</p>
              </div>
            )}
            {note.actionItems?.length > 0 && (
              <div className="ai-note-block">
                <div className="ai-note-block-label">Action Items</div>
                <ul className="ai-note-actions">
                  {note.actionItems.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
      )}
    </div>
  );
}

function ArchivedPage({ notes, onEdit, onDelete, onArchive }) {
  const archived = notes.filter((note) => note.archived);

  if (archived.length === 0) {
    return (
      <div className="state-box">
        <div className="state-icon">Archive</div>
        <h3 className="state-title">Nothing archived</h3>
        <p className="state-sub">Notes you archive will appear here.</p>
      </div>
    );
  }

  return (
    <div className="inner-page">
      <div className="notes-grid">
        {archived.map((note) => (
          <NoteCard key={note._id} note={note} onEdit={onEdit} onDelete={onDelete} onStar={() => {}} onShare={() => {}} onArchive={onArchive} />
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  useEffect(() => {
    document.body.classList.add("dashboard-body");

    return () => {
      document.body.classList.remove("dashboard-body");
    };
  }, []);

  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [insights, setInsights] = useState(null);
  const [insightsLoading, setInsightsLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(() => localStorage.getItem("peblo-dashboard-theme") || "dark");
  const [search, setSearch] = useState("");
  const [view, setView] = useState("home");
  const [activeTag, setActiveTag] = useState(null);
  const [editorNote, setEditorNote] = useState(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [shareModalNote, setShareModalNote] = useState(null);
  const [deleteModalNote, setDeleteModalNote] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState(null);

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  })();
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchNotes();
    fetchInsights();
  }, []);

  useEffect(() => {
    localStorage.setItem("peblo-dashboard-theme", theme);
    document.documentElement.setAttribute("data-dashboard-theme", theme);
  }, [theme]);

  const fetchNotes = async () => {
    try {
      const res = await axios.get(`${API}/notes`, { headers });
      setNotes([...res.data].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)));
    } catch {
      showToast("Could not load notes", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchInsights = async () => {
    try {
      const res = await axios.get(`${API}/notes/insights`, { headers });
      setInsights(res.data);
    } catch {
      showToast("Could not load AI insights", "error");
    } finally {
      setInsightsLoading(false);
    }
  };

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  };

  const handleSave = async (data) => {
    try {
      let result;
      if (isNew) {
        const res = await axios.post(`${API}/notes`, data, { headers });
        result = res.data;
        setNotes((current) => [result, ...current]);
        setIsNew(false);
        setEditorNote(result);
        showToast("Note created");
      } else {
        const res = await axios.put(`${API}/notes/${editorNote._id}`, data, { headers });
        result = res.data;
        setNotes((current) =>
          [...current.map((note) => (note._id === result._id ? result : note))].sort(
            (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
          )
        );
        setEditorNote(result);
        showToast("Saved");
      }
      return result;
    } catch {
      showToast("Failed to save", "error");
      return null;
    }
  };

  const requestDelete = (noteOrId) => {
    if (!noteOrId) return;
    const note =
      typeof noteOrId === "string"
        ? notes.find((item) => item._id === noteOrId) || { _id: noteOrId, title: "Untitled note" }
        : noteOrId;
    setDeleteModalNote(note);
  };

  const closeDeleteModal = () => {
    if (deleting) return;
    setDeleteModalNote(null);
  };

  const handleDelete = async (id) => {
    setDeleting(true);
    try {
      await axios.delete(`${API}/notes/${id}`, { headers });
      setNotes((current) => current.filter((note) => note._id !== id));
      if (editorNote?._id === id) {
        setEditorOpen(false);
        setEditorNote(null);
      }
      setDeleteModalNote(null);
      showToast("Deleted");
    } catch {
      showToast("Delete failed", "error");
    } finally {
      setDeleting(false);
    }
  };

  const createShareLink = async (note) => {
    try {
      const res = await axios.put(`${API}/notes/share/${note._id}`, {}, { headers });
      const updatedNote = res.data;
      setNotes((current) =>
        [...current.map((item) => (item._id === updatedNote._id ? updatedNote : item))].sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        )
      );
      if (editorNote?._id === updatedNote._id) {
        setEditorNote(updatedNote);
      }
      setShareModalNote(updatedNote);
      return `${window.location.origin}/shared/${updatedNote.shareId}`;
    } catch (error) {
      throw error;
    }
  };

  const makeNotePrivate = async (note) => {
    try {
      const res = await axios.put(`${API}/notes/share/${note._id}/private`, {}, { headers });
      const updatedNote = res.data;
      setNotes((current) =>
        [...current.map((item) => (item._id === updatedNote._id ? updatedNote : item))].sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        )
      );
      if (editorNote?._id === updatedNote._id) {
        setEditorNote(updatedNote);
      }
      setShareModalNote(updatedNote);
      return updatedNote;
    } catch (error) {
      throw error;
    }
  };

  const handleStar = (note) => setNotes((current) => current.map((item) => (item._id === note._id ? { ...item, starred: !item.starred } : item)));
  const handleArchive = async (note) => {
    try {
      const res = await axios.put(
        `${API}/notes/${note._id}`,
        { archived: !note.archived },
        { headers }
      );
      const result = res.data;
      setNotes((current) =>
        [...current.map((item) => (item._id === result._id ? result : item))].sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        )
      );
      if (editorNote?._id === result._id) {
        setEditorNote(result);
      }
      showToast(result.archived ? "Note archived" : "Note restored");
    } catch {
      showToast("Archive update failed", "error");
    }
  };
  const openEditor = (note) => {
    setEditorNote(note);
    setIsNew(false);
    setEditorOpen(true);
  };
  const openNew = () => {
    setEditorNote(null);
    setIsNew(true);
    setEditorOpen(true);
    if (view === "home") {
      setView("all");
    }
  };
  const closeEditor = () => {
    setEditorOpen(false);
    setEditorNote(null);
    setIsNew(false);
  };
  const openShareModal = (note) => {
    if (!note) {
      showToast("Save the note first to share or export.", "error");
      return;
    }
    setShareModalNote(note);
  };
  const closeShareModal = () => setShareModalNote(null);
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };
  const toggleTheme = () => setTheme((current) => (current === "dark" ? "light" : "dark"));

  const allTags = [...new Set(notes.flatMap((note) => note.tags || []))];
  const pageMeta = VIEW_META[view];

  const renderCurrentView = () => {
    if (editorOpen) {
      return (
        <section className="db-editor-page">
          <NoteEditorPanel
            note={isNew ? null : editorNote}
            isNew={isNew}
            onSave={handleSave}
            onClose={closeEditor}
            token={token}
            availableTags={allTags}
            onOpenShareModal={openShareModal}
            onToggleArchive={handleArchive}
          />
        </section>
      );
    }

    if (view === "home") {
      return <WelcomePage userName={user.name || ""} onNew={openNew} />;
    }

    return (
      <section className="db-page-shell">
        <DashboardHero eyebrow={pageMeta.eyebrow} title={pageMeta.title} description={pageMeta.description} onAction={openNew} />
        <div className="db-page-card">
          {view === "all" && (
            <AllNotesPage
              notes={notes}
              onEdit={openEditor}
              onDelete={requestDelete}
              onStar={handleStar}
              onShare={openShareModal}
              onArchive={handleArchive}
              onNew={openNew}
              search={search}
              setSearch={setSearch}
              activeTag={activeTag}
              setActiveTag={setActiveTag}
              allTags={allTags}
              loading={loading}
            />
          )}
          {view === "starred" && <StarredPage notes={notes} onEdit={openEditor} onDelete={requestDelete} onStar={handleStar} onShare={openShareModal} onArchive={handleArchive} />}
          {view === "ai" && <AiInsightsPage notes={notes} insights={insights} loading={insightsLoading} />}
          {view === "archived" && <ArchivedPage notes={notes} onEdit={openEditor} onDelete={requestDelete} onArchive={handleArchive} />}
        </div>
      </section>
    );
  };

  return (
    <div className="db-root" data-theme={theme}>
      <Sidebar
        view={view}
        setView={setView}
        notes={notes}
        activeTag={activeTag}
        setActiveTag={setActiveTag}
        onNewNote={openNew}
        onLogout={logout}
        user={user}
      />

      <main className="db-main">
        {!editorOpen && view === "home" && (
          <button
            className="db-theme-toggle"
            onClick={toggleTheme}
            type="button"
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            <span className="db-theme-toggle-icon">
              {theme === "dark" ? <SunMedium size={16} /> : <MoonStar size={16} />}
            </span>
            <span className="db-theme-toggle-copy">
              <strong>{theme === "dark" ? "Light mode" : "Dark mode"}</strong>
              <small>{theme === "dark" ? "Brighten the dashboard" : "Return to the night view"}</small>
            </span>
          </button>
        )}
        <div className="db-scroll">{renderCurrentView()}</div>
      </main>

      <ShareExportModal
        note={shareModalNote}
        open={Boolean(shareModalNote)}
        onClose={closeShareModal}
        onCreateShareLink={createShareLink}
        onMakePrivate={makeNotePrivate}
        onToast={showToast}
      />

      <DeleteConfirmModal
        note={deleteModalNote}
        open={Boolean(deleteModalNote)}
        deleting={deleting}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
      />

      {toast && <div className={`db-toast ${toast.type}`}>{toast.msg}</div>}
    </div>
  );
}
