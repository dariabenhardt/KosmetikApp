import { useState, useMemo, useEffect} from "react";
import { db } from "./firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import ProductPage from "./ProductPage";

const CATEGORY_META = {
  makeup:     { label: "Make up",    icon: "💄", accent: "#c45c5c", bg: "#fdf0f0" },
  hautpflege: { label: "Hautpflege", icon: "🌿", accent: "#4a8c4a", bg: "#f0f7f0" },
  haarpflege: { label: "Haarpflege", icon: "✨", accent: "#7c5cbf", bg: "#f5f0fb" },
  haushalt:   { label: "Haushalt",   icon: "🏡", accent: "#b08a2a", bg: "#fdf8ec" },
};

function StarRating({ value }) {
  return (
    <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span
          key={s}
          style={{
            fontSize: "14px",
            color: s <= Math.round(value) ? "#f5a623" : "#ddd",
          }}
        >
          ★
        </span>
      ))}
      <span style={{ fontSize: "12px", color: "#888", marginLeft: "4px", fontFamily: "sans-serif" }}>
        {value.toFixed(1)}
      </span>
    </span>
  );
}

export default function CategoryPage({ categoryId = "makeup", onBack }) {
  const meta = CATEGORY_META[categoryId];
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("hersteller");
  const [sortDir, setSortDir] = useState("asc");
  const [minRating, setMinRating] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [products, setProducts] = useState([]);
  useEffect(() => {
  const fetchProducts = async () => {
       const q = query(collection(db, "products"), where("kategorie", "==", categoryId));
       const snapshot = await getDocs(q);
       setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
     };
     fetchProducts();
   }, [categoryId]);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const filtered = useMemo(() => {
    return products
      .filter((p) => {
        const q = search.toLowerCase();
        return (
          p.hersteller.toLowerCase().includes(q) ||
          p.produkt.toLowerCase().includes(q)
        ) && p.bewertung >= minRating;
      })
      .sort((a, b) => {
        let valA = a[sortKey];
        let valB = b[sortKey];
        if (typeof valA === "string") valA = valA.toLowerCase();
        if (typeof valB === "string") valB = valB.toLowerCase();
        if (valA < valB) return sortDir === "asc" ? -1 : 1;
        if (valA > valB) return sortDir === "asc" ? 1 : -1;
        return 0;
      });
  }, [products, search, sortKey, sortDir, minRating]);

  const SortIcon = ({ col }) => {
    if (sortKey !== col) return <span style={{ color: "#ccc" }}>⇅</span>;
    return <span style={{ color: meta.accent }}>{sortDir === "asc" ? "↑" : "↓"}</span>;
  };
if (selectedProduct) {
  return (
    <ProductPage
      product={selectedProduct}
      categoryId={categoryId}
      onBack={() => setSelectedProduct(null)}
    />
  );
}
  return (
    <div style={{ ...styles.root, backgroundColor: meta.bg }}>
      {/* Back Button */}
      <button style={styles.backBtn} onClick={onBack}>
        ← Zurück
      </button>

      {/* Page Header */}
      <div style={styles.pageHeader}>
        <span style={styles.icon}>{meta.icon}</span>
        <div>
          <p style={{ ...styles.eyebrow, color: meta.accent }}>Kategorie</p>
          <h1 style={styles.title}>{meta.label}</h1>
          <p style={styles.count}>{filtered.length} Produkte</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div style={styles.filterBar}>
        <div style={styles.searchWrapper}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            style={styles.searchInput}
            type="text"
            placeholder="Hersteller oder Produkt suchen..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button style={styles.clearBtn} onClick={() => setSearch("")}>✕</button>
          )}
        </div>

        <div style={styles.ratingFilter}>
          <label style={styles.ratingLabel}>Min. Bewertung:</label>
          <div style={styles.ratingButtons}>
            {[0, 3, 4, 4.5].map((r) => (
              <button
                key={r}
                style={{
                  ...styles.ratingBtn,
                  backgroundColor: minRating === r ? meta.accent : "#fff",
                  color: minRating === r ? "#fff" : "#555",
                  borderColor: minRating === r ? meta.accent : "#e0e0e0",
                }}
                onClick={() => setMinRating(r)}
              >
                {r === 0 ? "Alle" : `★ ${r}+`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              {[
                { key: "hersteller", label: "Hersteller" },
                { key: "produkt",    label: "Produkt" },
                { key: "bewertung",  label: "Bewertung" },
              ].map(({ key, label }) => (
                <th
                  key={key}
                  style={styles.th}
                  onClick={() => handleSort(key)}
                >
                  <span style={styles.thInner}>
                    {label} <SortIcon col={key} />
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={3} style={styles.emptyCell}>
                  Keine Produkte gefunden 🔍
                </td>
              </tr>
            ) : (
              filtered.map((p, i) => (
                <tr
                  key={p.id}
                  onClick={() => setSelectedProduct(p)}
                  style={{
                    ...styles.tr,
                    cursor: "pointer",
                    backgroundColor: i % 2 === 0 ? "#fff" : "#fafafa",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = meta.accent + "11";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = i % 2 === 0 ? "#fff" : "#fafafa";
                  }}
                >
                  <td style={styles.td}>
                    <span style={{ ...styles.herstellerBadge, borderColor: meta.accent + "44", color: meta.accent }}>
                      {p.hersteller}
                    </span>
                  </td>
                  <td style={{ ...styles.td, fontWeight: 500 }}>{p.produkt}</td>
                  <td style={styles.td}>
                    <StarRating value={p.bewertung} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  root: {
    minHeight: "100vh",
    padding: "40px 48px",
    fontFamily: "'Georgia', serif",
    color: "#1a1a1a",
  },
  backBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "14px",
    color: "#888",
    fontFamily: "sans-serif",
    letterSpacing: "0.05em",
    marginBottom: "32px",
    padding: 0,
    transition: "color 0.2s",
  },
  pageHeader: {
    display: "flex",
    alignItems: "center",
    gap: "24px",
    marginBottom: "40px",
  },
  icon: {
    fontSize: "52px",
  },
  eyebrow: {
    fontSize: "12px",
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    fontFamily: "sans-serif",
    marginBottom: "4px",
  },
  title: {
    fontSize: "42px",
    fontWeight: "normal",
    margin: "0 0 4px 0",
  },
  count: {
    fontSize: "13px",
    color: "#aaa",
    fontFamily: "sans-serif",
    margin: 0,
  },
  filterBar: {
    display: "flex",
    flexWrap: "wrap",
    gap: "16px",
    alignItems: "center",
    marginBottom: "28px",
  },
  searchWrapper: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#fff",
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    padding: "10px 16px",
    gap: "10px",
    flex: "1",
    minWidth: "220px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  },
  searchIcon: {
    fontSize: "14px",
  },
  searchInput: {
    border: "none",
    outline: "none",
    fontSize: "14px",
    fontFamily: "sans-serif",
    backgroundColor: "transparent",
    flex: 1,
    color: "#333",
  },
  clearBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#aaa",
    fontSize: "14px",
    padding: 0,
  },
  ratingFilter: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexWrap: "wrap",
  },
  ratingLabel: {
    fontSize: "13px",
    color: "#888",
    fontFamily: "sans-serif",
    whiteSpace: "nowrap",
  },
  ratingButtons: {
    display: "flex",
    gap: "8px",
  },
  ratingBtn: {
    border: "1px solid",
    borderRadius: "6px",
    padding: "6px 14px",
    fontSize: "12px",
    fontFamily: "sans-serif",
    cursor: "pointer",
    transition: "all 0.2s",
    whiteSpace: "nowrap",
  },
  tableWrapper: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    padding: "16px 20px",
    textAlign: "left",
    fontSize: "12px",
    fontFamily: "sans-serif",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "#999",
    borderBottom: "2px solid #f0f0f0",
    cursor: "pointer",
    userSelect: "none",
    backgroundColor: "#fafafa",
  },
  thInner: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  tr: {
    transition: "background-color 0.15s",
  },
  td: {
    padding: "16px 20px",
    fontSize: "14px",
    fontFamily: "sans-serif",
    borderBottom: "1px solid #f5f5f5",
    color: "#333",
  },
  herstellerBadge: {
    border: "1px solid",
    borderRadius: "4px",
    padding: "3px 10px",
    fontSize: "12px",
    fontWeight: 500,
    display: "inline-block",
  },
  emptyCell: {
    textAlign: "center",
    padding: "48px",
    color: "#bbb",
    fontFamily: "sans-serif",
    fontSize: "15px",
  },
};