import { useEffect, useState } from "react";
import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";

const CATEGORY_META = {
  makeup:     { label: "Make up",    icon: "💄", accent: "#c45c5c", bg: "#fdf0f0" },
  hautpflege: { label: "Hautpflege", icon: "🌿", accent: "#4a8c4a", bg: "#f0f7f0" },
  haarpflege: { label: "Haarpflege", icon: "✨", accent: "#7c5cbf", bg: "#f5f0fb" },
  haushalt:   { label: "Haushalt",   icon: "🏡", accent: "#b08a2a", bg: "#fdf8ec" },
};

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

export default function ProductPage({ product, categoryId, onBack }) {
  const meta = CATEGORY_META[categoryId] || CATEGORY_META.makeup;

  const idealoUrl = `https://www.idealo.de/preisvergleich/MainSearchProductCategory.html?q=${encodeURIComponent(product.hersteller + " " + product.produkt)}`;

  return (
    <div style={{ ...styles.root, backgroundColor: meta.bg }}>
      <button style={styles.backBtn} onClick={onBack}>← Zurück</button>
      <div style={styles.card}>
        <div style={{ ...styles.badge, backgroundColor: meta.accent + "22", color: meta.accent }}>
          {meta.icon} {meta.label}
        </div>
        <h1 style={styles.title}>{product.produkt}</h1>
        <p style={{ ...styles.hersteller, color: meta.accent }}>{product.hersteller}</p>
        <div style={styles.divider} />
        <div style={styles.infoGrid}>
          <div style={styles.infoBlock}>
            <p style={styles.infoLabel}>Bewertung</p>
            <StarRating value={product.bewertung} />
          </div>
          {product.preis !== undefined && product.preis !== null && (
            <div style={styles.infoBlock}>
              <p style={styles.infoLabel}>Preis</p>
              <p style={{ ...styles.infoValue, fontSize: "22px", fontWeight: "bold" }}>
                {typeof product.preis === "number"
                  ? product.preis.toFixed(2).replace(".", ",") + " €"
                  : product.preis}
              </p>
            </div>
          )}
          <div style={styles.infoBlock}>
            <p style={styles.infoLabel}>Kategorie</p>
            <p style={styles.infoValue}>{meta.label}</p>
          </div>
        </div>
        <div style={styles.divider} />
        <div style={styles.linkSection}>
          <p style={styles.linkLabel}>Preisvergleich</p>
          
            <a href={idealoUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ ...styles.idealoBtn, backgroundColor: meta.accent }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.85"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            🔍 Auf idealo.de suchen ↗
          </a>
          <p style={styles.linkHint}>Sucht nach: <em>"{product.hersteller} {product.produkt}"</em></p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  root: { minHeight: "100vh", padding: "40px 48px", fontFamily: "'Georgia', serif", color: "#1a1a1a" },
  backBtn: { background: "none", border: "none", cursor: "pointer", fontSize: "14px", color: "#888", fontFamily: "sans-serif", marginBottom: "32px", padding: 0 },
  card: { backgroundColor: "#fff", borderRadius: "16px", padding: "48px", maxWidth: "640px", boxShadow: "0 8px 40px rgba(0,0,0,0.08)" },
  badge: { display: "inline-block", borderRadius: "6px", padding: "5px 14px", fontSize: "13px", fontFamily: "sans-serif", marginBottom: "20px" },
  title: { fontSize: "clamp(24px, 4vw, 38px)", fontWeight: "normal", lineHeight: 1.2, marginBottom: "8px" },
  hersteller: { fontSize: "16px", fontFamily: "sans-serif", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "28px" },
  divider: { height: "1px", backgroundColor: "#f0f0f0", margin: "28px 0" },
  infoGrid: { display: "flex", flexWrap: "wrap", gap: "32px" },
  infoBlock: { display: "flex", flexDirection: "column", gap: "8px" },
  infoLabel: { fontSize: "11px", fontFamily: "sans-serif", letterSpacing: "0.15em", textTransform: "uppercase", color: "#aaa", margin: 0 },
  infoValue: { fontSize: "16px", fontFamily: "sans-serif", color: "#333", margin: 0 },
  linkSection: { display: "flex", flexDirection: "column", gap: "12px" },
  linkLabel: { fontSize: "11px", fontFamily: "sans-serif", letterSpacing: "0.15em", textTransform: "uppercase", color: "#aaa", margin: 0 },
  idealoBtn: { display: "inline-flex", alignItems: "center", gap: "10px", color: "#fff", textDecoration: "none", padding: "14px 28px", borderRadius: "8px", fontSize: "15px", fontFamily: "sans-serif", fontWeight: 500, transition: "opacity 0.2s, transform 0.2s", alignSelf: "flex-start" },
  linkHint: { fontSize: "12px", fontFamily: "sans-serif", color: "#bbb", margin: 0 },
};