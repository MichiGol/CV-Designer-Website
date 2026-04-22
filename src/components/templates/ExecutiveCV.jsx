import { SkillsBlock } from "./shared.jsx";

export function ExecutiveCV({ cv, st, displayFont, bodyFont, pageMode = "preview" }) {
  const { accent, size, skillDisplay } = st;
  const personal = cv.personal;
  const isExportPage = pageMode === "export";

  function ExecSec({ title, children }) {
    return (
      <div style={{ marginBottom: 30 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: accent, fontFamily: bodyFont }}>
            {title}
          </span>
          <div style={{ flex: 1, height: 1, background: `${accent}15` }} />
        </div>
        {children}
      </div>
    );
  }

  function ExecTL({ title, sub, period, extra, body }) {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "148px 1fr", gap: 24, marginBottom: 20, alignItems: "start" }}>
        <div style={{ paddingTop: 3 }}>
          <div style={{ fontSize: size * 0.78, color: accent, fontFamily: bodyFont, fontWeight: 600, lineHeight: 1.4 }}>{period}</div>
          {extra ? <div style={{ fontSize: size * 0.75, color: "#94a3b8", fontFamily: bodyFont, marginTop: 2 }}>{extra}</div> : null}
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: size * 1.02, color: "#0f172a", fontFamily: displayFont, marginBottom: 3 }}>{title}</div>
          <div style={{ color: "#475569", fontSize: size * 0.88, fontFamily: bodyFont, fontWeight: 500, marginBottom: 6 }}>{sub}</div>
          {body ? <p style={{ margin: 0, color: "#64748b", fontSize: size * 0.88, lineHeight: 1.68, fontFamily: bodyFont }}>{body}</p> : null}
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "white", padding: "52px 56px 56px", ...(isExportPage ? { minHeight: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column" } : {}) }}>
      <div style={{ height: 3, background: accent, marginBottom: 36, borderRadius: 2 }} />
      <div style={isExportPage ? { display: "flex", flexDirection: "column", flex: 1 } : undefined}>
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontFamily: displayFont, fontSize: size * 2.9, fontWeight: 700, color: "#080808", margin: "0 0 6px", letterSpacing: "-0.025em", lineHeight: 1.05 }}>
            {personal.firstName} {personal.lastName}
          </h1>
          {personal.title ? <div style={{ color: "#475569", fontSize: size * 0.98, fontFamily: bodyFont, fontWeight: 300, letterSpacing: "0.06em", textTransform: "uppercase" }}>{personal.title}</div> : null}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 0", marginBottom: 32 }}>
          {[personal.email, personal.phone, personal.address, personal.website]
            .filter(Boolean)
            .flatMap((text, index, array) => [
              <span key={`text-${index}`} style={{ color: "#64748b", fontSize: size * 0.8, fontFamily: bodyFont }}>
                {text}
              </span>,
              index < array.length - 1 ? (
                <span key={`sep-${index}`} style={{ color: "#cbd5e1", fontSize: size * 0.8, fontFamily: bodyFont, padding: "0 10px" }}>
                  ·
                </span>
              ) : null,
            ])}
        </div>
        <div style={{ height: 1, background: "#e2e8f0", marginBottom: 4 }} />
        <div style={{ height: 1, background: `${accent}30`, marginBottom: 36 }} />
        {personal.summary ? <ExecSec title="Profil"><p style={{ margin: 0, color: "#334155", lineHeight: 1.85, fontSize: size * 0.94, fontFamily: displayFont, fontStyle: "italic", letterSpacing: "0.01em" }}>{personal.summary}</p></ExecSec> : null}
        {cv.experience.length ? <ExecSec title="Berufserfahrung">{cv.experience.map(experience => <ExecTL key={experience.id} body={experience.description} period={experience.start && experience.end ? `${experience.start} – ${experience.end}` : ""} sub={experience.company} title={experience.role} />)}</ExecSec> : null}
        {cv.education.length ? <ExecSec title="Ausbildung">{cv.education.map(education => <ExecTL key={education.id} body={education.description} extra={education.grade ? `Ø ${education.grade}` : ""} period={education.start && education.end ? `${education.start} – ${education.end}` : ""} sub={education.institution} title={education.degree} />)}</ExecSec> : null}
        {cv.skills.length || cv.languages.length ? (
          <ExecSec title="Kenntnisse & Sprachen">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 36 }}>
              {cv.skills.length ? <div><div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#94a3b8", fontFamily: bodyFont, marginBottom: 10 }}>Fähigkeiten</div><SkillsBlock accent={accent} display={skillDisplay} skills={cv.skills} /></div> : null}
              {cv.languages.length ? <div><div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#94a3b8", fontFamily: bodyFont, marginBottom: 10 }}>Sprachen</div>{cv.languages.map(language => <div key={language.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, paddingBottom: 8, borderBottom: "1px solid #f1f5f9" }}><span style={{ fontWeight: 600, fontSize: size * 0.88, color: "#334155", fontFamily: bodyFont }}>{language.name}</span><span style={{ color: "#94a3b8", fontSize: size * 0.82, fontFamily: bodyFont }}>{language.level}</span></div>)}</div> : null}
            </div>
          </ExecSec>
        ) : null}
        {cv.hobbies.length ? <ExecSec title="Interessen"><div style={{ color: "#64748b", fontSize: size * 0.88, fontFamily: bodyFont }}>{cv.hobbies.join("  ·  ")}</div></ExecSec> : null}
      </div>
      <div style={{ height: 1, background: "#e2e8f0", marginTop: isExportPage ? "auto" : 36 }} />
    </div>
  );
}
