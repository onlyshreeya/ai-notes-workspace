import {
  Archive,
  Hash,
  Home,
  LogOut,
  NotebookText,
  Plus,
  Search,
  Sparkles,
  Star,
} from "lucide-react";
import "../styles/sidebar.css";

const NAV_ITEMS = [
  { id: "home", label: "Home", icon: Home },
  { id: "all", label: "All Notes", icon: NotebookText },
  { id: "starred", label: "Starred", icon: Star },
  { id: "ai", label: "AI Insights", icon: Sparkles },
  { id: "archived", label: "Archived", icon: Archive, hideCount: true },
];

export default function Sidebar({ view, setView, notes, activeTag, setActiveTag, onNewNote, onLogout, user }) {
  const allTags = [...new Set(notes.flatMap((note) => note.tags || []))];
  const aiCount = notes.filter((note) => note.aiSummary && !note.archived).length;
  const archivedCount = notes.filter((note) => note.archived).length;
  const starredCount = notes.filter((note) => note.starred && !note.archived).length;
  const activeCount = notes.filter((note) => !note.archived).length;
  const initial = user?.name?.[0]?.toUpperCase() || "U";

  const counts = {
    all: activeCount,
    starred: starredCount,
    ai: aiCount,
    archived: archivedCount,
  };

  return (
    <aside className="pbl-sidebar">
      <div className="pbl-sb-brand">
        <div className="pbl-sb-mark">P</div>
        <div>
          <div className="pbl-sb-name">Peblo</div>
          <div className="pbl-sb-subn">Workplace</div>
        </div>
      </div>

      <div className="pbl-sb-new-zone">
        <button className="pbl-sb-new-btn" onClick={onNewNote}>
          <Plus size={14} />
          New Note
        </button>
      </div>

      <nav className="pbl-sb-nav">
        <p className="pbl-sb-sec-label">Workspace</p>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={`pbl-sb-item ${view === item.id ? "active" : ""}`}
              onClick={() => {
                setView(item.id);
                setActiveTag(null);
              }}
            >
              <span className="pbl-sb-item-icon">
                <Icon size={16} />
              </span>
              <span className="pbl-sb-item-label">{item.label}</span>
              {!item.hideCount && counts[item.id] > 0 && <span className="pbl-sb-item-count">{counts[item.id]}</span>}
            </button>
          );
        })}

        {allTags.length > 0 && (
          <>
            <p className="pbl-sb-sec-label pbl-sb-sec-label--tags">Tags</p>
            {allTags.slice(0, 14).map((tag) => (
              <button
                key={tag}
                className={`pbl-sb-item ${activeTag === tag && view === "all" ? "active" : ""}`}
                onClick={() => {
                  setActiveTag((current) => (current === tag ? null : tag));
                  setView("all");
                }}
              >
                <span className="pbl-sb-item-icon pbl-hash">
                  <Hash size={14} />
                </span>
                <span className="pbl-sb-item-label">{tag}</span>
              </button>
            ))}
          </>
        )}
      </nav>

      <div className="pbl-sb-search-zone">
        <button className="pbl-sb-search-btn" onClick={() => setView("all")}>
          <Search size={14} />
          Search notes
          <span className="pbl-sb-search-kbd">Ctrl K</span>
        </button>
      </div>

      {aiCount > 0 && (
        <button className="pbl-sb-ai-zone" onClick={() => setView("ai")}>
          <div className="pbl-sb-ai-orb">
            <Sparkles size={14} />
          </div>
          <div>
            <div className="pbl-sb-ai-title">
              {aiCount} AI {aiCount === 1 ? "Summary" : "Summaries"}
            </div>
            <div className="pbl-sb-ai-sub">View AI insights</div>
          </div>
        </button>
      )}

      <div className="pbl-sb-user-zone">
        <div className="pbl-sb-user-card">
          <div className="pbl-sb-user-av">{initial}</div>
          <div className="pbl-sb-user-info">
            <div className="pbl-sb-user-name">{user?.name || "User"}</div>
            <div className="pbl-sb-user-email">{user?.email || ""}</div>
          </div>
          <button className="pbl-sb-logout" onClick={onLogout} title="Sign out">
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
}
