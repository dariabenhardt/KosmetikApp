import { useState } from "react";
import CategoryPage from "./CategoryPage";
import AddProductPage from "./AddProductPage";

const categories = [
  { id: "makeup",     label: "Make up",    icon: "💄", description: "Lippenstifte, Foundation & mehr", color: "#e8a0a0", accent: "#c45c5c" },
  { id: "hautpflege", label: "Hautpflege", icon: "🌿", description: "Seren, Cremes & Masken",          color: "#a0c9a0", accent: "#4a8c4a" },
  { id: "haarpflege", label: "Haarpflege", icon: "✨", description: "Shampoos, Öle & Treatments",      color: "#c9b8e8", accent: "#7c5cbf" },
  { id: "haushalt",   label: "Haushalt",   icon: "🏡", description: "Reinigung & Pflege fürs Zuhause", color: "#f0d9a0", accent: "#b08a2a" },
];

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(null);
  const [showAddProduct, setShowAddProduct] = useState(false);

  if (currentPage) {
    return <CategoryPage categoryId={currentPage} onBack={() => setCurrentPage(null)} />;
  }

  if (showAddProduct) {
  return <AddProductPage onBack={() => setShowAddProduct(false)} />;
}

  return (
    <div style={styles.root}>
      <div style={styles.bgBlob1} />
      <div style={styles.bgBlob2} />
      <header style={styles.header}>
        <div style={styles.logo}>✦ Beautifier</div>
      </header>
      <section style={styles.hero}>
        <p style={styles.heroEyebrow}>Willkommen zurück 👋</p>
        <h1 style={styles.heroTitle}>Genau das, was du brauchst<br /><span style={styles.heroAccent}>Schönheit & Pflege</span></h1>
      </section>
      <section style={styles.categoriesSection}>
        <button
  style={styles.addBtn}
  onClick={() => setShowAddProduct(true)}
>
  + Produkt hinzufügen
</button>
        <div style={styles.categoriesHeader}>
          <h2 style={styles.categoriesTitle}>Kategorien</h2>
          <div style={styles.divider} />
        </div>
        <div style={styles.grid}>
          {categories.map((cat) => (
            <div
              key={cat.id}
              style={{ ...styles.card, borderColor: activeCategory === cat.id ? cat.accent : "transparent" }}
              onMouseEnter={(e) => { setActiveCategory(cat.id); e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = `0 20px 40px ${cat.color}88`; }}
              onMouseLeave={(e) => { setActiveCategory(null); e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.06)"; }}
              onClick={() => setCurrentPage(cat.id)}
            >
              <div style={{ ...styles.cardIcon, backgroundColor: cat.color + "44" }}>
                <span style={{ fontSize: "24px" }}>{cat.icon}</span>
              </div>
              <div style={{ ...styles.cardDot, backgroundColor: cat.accent }} />
              <h3 style={styles.cardTitle}>{cat.label}</h3>
              <p style={styles.cardDesc}>{cat.description}</p>
              <span style={{ ...styles.cardArrow, color: cat.accent }}>→</span>
            </div>
          ))}
        </div>
      </section>
      <footer style={styles.footer}><p>✦ Beautifier — Schönheit für jeden Tag</p></footer>
    </div>
  );
}

const styles = {
  root: { minHeight: "100vh", backgroundColor: "#faf9f7", fontFamily: "'Georgia', serif", color: "#1a1a1a", overflowX: "hidden", position: "relative" },
  bgBlob1: { position: "fixed", top: "-120px", right: "-120px", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, #f5c2c2 0%, transparent 70%)", opacity: 0.4, pointerEvents: "none", zIndex: 0 },
  bgBlob2: { position: "fixed", bottom: "-100px", left: "-100px", width: "350px", height: "350px", borderRadius: "50%", background: "radial-gradient(circle, #c9b8e8 0%, transparent 70%)", opacity: 0.3, pointerEvents: "none", zIndex: 0 },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 48px", position: "relative", zIndex: 1 },
  logo: { fontSize: "24px", fontWeight: "bold", letterSpacing: "0.1em", color: "#c45c5c" },
  nav: { display: "flex", gap: "32px" },
  navItem: { fontSize: "14px", cursor: "pointer", color: "#555" },
  hero: { padding: "60px 48px 40px", maxWidth: "700px", position: "relative", zIndex: 1 },
  heroEyebrow: { fontSize: "14px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#888", marginBottom: "16px" },
  heroTitle: { fontSize: "clamp(36px, 6vw, 64px)", fontWeight: "normal", lineHeight: 1.15, marginBottom: "20px" },
  heroAccent: { fontStyle: "italic", color: "#c45c5c" },
  heroSubtitle: { fontSize: "16px", color: "#666", lineHeight: 1.7, maxWidth: "480px", marginBottom: "32px" },
  heroCta: { backgroundColor: "#1a1a1a", color: "#faf9f7", border: "none", padding: "14px 32px", fontSize: "14px", cursor: "pointer", borderRadius: "2px" },
  categoriesSection: { padding: "40px 48px 60px", position: "relative", zIndex: 1 },
  categoriesHeader: { marginBottom: "36px" },
  addBtn: { backgroundColor: "#1a1a1a", color: "#fff", border: "none", borderRadius: "6px", padding: "10px 20px", fontSize: "13px", fontFamily: "sans-serif", cursor: "pointer", letterSpacing: "0.05em" },
  categoriesTitle: { fontSize: "13px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#999", marginBottom: "12px", fontFamily: "sans-serif", fontWeight: 400 },
  divider: { width: "40px", height: "2px", backgroundColor: "#c45c5c" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "20px" },
  card: { backgroundColor: "#fff", borderRadius: "12px", padding: "28px 24px", cursor: "pointer", border: "2px solid transparent", boxShadow: "0 4px 20px rgba(0,0,0,0.06)", transition: "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.2s" },
  cardIcon: { width: "52px", height: "52px", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" },
  cardDot: { width: "6px", height: "6px", borderRadius: "50%", marginBottom: "10px" },
  cardTitle: { fontSize: "18px", fontWeight: "normal", marginBottom: "8px" },
  cardDesc: { fontSize: "13px", color: "#999", lineHeight: 1.5, fontFamily: "sans-serif", marginBottom: "20px" },
  cardArrow: { fontSize: "18px", fontWeight: "bold", display: "block" },
  footer: { textAlign: "center", padding: "32px", fontSize: "13px", color: "#bbb", fontFamily: "sans-serif" },
};