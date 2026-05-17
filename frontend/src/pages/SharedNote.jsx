import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function timeAgo(date) {
  const s = (Date.now() - new Date(date)) / 1000;
  if (s < 60)    return "just now";
  if (s < 3600)  return `${Math.floor(s/60)}m ago`;
  if (s < 86400) return `${Math.floor(s/3600)}h ago`;
  return new Date(date).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" });
}

export default function SharedNote() {
  const { shareId } = useParams();
  const [note,    setNote]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  useEffect(() => {
    axios.get(`${API}/notes/shared/${shareId}`)
      .then(r => setNote(r.data))
      .catch(() => setError("This note doesn't exist or is no longer public."))
      .finally(() => setLoading(false));
  }, [shareId]);

  if (loading) return (
    <div style={styles.center}>
      <div style={styles.spinner}/>
    </div>
  );

  if (error) return (
    <div style={styles.center}>
      <div style={styles.errorBox}>
        <div style={styles.errorIcon}>🔒</div>
        <h2 style={styles.errorTitle}>Note not found</h2>
        <p style={styles.errorSub}>{error}</p>
        <Link to="/" style={styles.homeLink}>← Back to Peblo Workplace</Link>
      </div>
    </div>
  );

  return (
    <div style={styles.page}>
      {/* Background blobs */}
      <div style={styles.blob1}/>
      <div style={styles.blob2}/>

      <div style={styles.wrap}>
        {/* Header */}
        <div style={styles.header}>
          <Link to="/" style={styles.brand}>
            <div style={styles.brandMark}>P</div>
            <span style={styles.brandText}>Peblo <em style={{color:"#f5c842",fontStyle:"normal"}}>Workplace</em></span>
          </Link>
          <div style={styles.headerRight}>
            <span style={styles.publicBadge}>🔗 Public Note</span>
          </div>
        </div>

        {/* Note Content */}
        <article style={styles.article}>
          {/* Tags */}
          {note.tags?.length > 0 && (
            <div style={styles.tagRow}>
              {note.tags.map(t => (
                <span key={t} style={styles.tag}>#{t}</span>
              ))}
            </div>
          )}

          <h1 style={styles.noteTitle}>{note.title}</h1>
          <p style={styles.noteMeta}>Last updated {timeAgo(note.updatedAt)}</p>

          <div style={styles.divider}/>

          <div style={styles.noteBody}>
            {note.content ? (
              note.content.split("\n").map((line, i) => (
                line.trim() ? (
                  <p key={i} style={styles.notePara}>{line}</p>
                ) : (
                  <br key={i}/>
                )
              ))
            ) : (
              <p style={{color:"rgba(255,255,255,0.3)",fontStyle:"italic"}}>This note has no content.</p>
            )}
          </div>

          {/* AI Summary section */}
          {note.aiSummary && (
            <div style={styles.aiBox}>
              <div style={styles.aiBoxHeader}>
                <span style={styles.aiIcon}>✦</span>
                <span style={styles.aiLabel}>AI Summary</span>
              </div>
              <p style={styles.aiText}>{note.aiSummary}</p>

              {note.actionItems?.length > 0 && (
                <div style={{marginTop:"1rem"}}>
                  <div style={{...styles.aiLabel, marginBottom:"0.5rem"}}>→ Action Items</div>
                  <ul style={styles.actionList}>
                    {note.actionItems.map((item,i) => (
                      <li key={i} style={styles.actionItem}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {note.suggestedTitle && (
                <div style={{marginTop:"1rem"}}>
                  <span style={styles.aiLabel}>✦ Suggested Title: </span>
                  <span style={{color:"#f5c842",fontStyle:"italic"}}>"{note.suggestedTitle}"</span>
                </div>
              )}
            </div>
          )}
        </article>

        <footer style={styles.footer}>
          <p>Created with <Link to="/" style={{color:"#9b5de5",textDecoration:"none"}}>Peblo Workplace</Link></p>
        </footer>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0d0814",
    color: "#fff",
    fontFamily: "'DM Sans', sans-serif",
    position: "relative",
    overflow: "hidden",
  },
  blob1: {
    position: "fixed", top: "-200px", left: "-150px",
    width: "600px", height: "600px", borderRadius: "50%",
    background: "radial-gradient(circle, rgba(107,63,160,0.5), transparent)",
    filter: "blur(100px)", pointerEvents: "none", zIndex: 0,
  },
  blob2: {
    position: "fixed", bottom: "-100px", right: "-100px",
    width: "500px", height: "500px", borderRadius: "50%",
    background: "radial-gradient(circle, rgba(245,200,66,0.15), transparent)",
    filter: "blur(80px)", pointerEvents: "none", zIndex: 0,
  },
  wrap: {
    position: "relative", zIndex: 1,
    maxWidth: "760px", margin: "0 auto",
    padding: "0 1.5rem 4rem",
  },
  header: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "1.5rem 0", borderBottom: "1px solid rgba(155,93,229,0.15)",
    marginBottom: "2.5rem",
  },
  brand: {
    display: "flex", alignItems: "center", gap: "0.6rem", textDecoration: "none",
  },
  brandMark: {
    width: "32px", height: "32px", borderRadius: "8px",
    background: "linear-gradient(135deg, #f5c842, #9b5de5)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "0.85rem", color: "#0d0814",
  },
  brandText: {
    fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "#fff",
  },
  headerRight: {},
  publicBadge: {
    fontSize: "0.75rem", padding: "0.3rem 0.8rem",
    background: "rgba(155,93,229,0.12)", border: "1px solid rgba(155,93,229,0.25)",
    borderRadius: "20px", color: "rgba(255,255,255,0.6)",
  },
  article: {
    background: "rgba(30,20,53,0.5)", border: "1px solid rgba(155,93,229,0.18)",
    borderRadius: "16px", padding: "2.5rem", backdropFilter: "blur(12px)",
    marginBottom: "2rem",
  },
  tagRow: { display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "1.2rem" },
  tag: {
    fontSize: "0.72rem", padding: "0.2rem 0.6rem",
    background: "rgba(155,93,229,0.12)", border: "1px solid rgba(155,93,229,0.22)",
    borderRadius: "5px", color: "rgba(155,93,229,0.9)",
  },
  noteTitle: {
    fontFamily: "'Syne', sans-serif", fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
    fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.2, marginBottom: "0.5rem",
  },
  noteMeta: { fontSize: "0.8rem", color: "rgba(255,255,255,0.35)", marginBottom: "1.5rem" },
  divider: { height: "1px", background: "rgba(155,93,229,0.15)", marginBottom: "1.5rem" },
  noteBody: { display: "flex", flexDirection: "column", gap: "0.2rem" },
  notePara: { fontSize: "1rem", lineHeight: 1.8, color: "rgba(255,255,255,0.82)" },
  aiBox: {
    marginTop: "2rem", padding: "1.5rem",
    background: "rgba(245,200,66,0.05)", border: "1px solid rgba(245,200,66,0.18)",
    borderRadius: "12px",
  },
  aiBoxHeader: { display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.8rem" },
  aiIcon: { color: "#f5c842", fontSize: "0.9rem" },
  aiLabel: { fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#f5c842" },
  aiText: { fontSize: "0.9rem", color: "rgba(255,255,255,0.75)", lineHeight: 1.7 },
  actionList: { listStyle: "none", display: "flex", flexDirection: "column", gap: "0.4rem" },
  actionItem: {
    fontSize: "0.88rem", color: "rgba(255,255,255,0.7)", paddingLeft: "1rem",
    position: "relative",
  },
  footer: {
    textAlign: "center", fontSize: "0.8rem",
    color: "rgba(255,255,255,0.2)", paddingTop: "1rem",
  },
  center: {
    minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
    background: "#0d0814", fontFamily: "'DM Sans', sans-serif",
  },
  spinner: {
    width: "36px", height: "36px",
    border: "2px solid rgba(155,93,229,0.2)", borderTopColor: "#9b5de5",
    borderRadius: "50%", animation: "spin 0.7s linear infinite",
  },
  errorBox: {
    textAlign: "center", padding: "3rem 2rem",
    background: "rgba(30,20,53,0.7)", border: "1px solid rgba(155,93,229,0.2)",
    borderRadius: "16px", maxWidth: "420px",
  },
  errorIcon: { fontSize: "3rem", marginBottom: "1rem" },
  errorTitle: { fontFamily: "'Syne', sans-serif", fontSize: "1.4rem", marginBottom: "0.5rem", color: "#fff" },
  errorSub: { fontSize: "0.9rem", color: "rgba(255,255,255,0.5)", marginBottom: "1.5rem" },
  homeLink: { color: "#9b5de5", textDecoration: "none", fontSize: "0.88rem" },
};
