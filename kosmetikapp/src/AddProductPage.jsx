import { useState } from "react";
import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";

const CATEGORIES = [
  { id: "makeup",     label: "Make up",    icon: "💄" },
  { id: "hautpflege", label: "Hautpflege", icon: "🌿" },
  { id: "haarpflege", label: "Haarpflege", icon: "✨" },
  { id: "haushalt",   label: "Haushalt",   icon: "🏡" },
];

const EMPTY = { hersteller: "", produkt: "", bewertung: "", preis: "", kategorie: "makeup" };

export default function AddProductPage({ onBack }) {
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState(null); // null | "loading" | "success" | "error"
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.hersteller.trim()) e.hersteller = "Pflichtfeld";
    if (!form.produkt.trim()) e.produkt = "Pflichtfeld";
    const b = parseFloat(form.bewertung);
    if (!form.bewertung || isNaN(b) || b < 1 || b > 5) e.bewertung = "Zahl zwischen 1 und 5";
    if (form.preis && isNaN(parseFloat(form.preis))) e.preis = "Ungültige Zahl";
    return e;
  };

  const handleChange = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
    setErrors(e => ({ ...e, [field]: undefined }));
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }

    setStatus("loading");
    try {
      await addDoc(collection(db, "products"), {
        hersteller: form.hersteller.trim(),
        produkt: form.produkt.trim(),
        bewertung: parseFloat(form.bewertung),
        preis: form.preis ? parseFloat(form.preis) : null,
        kategorie: form.kategorie,
      });
      setStatus("success");
      setForm(EMPTY);
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  const selectedCat = CATEGORIES.find(c => c.id === form.kategorie);

  return (
    <div style={styles.root}>
      <div style={styles.bgBlob1} />
      <div style={styles.bgBlob2} />

      <button style={styles.backBtn} onClick={onBack}>← Zurück</button>

      <div style={styles.container}>
        <div style={styles.header}>
          <p style={styles.eyebrow}>Datenbank</p>
          <h1 style={styles.title}>Neues Produkt <span style={styles.titleAccent}>hinzufügen</span></h1>
        </div>

        <div style={styles.card}>

          {/* Kategorie Auswahl */}
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
                  onClick={() => handleChange("kategorie", cat.id)}
                >
                  {cat.icon} {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Hersteller */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Hersteller *</label>
            <input
              style={{ ...styles.input, borderColor: errors.hersteller ? "#e05c5c" : "#e0e0e0" }}
              type="text"
              placeholder="z.B. Charlotte Tilbury"
              value={form.hersteller}
              onChange={e => handleChange("hersteller", e.target.value)}
            />
            {errors.hersteller && <p style={styles.errorMsg}>{errors.hersteller}</p>}
          </div>

          {/* Produkt */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Produkt *</label>
            <input
              style={{ ...styles.input, borderColor: errors.produkt ? "#e05c5c" : "#e0e0e0" }}
              type="text"
              placeholder="z.B. Pillow Talk Lippenstift"
              value={form.produkt}
              onChange={e => handleChange("produkt", e.target.value)}
            />
            {errors.produkt && <p style={styles.errorMsg}>{errors.produkt}</p>}
          </div>

          {/* Bewertung + Preis nebeneinander */}
          <div style={styles.row}>
            <div style={{ ...styles.fieldGroup, flex: 1 }}>
              <label style={styles.label}>Bewertung * (1–5)</label>
              <input
                style={{ ...styles.input, borderColor: errors.bewertung ? "#e05c5c" : "#e0e0e0" }}
                type="number"
                min="1" max="5" step="0.1"
                placeholder="z.B. 4.5"
                value={form.bewertung}
                onChange={e => handleChange("bewertung", e.target.value)}
              />
              {errors.bewertung && <p style={styles.errorMsg}>{errors.bewertung}</p>}
            </div>

            <div style={{ ...styles.fieldGroup, flex: 1 }}>
              <label style={styles.label}>Preis (€)</label>
              <input
                style={{ ...styles.input, borderColor: errors.preis ? "#e05c5c" : "#e0e0e0" }}
                type="number"
                min="0" step="0.01"
                placeholder="z.B. 29.99"
                value={form.preis}
                onChange={e => handleChange("preis", e.target.value)}
              />
              {errors.preis && <p style={styles.errorMsg}>{errors.preis}</p>}
            </div>
          </div>

          {/* Status */}
          {status === "success" && (
            <div style={styles.successBox}>
              ✅ Produkt erfolgreich gespeichert!
            </div>
          )}
          {status === "error" && (
            <div style={styles.errorBox}>
              ❌ Fehler beim Speichern. Bitte nochmal versuchen.
            </div>
          )}

          {/* Submit */}
          <button
            style={{
              ...styles.submitBtn,
              opacity: status === "loading" ? 0.6 : 1,
              cursor: status === "loading" ? "not-allowed" : "pointer",
            }}
            onClick={handleSubmit}
            disabled={status === "loading"}
          >
            {status === "loading" ? "Speichern..." : `${selectedCat.icon} Produkt speichern`}
          </button>

        </div>
      </div>
    </div>
  );
}

const styles = {
  root: { minHeight: "100vh", backgroundColor: "#faf9f7", fontFamily: "'Georgia', serif", color: "#1a1a1a", padding: "40px 48px", position: "relative", overflowX: "hidden" },
  bgBlob1: { position: "fixed", top: "-120px", right: "-120px", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, #f5c2c2 0%, transparent 70%)", opacity: 0.4, pointerEvents: "none", zIndex: 0 },
  bgBlob2: { position: "fixed", bottom: "-100px", left: "-100px", width: "350px", height: "350px", borderRadius: "50%", background: "radial-gradient(circle, #c9b8e8 0%, transparent 70%)", opacity: 0.3, pointerEvents: "none", zIndex: 0 },
  backBtn: { background: "none", border: "none", cursor: "pointer", fontSize: "14px", color: "#888", fontFamily: "sans-serif", marginBottom: "32px", padding: 0, position: "relative", zIndex: 1 },
  container: { maxWidth: "620px", position: "relative", zIndex: 1 },
  header: { marginBottom: "32px" },
  eyebrow: { fontSize: "12px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#999", fontFamily: "sans-serif", marginBottom: "8px" },
  title: { fontSize: "clamp(28px, 5vw, 42px)", fontWeight: "normal", lineHeight: 1.2, margin: 0 },
  titleAccent: { fontStyle: "italic", color: "#c45c5c" },
  card: { backgroundColor: "#fff", borderRadius: "16px", padding: "40px", boxShadow: "0 8px 40px rgba(0,0,0,0.07)", display: "flex", flexDirection: "column", gap: "24px" },
  fieldGroup: { display: "flex", flexDirection: "column", gap: "8px" },
  label: { fontSize: "12px", fontFamily: "sans-serif", letterSpacing: "0.12em", textTransform: "uppercase", color: "#888" },
  input: { border: "1.5px solid", borderRadius: "8px", padding: "12px 16px", fontSize: "15px", fontFamily: "sans-serif", color: "#1a1a1a", outline: "none", transition: "border-color 0.2s", backgroundColor: "#fafafa" },
  categoryGrid: { display: "flex", flexWrap: "wrap", gap: "10px" },
  catBtn: { border: "1.5px solid", borderRadius: "8px", padding: "10px 18px", fontSize: "14px", fontFamily: "sans-serif", cursor: "pointer", transition: "all 0.2s" },
  row: { display: "flex", gap: "16px", flexWrap: "wrap" },
  submitBtn: { backgroundColor: "#1a1a1a", color: "#fff", border: "none", borderRadius: "8px", padding: "16px 32px", fontSize: "15px", fontFamily: "sans-serif", fontWeight: 500, letterSpacing: "0.05em", transition: "opacity 0.2s", alignSelf: "flex-start" },
  successBox: { backgroundColor: "#f0faf0", border: "1px solid #a0c9a0", borderRadius: "8px", padding: "14px 18px", fontSize: "14px", fontFamily: "sans-serif", color: "#3a7a3a" },
  errorBox: { backgroundColor: "#fdf0f0", border: "1px solid #e0a0a0", borderRadius: "8px", padding: "14px 18px", fontSize: "14px", fontFamily: "sans-serif", color: "#c45c5c" },
  errorMsg: { fontSize: "12px", color: "#e05c5c", fontFamily: "sans-serif", margin: 0 },
};