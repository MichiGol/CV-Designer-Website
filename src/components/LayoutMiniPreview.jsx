export function LayoutMiniPreview({ id, accent }) {
  const shell = {
    width: "100%",
    height: 56,
    borderRadius: 5,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  };
  const white = "white";
  const layoutColor = `${accent}dd`;
  const lightBackground = "#f0f4f8";
  const darkBackground = "#0e1117";

  switch (id) {
    case "modernflow":
      return (
        <div style={shell}>
          <div style={{ flex: "0 0 30px", background: "#0f172a", borderBottomLeftRadius: 16, borderBottomRightRadius: 16, position: "relative" }}>
            <div style={{ background: `${accent}90`, borderRadius: 999, height: 4, left: 8, position: "absolute", top: 8, width: 28 }} />
          </div>
          <div style={{ flex: 1, background: white, display: "grid", gap: 0, gridTemplateColumns: "32% 1fr", marginTop: -2 }}>
            <div style={{ background: "#f8fafc", borderRight: "1px solid #e2e8f0", padding: "5px 4px" }}>
              <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 999, height: 7, marginBottom: 4 }} />
              <div style={{ background: `${accent}35`, borderRadius: 999, height: 3 }} />
            </div>
            <div style={{ padding: "5px 6px" }}>
              <div style={{ background: `${accent}55`, borderRadius: 999, height: 5, width: "52%" }} />
              <div style={{ background: "#cbd5e1", borderRadius: 999, height: 2, marginTop: 6, width: "70%" }} />
              <div style={{ background: "#e2e8f0", borderRadius: 999, height: 2, marginTop: 4, width: "80%" }} />
            </div>
          </div>
        </div>
      );
    case "darkdashboard":
      return (
        <div style={{ ...shell, background: "#020617", padding: 4, gap: 4 }}>
          <div style={{ background: "#0b1120", border: "1px solid #1e293b", borderRadius: 6, height: 16 }} />
          <div style={{ display: "grid", flex: 1, gap: 4, gridTemplateColumns: "1.2fr 0.9fr" }}>
            <div style={{ background: "#0b1120", border: "1px solid #1e293b", borderRadius: 6 }} />
            <div style={{ display: "grid", gap: 4 }}>
              <div style={{ background: "#0b1120", border: "1px solid #1e293b", borderRadius: 6 }} />
              <div style={{ background: "#0b1120", border: "1px solid #1e293b", borderRadius: 6 }} />
            </div>
          </div>
        </div>
      );
    case "editorialpurist":
      return (
        <div style={{ ...shell, background: white, padding: "5px 8px" }}>
          <div style={{ background: "#111827", height: 10, marginBottom: 5, width: "66%" }} />
          <div style={{ background: "#d1d5db", height: 1, marginBottom: 6 }} />
          <div style={{ display: "grid", gap: 4 }}>
            <div style={{ display: "grid", gap: 4, gridTemplateColumns: "1fr 3fr" }}>
              <div style={{ background: "#e5e7eb", height: 4 }} />
              <div style={{ background: "#f1f5f9", height: 4 }} />
            </div>
            <div style={{ display: "grid", gap: 4, gridTemplateColumns: "1fr 3fr" }}>
              <div style={{ background: "#e5e7eb", height: 4 }} />
              <div style={{ background: "#f1f5f9", height: 4 }} />
            </div>
          </div>
        </div>
      );
    case "terminal":
      return (
        <div style={{ ...shell, background: "#050505", padding: 4 }}>
          <div style={{ background: "#111111", border: "1px solid #252525", borderRadius: 6, display: "flex", flex: 1, flexDirection: "column", overflow: "hidden" }}>
            <div style={{ alignItems: "center", borderBottom: "1px solid #232323", display: "flex", gap: 4, height: 12, paddingLeft: 5 }}>
              <div style={{ background: "#ef4444", borderRadius: "50%", height: 4, width: 4 }} />
              <div style={{ background: "#f59e0b", borderRadius: "50%", height: 4, width: 4 }} />
              <div style={{ background: "#22c55e", borderRadius: "50%", height: 4, width: 4 }} />
            </div>
            <div style={{ display: "grid", gap: 3, padding: "5px 6px" }}>
              <div style={{ background: "#22c55e", borderRadius: 999, height: 2, width: "28%" }} />
              <div style={{ background: `${accent}80`, borderRadius: 999, height: 3, width: "52%" }} />
              <div style={{ background: "#374151", borderRadius: 999, height: 2, width: "82%" }} />
              <div style={{ background: "#06b6d4", borderRadius: 999, height: 2, width: "60%" }} />
            </div>
          </div>
        </div>
      );
    case "splittone":
      return (
        <div style={{ ...shell, flexDirection: "row" }}>
          <div style={{ background: `linear-gradient(180deg, ${layoutColor}, #111827)`, width: "40%" }} />
          <div style={{ background: white, display: "flex", flex: 1, flexDirection: "column", gap: 3, padding: "5px 6px" }}>
            <div style={{ background: "#111827", borderRadius: 2, height: 5, width: "44%" }} />
            <div style={{ background: "#dbeafe", borderRadius: 2, height: 2, width: "74%" }} />
            <div style={{ background: `${accent}45`, borderRadius: 2, height: 3, width: "32%" }} />
            <div style={{ background: "#e5e7eb", borderRadius: 2, height: 2, width: "84%" }} />
          </div>
        </div>
      );
    case "notionstyle":
      return (
        <div style={{ ...shell, background: white }}>
          <div style={{ background: `linear-gradient(90deg, ${layoutColor}, #dbeafe)`, height: 18, position: "relative" }}>
            <div style={{ background: "rgba(255,255,255,0.5)", borderRadius: "50%", height: 10, position: "absolute", right: 8, top: 4, width: 10 }} />
          </div>
          <div style={{ display: "grid", flex: 1, gap: 3, padding: "4px 6px" }}>
            <div style={{ background: white, border: "1px solid #e5e7eb", borderRadius: 5, height: 12, marginTop: -6, width: 12 }} />
            <div style={{ background: "#111827", borderRadius: 2, height: 5, width: "46%" }} />
            <div style={{ display: "flex", gap: 3 }}>
              <div style={{ background: "#f3f4f6", borderRadius: 999, height: 4, width: 18 }} />
              <div style={{ background: "#f3f4f6", borderRadius: 999, height: 4, width: 18 }} />
              <div style={{ background: "#f3f4f6", borderRadius: 999, height: 4, width: 18 }} />
            </div>
            <div style={{ background: "#f8fafc", border: "1px solid #e5e7eb", borderRadius: 4, height: 10 }} />
          </div>
        </div>
      );
    case "wave":
      return (
        <div style={shell}>
          <div style={{ flex: "0 0 32px", background: layoutColor, position: "relative" }}>
            <svg preserveAspectRatio="none" style={{ position: "absolute", bottom: 0, width: "100%", height: 8 }} viewBox="0 0 100 8">
              <path d="M0,8 C25,2 50,8 75,4 C90,1 100,5 100,3 L100,8 Z" fill={white} />
            </svg>
          </div>
          <div style={{ flex: 1, background: white, display: "flex", gap: 3, padding: "4px 6px" }}>
            <div style={{ flex: 1, background: "#f1f5f9", borderRadius: 3 }} />
            <div style={{ width: 28, background: lightBackground, borderRadius: 3 }} />
          </div>
        </div>
      );
    case "diagonal":
      return (
        <div style={shell}>
          <div style={{ flex: "0 0 32px", background: layoutColor, position: "relative" }}>
            <svg preserveAspectRatio="none" style={{ position: "absolute", bottom: 0, width: "100%", height: 8 }} viewBox="0 0 100 8">
              <path d="M0,8 L100,2 L100,8 Z" fill={white} />
            </svg>
          </div>
          <div style={{ flex: 1, background: white, display: "flex", gap: 3, padding: "4px 6px" }}>
            <div style={{ flex: 1, background: "#f1f5f9", borderRadius: 3 }} />
            <div style={{ width: 28, background: lightBackground, borderRadius: 3 }} />
          </div>
        </div>
      );
    case "arch":
      return (
        <div style={shell}>
          <div style={{ flex: "0 0 32px", background: layoutColor, position: "relative" }}>
            <svg preserveAspectRatio="none" style={{ position: "absolute", bottom: 0, width: "100%", height: 10 }} viewBox="0 0 100 10">
              <path d="M0,10 Q50,0 100,10 Z" fill={white} />
            </svg>
          </div>
          <div style={{ flex: 1, background: white, display: "flex", gap: 3, padding: "4px 6px" }}>
            <div style={{ flex: 1, background: "#f1f5f9", borderRadius: 3 }} />
            <div style={{ width: 28, background: lightBackground, borderRadius: 3 }} />
          </div>
        </div>
      );
    case "split":
      return (
        <div style={{ ...shell, flexDirection: "row" }}>
          <div style={{ width: "32%", background: layoutColor }} />
          <div style={{ flex: 1, background: white, display: "flex", flexDirection: "column", gap: 3, padding: "5px 6px" }}>
            <div style={{ height: 6, background: "#f1f5f9", borderRadius: 2 }} />
            <div style={{ height: 6, width: "80%", background: "#f1f5f9", borderRadius: 2 }} />
            <div style={{ height: 6, width: "90%", background: "#f1f5f9", borderRadius: 2 }} />
          </div>
        </div>
      );
    case "executive":
      return (
        <div style={{ ...shell, background: white, padding: "6px 8px", gap: 4 }}>
          <div style={{ height: 2, background: layoutColor, borderRadius: 1 }} />
          <div style={{ height: 7, width: "70%", background: "#e2e8f0", borderRadius: 2 }} />
          <div style={{ height: 1, background: "#e2e8f0" }} />
          <div style={{ display: "flex", gap: 6, flex: 1 }}>
            <div style={{ width: 30, background: `${layoutColor}30`, borderRadius: 2 }} />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
              <div style={{ height: 5, background: "#f1f5f9", borderRadius: 2 }} />
              <div style={{ height: 5, width: "80%", background: "#f1f5f9", borderRadius: 2 }} />
            </div>
          </div>
        </div>
      );
    case "card":
      return (
        <div style={{ ...shell, background: lightBackground, padding: 5, gap: 4 }}>
          <div style={{ height: 12, background: white, borderRadius: 4, borderTop: `2px solid ${layoutColor}` }} />
          <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3 }}>
            <div style={{ background: white, borderRadius: 3 }} />
            <div style={{ background: white, borderRadius: 3 }} />
          </div>
        </div>
      );
    case "darkmode":
      return (
        <div style={{ ...shell, background: darkBackground }}>
          <div style={{ height: 20, background: "#161b22", borderBottom: "1px solid #21262d", display: "flex", alignItems: "center", paddingLeft: 6, gap: 4 }}>
            <div style={{ width: 14, height: 14, borderRadius: "50%", background: `${accent}30`, border: `1px solid ${accent}` }} />
            <div style={{ flex: 1, height: 4, background: `${accent}40`, borderRadius: 2 }} />
          </div>
          <div style={{ flex: 1, display: "grid", gridTemplateColumns: "30% 1fr" }}>
            <div style={{ background: "#161b22", borderRight: "1px solid #21262d" }} />
            <div style={{ padding: "4px 6px", display: "flex", flexDirection: "column", gap: 3 }}>
              <div style={{ height: 4, background: `${accent}30`, borderRadius: 2 }} />
              <div style={{ height: 4, width: "80%", background: "#21262d", borderRadius: 2 }} />
            </div>
          </div>
        </div>
      );
    case "editorial":
      return (
        <div style={{ ...shell, background: white, padding: "5px 8px", gap: 3 }}>
          <div style={{ height: 12, background: "#000", borderRadius: 1, opacity: 0.85 }} />
          <div style={{ height: 1, background: "#000" }} />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 3, paddingTop: 3 }}>
            <div style={{ height: 4, background: "#f1f5f9", borderRadius: 2 }} />
            <div style={{ height: 4, width: "88%", background: "#f1f5f9", borderRadius: 2 }} />
            <div style={{ height: 1, background: "#e2e8f0" }} />
          </div>
        </div>
      );
    default:
      return <div style={{ ...shell, background: "#f1f5f9" }} />;
  }
}
