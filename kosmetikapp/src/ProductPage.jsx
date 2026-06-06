import { useState } from "react";
import { db } from "./firebase";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
 
const CATEGORY_META = {
  makeup:     { label: "Make up",    icon: "💄", accent: "#c45c5c", bg: "#fdf0f0" },
  hautpflege: { label: "Hautpflege", icon: "🌿", accent: "#4a8c4a", bg: "#f0f7f0" },
  haarpflege: { label: "Haarpflege", icon: "✨", accent: "#7c5cbf", bg: "#f5f0fb" },
  haushalt:   { label: "Haushalt",   icon: "🏡", accent: "#b08a2a", bg: "#fdf8ec" },
};
 
const CATEGORIES = [
  { id: "makeup",     label: "Make up",    icon: "💄" },
  { id: "hautpflege", label: "Hautpflege", icon: "🌿" },
  { id: "haarpflege", label: "Haarpflege", icon: "✨" },
  { id: "haushalt",   label: "Haushalt",   icon: "🏡" },
];
 
function StarRating({ value }) {
  return (
    <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} style={{ fontSize: "20px", color: s <= Math.round(value) ? "#f5a623" : "#ddd" }}>★</span>
      ))}
      <span style={{ fontSize: "15px", color: "#888", fontFamily: "sans-serif", marginLeft: "4px" }}>
        {value?.toFixed(1)}
      </span>
    </span>
  );
}
 
export default function ProductPage({ product, categoryId, onBack, onDeleted }) {
  const meta = CATEGORY_META[categoryId] || CATEGORY_META.makeup;
 
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [status, setStatus] = useState(null);
  const [form, setForm] = useState({
    hersteller: product.hersteller,
    produkt: product.produkt,
    bewertung: product.bewertung,
    preis: product.preis ?? "",
    kategorie: product.kategorie,
  });
  const [current, setCurrent] = useState(product);
 
  const idealoUrl = `https://www.idealo.de/preisvergleich/MainSearchProductCategory.html?q=${encodeURIComponent(current.hersteller + " " + current.produkt)}`;
 
  const handleSave = async () => {
    setStatus("loading");
    try {
      const docRef = doc(db, "products", product.id);
      const updated = {
        hersteller: form.hersteller.trim(),
        produkt: form.produkt.trim(),
        bewertung: parseFloat(form.bewertung),
        preis: form.preis !== "" ? parseFloat(form.preis) : null,
        kategorie: form.kategorie,
      };
      await updateDoc(docRef, updated);
      setCurrent({ ...current, ...updated });
      setEditing(false);
      setStatus("saved");
      setTimeout(() => setStatus(null), 3000);
    } catch (e) {
      console.error(e);
      setStatus("error");
    }
  };
 
  const handleDelete = async () => {
    setStatus("loading");
    try {
      await deleteDoc(doc(db, "products", product.id));
      onDeleted();
    } catch (e) {
      console.error(e);
      setStatus("error");
      setConfirmDelete(false);
    }
  };
 
  return (
    <div style={{ ...styles.root, backgroundColor: meta.bg }}>
      <button style={styles.backBtn} onClick={onBack}>← Zurück</button>
 
      <div style={styles.card}>
 
        {/* Kategorie Badge */}
        <div style={{ ...styles.badge, backgroundColor: meta.accent + "22", color: meta.accent }}>
          {meta.icon} {meta.label}
        </div>
 
        {/* Aktionsleiste */}
        <div style={styles.actionBar}>
          {!editing ? (
            <>
              <button
                style={{ ...styles.actionBtn, borderColor: meta.accent, color: meta.accent }}
                onClick={() => { setEditing(true); setStatus(null); }}
              >
                ✏️ Bearbeiten
              </button>
              <button
                style={{ ...styles.actionBtn, borderColor: "#e05c5c", color: "#e05c5c" }}
                onClick={() => setConfirmDelete(true)}
              >
                🗑️ Löschen
              </button>
            </>
          ) : (
            <>
              <button
                style={{ ...styles.actionBtn, backgroundColor: meta.accent, color: "#fff", borderColor: meta.accent }}
                onClick={handleSave}
                disabled={status === "loading"}
              >
                {status === "loading" ? "Speichern..." : "✅ Speichern"}
              </button>
              <button
                style={{ ...styles.actionBtn, borderColor: "#aaa", color: "#aaa" }}
                onClick={() => { setEditing(false); setForm({ hersteller: current.hersteller, produkt: current.produkt, bewertung: current.bewertung, preis: current.preis ?? "", kategorie: current.kategorie }); }}
              >
                ✕ Abbrechen
              </button>
            </>
          )}
        </div>
 
        {/* Erfolgsmeldung */}
        {status === "saved" && (
          <div style={styles.successBox}>✅ Änderungen gespeichert!</div>
        )}
        {status === "error" && (
          <div style={styles.errorBox}>❌ Fehler. Bitte nochmal versuchen.</div>
        )}
 
        {/* Lösch-Bestätigung */}
        {confirmDelete && (
          <div style={styles.confirmBox}>
            <p style={styles.confirmText}>Produkt wirklich löschen? Das kann nicht rückgängig gemacht werden.</p>
            <div style={{ display: "flex", gap: "12px" }}>
              <button style={styles.deleteFinalBtn} onClick={handleDelete}>
                Ja, löschen
              </button>
              <button style={{ ...styles.actionBtn, borderColor: "#aaa", color: "#aaa" }} onClick={() => setConfirmDelete(false)}>
                Abbrechen
              </button>
            </div>
          </div>
        )}
 
        {/* Anzeige oder Bearbeitung */}
        {!editing ? (
          <>
            <h1 style={styles.title}>{current.produkt}</h1>
            <p style={{ ...styles.hersteller, color: meta.accent }}>{current.hersteller}</p>
            <div style={styles.divider} />
            <div style={styles.infoGrid}>
              <div style={styles.infoBlock}>
                <p style={styles.infoLabel}>Bewertung</p>
                <StarRating value={current.bewertung} />
              </div>
              {current.preis !== undefined && current.preis !== null && (
                <div style={styles.infoBlock}>
                  <p style={styles.infoLabel}>Preis</p>
                  <p style={{ ...styles.infoValue, fontSize: "22px", fontWeight: "bold" }}>
                    {typeof current.preis === "number"
                      ? current.preis.toFixed(2).replace(".", ",") + " €"
                      : current.preis}
                  </p>
                </div>
              )}
              <div style={styles.infoBlock}>
                <p style={styles.infoLabel}>Kategorie</p>
                <p style={styles.infoValue}>{meta.label}</p>
              </div>
            </div>
          </>
        ) : (
          <div style={styles.editForm}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Kategorie</label>
              <div style={styles.categoryGrid}>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    style={{
                      ...styles.catBtn,
                      backgroundColor: form.kategorie === cat.id ? "#1a1a1a" : "#fff",
                      color: form.kategorie === cat.id ? "#fff" : "#555",
                      borderColor: form.kategorie === cat.id ? "#1a1a1a" : "#e0e0e0",
                    }}
                    onClick={() => setForm(f => ({ ...f, kategorie: cat.id }))}
                  >
                    {cat.icon} {cat.label}
                  </button>
                ))}
              </div>
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Hersteller</label>
              <input style={styles.input} value={form.hersteller} onChange={e => setForm(f => ({ ...f, hersteller: e.target.value }))} />
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Produkt</label>
              <input style={styles.input} value={form.produkt} onChange={e => setForm(f => ({ ...f, produkt: e.target.value }))} />
            </div>
            <div style={{ display: "flex", gap: "16px" }}>
              <div style={{ ...styles.fieldGroup, flex: 1 }}>
                <label style={styles.label}>Bewertung (1–5)</label>
                <input style={styles.input} type="number" min="1" max="5" step="0.1" value={form.bewertung} onChange={e => setForm(f => ({ ...f, bewertung: e.target.value }))} />
              </div>
              <div style={{ ...styles.fieldGroup, flex: 1 }}>
                <label style={styles.label}>Preis (€)</label>
                <input style={styles.input} type="number" min="0" step="0.01" value={form.preis} onChange={e => setForm(f => ({ ...f, preis: e.target.value }))} />
              </div>
            </div>
          </div>
        )}
 
        {!editing && (
          <>
            <div style={styles.divider} />
            <div style={styles.linkSection}>
              <p style={styles.linkLabel}>Preisvergleich</p>
              <a
                href={idealoUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ ...styles.idealoBtn, backgroundColor: meta.accent }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.85"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                🔍 Auf idealo.de suchen ↗
              </a>
              <p style={styles.linkHint}>Sucht nach: <em>"{current.hersteller} {current.produkt}"</em></p>
            </div>
          </>
        )}
 
      </div>
    </div>
  );
}
 
const styles = {
  root: { minHeight: "100vh", padding: "40px 48px", fontFamily: "'Georgia', serif", color: "#1a1a1a" },
  backBtn: { background: "none", border: "none", cursor: "pointer", fontSize: "14px", color: "#888", fontFamily: "sans-serif", marginBottom: "32px", padding: 0 },
  card: { backgroundColor: "#fff", borderRadius: "16px", padding: "48px", maxWidth: "640px", boxShadow: "0 8px 40px rgba(0,0,0,0.08)", display: "flex", flexDirection: "column", gap: "20px" },
  badge: { display: "inline-block", borderRadius: "6px", padding: "5px 14px", fontSize: "13px", fontFamily: "sans-serif", alignSelf: "flex-start" },
  actionBar: { display: "flex", gap: "12px", flexWrap: "wrap" },
  actionBtn: { background: "none", border: "1.5px solid", borderRadius: "8px", padding: "9px 20px", fontSize: "13px", fontFamily: "sans-serif", cursor: "pointer", transition: "all 0.2s" },
  title: { fontSize: "clamp(24px, 4vw, 38px)", fontWeight: "normal", lineHeight: 1.2, margin: 0 },
  hersteller: { fontSize: "16px", fontFamily: "sans-serif", letterSpacing: "0.08em", textTransform: "uppercase", margin: 0 },
  divider: { height: "1px", backgroundColor: "#f0f0f0" },
  infoGrid: { display: "flex", flexWrap: "wrap", gap: "32px" },
  infoBlock: { display: "flex", flexDirection: "column", gap: "8px" },
  infoLabel: { fontSize: "11px", fontFamily: "sans-serif", letterSpacing: "0.15em", textTransform: "uppercase", color: "#aaa", margin: 0 },
  infoValue: { fontSize: "16px", fontFamily: "sans-serif", color: "#333", margin: 0 },
  linkSection: { display: "flex", flexDirection: "column", gap: "12px" },
  linkLabel: { fontSize: "11px", fontFamily: "sans-serif", letterSpacing: "0.15em", textTransform: "uppercase", color: "#aaa", margin: 0 },
  idealoBtn: { display: "inline-flex", alignItems: "center", gap: "10px", color: "#fff", textDecoration: "none", padding: "14px 28px", borderRadius: "8px", fontSize: "15px", fontFamily: "sans-serif", fontWeight: 500, transition: "opacity 0.2s, transform 0.2s", alignSelf: "flex-start" },
  linkHint: { fontSize: "12px", fontFamily: "sans-serif", color: "#bbb", margin: 0 },
  editForm: { display: "flex", flexDirection: "column", gap: "20px" },
  fieldGroup: { display: "flex", flexDirection: "column", gap: "8px" },
  label: { fontSize: "12px", fontFamily: "sans-serif", letterSpacing: "0.12em", textTransform: "uppercase", color: "#888" },
  input: { border: "1.5px solid #e0e0e0", borderRadius: "8px", padding: "12px 16px", fontSize: "15px", fontFamily: "sans-serif", color: "#1a1a1a", outline: "none", backgroundColor: "#fafafa" },
  categoryGrid: { display: "flex", flexWrap: "wrap", gap: "10px" },
  catBtn: { border: "1.5px solid", borderRadius: "8px", padding: "8px 14px", fontSize: "13px", fontFamily: "sans-serif", cursor: "pointer", transition: "all 0.2s" },
  confirmBox: { backgroundColor: "#fdf0f0", border: "1px solid #e0a0a0", borderRadius: "10px", padding: "20px", display: "flex", flexDirection: "column", gap: "14px" },
  confirmText: { fontSize: "14px", fontFamily: "sans-serif", color: "#c45c5c", margin: 0 },
  deleteFinalBtn: { backgroundColor: "#e05c5c", color: "#fff", border: "none", borderRadius: "8px", padding: "10px 20px", fontSize: "13px", fontFamily: "sans-serif", cursor: "pointer" },
  successBox: { backgroundColor: "#f0faf0", border: "1px solid #a0c9a0", borderRadius: "8px", padding: "12px 16px", fontSize: "14px", fontFamily: "sans-serif", color: "#3a7a3a" },
  errorBox: { backgroundColor: "#fdf0f0", border: "1px solid #e0a0a0", borderRadius: "8px", padding: "12px 16px", fontSize: "14px", fontFamily: "sans-serif", color: "#c45c5c" },
};
 
















