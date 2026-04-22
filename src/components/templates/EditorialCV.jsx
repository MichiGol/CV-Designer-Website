import { SkillsBlock } from "./shared.jsx";

export function EditorialCV({ cv, st, displayFont, bodyFont, pageMode = "preview" }) {
  const { accent, size, skillDisplay } = st;
  const personal = cv.personal;
  const isExportPage = pageMode === "export";

  function EdSec({ title, children }) {
    return (
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 0, borderTop: "1px solid #000", paddingTop: 10, marginBottom: 16 }}>
          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: accent, fontFamily: bodyFont, paddingTop: 1 }}>
            {title}
          </span>
          <div />
        </div>
        {children}
      </div>
    );
  }

  function EdTL({ title, sub, period, extra, body }) {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 20, marginBottom: 18, alignItems: "start" }}>
        <div>
          <div style={{ fontSize: size * 0.8, color: accent, fontFamily: bodyFont, fontWeight: 700 }}>{period}</div>
          {extra ? <div style={{ fontSize: size * 0.75, color: "#999", fontFamily: bodyFont, marginTop: 2 }}>{extra}</div> : null}
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: size * 1.05, color: "#0a0a0a", fontFamily: displayFont, marginBottom: 2 }}>{title}</div>
          <div style={{ color: "#555", fontSize: size * 0.88, fontFamily: bodyFont, fontWeight: 500, marginBottom: 5, fontStyle: "italic" }}>{sub}</div>
          {body ? <p style={{ margin: 0, color: "#444", fontSize: size * 0.88, lineHeight: 1.7, fontFamily: bodyFont }}>{body}</p> : null}
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "white", padding: "48px 52px 52px", ...(isExportPage ? { minHeight: "100%", boxSizing: "border-box" } : {}) }}>
      <div style={{ borderBottom: "3px solid #000", paddingBottom: 16, marginBottom: 6 }}>
        <h1 style={{ fontFamily: "'Bebas Neue','Cormorant Garamond',Georgia,serif", fontSize: size * 5.5, fontWeight: 400, color: "#000", margin: 0, letterSpacing: "0.04em", lineHeight: 0.9, textTransform: "uppercase" }}>
          {personal.firstName} {personal.lastName}
        </h1>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #000", paddingBottom: 10, marginBottom: 36 }}>
        <div style={{ color: accent, fontSize: size * 0.95, fontFamily: bodyFont, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>{personal.title}</div>
        <div style={{ display: "flex", gap: 16 }}>{[personal.email, personal.phone, personal.website].filter(Boolean).map((text, index) => <span key={index} style={{ color: "#666", fontSize: size * 0.79, fontFamily: bodyFont }}>{text}</span>)}</div>
      </div>
      {personal.summary ? <div style={{ marginBottom: 36 }}><p style={{ margin: 0, color: "#222", lineHeight: 1.9, fontSize: size * 1.08, fontFamily: displayFont, fontStyle: "italic", letterSpacing: "0.01em", borderLeft: `4px solid ${accent}`, paddingLeft: 20 }}>{personal.summary}</p></div> : null}
      {cv.experience.length ? <EdSec title="Berufserfahrung">{cv.experience.map(experience => <EdTL key={experience.id} body={experience.description} period={experience.start && experience.end ? `${experience.start} – ${experience.end}` : ""} sub={experience.company} title={experience.role} />)}</EdSec> : null}
      {cv.education.length ? <EdSec title="Ausbildung">{cv.education.map(education => <EdTL key={education.id} body={education.description} extra={education.grade ? `Ø ${education.grade}` : ""} period={education.start && education.end ? `${education.start} – ${education.end}` : ""} sub={education.institution} title={education.degree} />)}</EdSec> : null}
      {cv.skills.length || cv.languages.length || cv.hobbies.length ? (
        <EdSec title="Kenntnisse">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 32 }}>
            {cv.skills.length ? <div><div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#999", fontFamily: bodyFont, marginBottom: 12 }}>Fähigkeiten</div><SkillsBlock accent={accent} display={skillDisplay} skills={cv.skills} /></div> : null}
            {cv.languages.length ? <div><div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#999", fontFamily: bodyFont, marginBottom: 12 }}>Sprachen</div>{cv.languages.map(language => <div key={language.id} style={{ marginBottom: 8 }}><div style={{ fontWeight: 700, fontSize: size * 0.88, color: "#222", fontFamily: bodyFont }}>{language.name}</div><div style={{ color: "#888", fontSize: size * 0.8, fontFamily: bodyFont }}>{language.level}</div></div>)}</div> : null}
            {cv.hobbies.length ? <div><div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#999", fontFamily: bodyFont, marginBottom: 12 }}>Interessen</div><div style={{ color: "#555", fontSize: size * 0.88, fontFamily: bodyFont, lineHeight: 1.9 }}>{cv.hobbies.join(" · ")}</div></div> : null}
          </div>
        </EdSec>
      ) : null}
    </div>
  );
}
