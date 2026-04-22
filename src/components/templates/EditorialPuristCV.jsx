import { SkillsBlock } from "./shared.jsx";

const defaultDisplayFont = "'Source Serif 4', 'Cormorant Garamond', Georgia, serif";
const defaultBodyFont = "'Source Serif 4', 'Cormorant Garamond', Georgia, serif";

function SectionTitle({ children, displayFont }) {
  return (
    <div
      style={{
        color: "#6b7280",
        fontFamily: displayFont,
        fontSize: 12,
        fontStyle: "italic",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
      }}
    >
      {children}
    </div>
  );
}

function PuristRow({ bodyFont, children, left, withDivider = false }) {
  return (
    <div
      className="editorialpurist-row"
      style={{
        borderTop: withDivider ? "1px solid #e5e7eb" : "none",
        display: "grid",
        gap: 24,
        gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
        paddingTop: withDivider ? 18 : 0,
      }}
    >
      <div style={{ color: "#9ca3af", fontFamily: bodyFont, fontSize: 15 }}>{left}</div>
      <div style={{ gridColumn: "span 3 / span 3", minWidth: 0 }}>{children}</div>
    </div>
  );
}

export function EditorialPuristCV({
  accent,
  bodyFont = defaultBodyFont,
  data,
  displayFont = defaultDisplayFont,
  pageMode = "preview",
  size = 13,
  skillDisplay = "chips",
}) {
  const isExportPage = pageMode === "export";
  const extraDetailText = [
    data.languages.length ? data.languages.map(language => `${language.name} (${language.level})`).join(", ") : "",
    data.hobbies.length ? data.hobbies.join(", ") : "",
  ].filter(Boolean).join(". ");
  const contactText = [data.contact.email, data.contact.phone, data.contact.location, data.contact.website].filter(Boolean).join(" - ");

  return (
    <div style={{ background: "#ffffff", ...(isExportPage ? { boxSizing: "border-box", minHeight: "100%" } : {}) }}>
      <div className="editorialpurist-shell" style={{ margin: "0 auto", maxWidth: 880, padding: "56px 58px 68px" }}>
        <header style={{ marginBottom: 34 }}>
          <h1 style={{ color: "#111827", fontFamily: displayFont, fontSize: size * 4.55, fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 0.92, margin: 0 }}>
            {data.name}
          </h1>
          {data.title ? <p style={{ color: accent, fontFamily: displayFont, fontSize: size * 1.55, fontStyle: "italic", margin: "12px 0 14px" }}>{data.title}</p> : null}
          {contactText ? <p style={{ color: "#9ca3af", fontFamily: bodyFont, fontSize: 15, lineHeight: 1.7, margin: 0 }}>{contactText}</p> : null}
        </header>

        {data.summary ? (
          <section style={{ marginBottom: 26 }}>
            <PuristRow bodyFont={bodyFont} left={<SectionTitle displayFont={displayFont}>Profil</SectionTitle>} withDivider>
              <p style={{ color: "#374151", fontFamily: bodyFont, fontSize: size * 1.2, lineHeight: 1.85, margin: 0 }}>{data.summary}</p>
            </PuristRow>
          </section>
        ) : null}

        {data.experience.length ? (
          <section style={{ marginBottom: 28 }}>
            <PuristRow bodyFont={bodyFont} left={<SectionTitle displayFont={displayFont}>Erfahrung</SectionTitle>} withDivider>
              <div />
            </PuristRow>
            <div style={{ display: "grid", gap: 28, marginTop: 22 }}>
              {data.experience.map(item => (
                <PuristRow bodyFont={bodyFont} key={item.id} left={item.period || " "}>
                  <h3 style={{ color: "#111827", fontFamily: displayFont, fontSize: size * 1.55, fontWeight: 700, margin: 0 }}>{item.role}</h3>
                  {item.company ? <div style={{ color: "#6b7280", fontFamily: bodyFont, fontSize: size * 1.04, fontStyle: "italic", marginTop: 4 }}>{item.company}</div> : null}
                  {item.description ? <p style={{ color: "#4b5563", fontFamily: bodyFont, fontSize: size * 1.02, lineHeight: 1.8, margin: "10px 0 0" }}>{item.description}</p> : null}
                </PuristRow>
              ))}
            </div>
          </section>
        ) : null}

        {data.education.length ? (
          <section style={{ marginBottom: 28 }}>
            <PuristRow bodyFont={bodyFont} left={<SectionTitle displayFont={displayFont}>Ausbildung</SectionTitle>} withDivider>
              <div />
            </PuristRow>
            <div style={{ display: "grid", gap: 28, marginTop: 22 }}>
              {data.education.map(item => (
                <PuristRow bodyFont={bodyFont} key={item.id} left={item.period || " "}>
                  <h3 style={{ color: "#111827", fontFamily: displayFont, fontSize: size * 1.45, fontWeight: 700, margin: 0 }}>{item.degree}</h3>
                  {item.institution ? <div style={{ color: "#6b7280", fontFamily: bodyFont, fontSize: size * 1.02, fontStyle: "italic", marginTop: 4 }}>{item.institution}</div> : null}
                  {item.details || item.note ? <p style={{ color: "#4b5563", fontFamily: bodyFont, fontSize: size, lineHeight: 1.8, margin: "10px 0 0" }}>{[item.details, item.note].filter(Boolean).join(". ")}</p> : null}
                </PuristRow>
              ))}
            </div>
          </section>
        ) : null}

        {data.skills.length ? (
          <section>
            <PuristRow bodyFont={bodyFont} left={<SectionTitle displayFont={displayFont}>Kompetenzen</SectionTitle>} withDivider>
              <div style={{ paddingTop: 4 }}>
                <SkillsBlock accent={accent} display={skillDisplay} skills={data.skills} />
              </div>
            </PuristRow>
          </section>
        ) : null}

        {extraDetailText ? (
          <section style={{ marginTop: 28 }}>
            <PuristRow bodyFont={bodyFont} left={<SectionTitle displayFont={displayFont}>Weitere</SectionTitle>} withDivider>
              <p style={{ color: "#374151", fontFamily: bodyFont, fontSize: size * 1.04, lineHeight: 1.9, margin: 0 }}>{extraDetailText}.</p>
            </PuristRow>
          </section>
        ) : null}
      </div>
    </div>
  );
}
