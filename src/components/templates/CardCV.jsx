import { normalizePhotoConfig, PhotoFrame, SkillsBlock, useResumeTemplateCopy } from "./shared.jsx";

export function CardCV({ cv, st, displayFont, bodyFont, pageMode = "preview" }) {
  const copy = useResumeTemplateCopy();
  const { accent, size, skillDisplay } = st;
  const personal = cv.personal;
  const photo = normalizePhotoConfig(personal);
  const isExportPage = pageMode === "export";
  const card = { background: "white", borderRadius: 10, boxShadow: "0 1px 3px rgba(0,0,0,0.06),0 4px 14px rgba(0,0,0,0.06)", padding: "22px 24px", marginBottom: 10 };

  function CardSecT({ children }) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <div style={{ width: 3, height: 14, background: accent, borderRadius: 2, flexShrink: 0 }} />
        <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: accent, fontFamily: bodyFont }}>
          {children}
        </span>
      </div>
    );
  }

  return (
    <div style={{ background: "#f0f4f8", padding: 22, ...(isExportPage ? { boxSizing: "border-box" } : {}) }}>
      <div style={{ ...card, borderTop: `4px solid ${accent}`, display: "flex", alignItems: "center", gap: 22, marginBottom: 10 }}>
        <PhotoFrame
          frameStyle={{ width: 82, height: 82, borderRadius: 10, flexShrink: 0 }}
          photo={photo}
          placeholder={<div style={{ width: "100%", height: "100%", background: `${accent}16`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, fontWeight: 700, color: accent, fontFamily: displayFont }}>{(personal.firstName?.[0] ?? "") + (personal.lastName?.[0] ?? "")}</div>}
          trackForCanvas
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ margin: "0 0 3px", fontSize: size * 1.95, fontWeight: 800, color: "#0f172a", fontFamily: displayFont, letterSpacing: "-0.02em", lineHeight: 1.1 }}>{personal.firstName} {personal.lastName}</h1>
          {personal.title ? <div style={{ color: accent, fontSize: size * 0.9, fontWeight: 600, fontFamily: bodyFont, marginBottom: 10 }}>{personal.title}</div> : null}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "3px 16px" }}>{[personal.email, personal.phone, personal.address, personal.website].filter(Boolean).map((text, index) => <span key={index} style={{ color: "#64748b", fontSize: size * 0.79, fontFamily: bodyFont, display: "flex", alignItems: "center", gap: 5 }}><span style={{ width: 3, height: 3, borderRadius: "50%", background: `${accent}50` }} />{text}</span>)}</div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <div>
          {personal.summary ? <div style={card}><CardSecT>{copy.profile}</CardSecT><p style={{ margin: 0, color: "#475569", lineHeight: 1.73, fontSize: size * 0.9, fontFamily: bodyFont }}>{personal.summary}</p></div> : null}
          {cv.experience.length ? <div style={card}><CardSecT>{copy.experience}</CardSecT>{cv.experience.map((experience, index) => <div className="cv-pdf-avoid-break" key={experience.id}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 4, marginBottom: 2 }}><span style={{ fontWeight: 700, fontSize: size * 0.94, color: "#0f172a", fontFamily: displayFont }}>{experience.role}</span><span style={{ fontSize: size * 0.74, color: "#94a3b8", fontFamily: bodyFont, flexShrink: 0 }}>{experience.start && experience.end ? `${experience.start}–${experience.end}` : ""}</span></div><div style={{ color: accent, fontSize: size * 0.83, fontWeight: 600, marginBottom: 5, fontFamily: bodyFont }}>{experience.company}</div>{experience.description ? <p style={{ margin: 0, color: "#64748b", fontSize: size * 0.84, lineHeight: 1.62, fontFamily: bodyFont }}>{experience.description}</p> : null}{index < cv.experience.length - 1 ? <div style={{ height: 1, background: "#f1f5f9", margin: "14px 0" }} /> : null}</div>)}</div> : null}
        </div>
        <div>
          {cv.education.length ? <div style={card}><CardSecT>{copy.education}</CardSecT>{cv.education.map((education, index) => <div className="cv-pdf-avoid-break" key={education.id}><div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 4, marginBottom: 2 }}><span style={{ fontWeight: 700, fontSize: size * 0.9, color: "#0f172a", fontFamily: displayFont }}>{education.degree}</span><span style={{ fontSize: size * 0.74, color: "#94a3b8", fontFamily: bodyFont, flexShrink: 0 }}>{education.start && education.end ? `${education.start}–${education.end}` : ""}</span></div><div style={{ color: accent, fontSize: size * 0.83, fontWeight: 600, marginBottom: 3, fontFamily: bodyFont }}>{education.institution}</div>{education.grade ? <div style={{ fontSize: size * 0.79, color: "#94a3b8", fontFamily: bodyFont, marginBottom: 4 }}>Ø {education.grade}</div> : null}{education.description ? <p style={{ margin: 0, color: "#64748b", fontSize: size * 0.83, lineHeight: 1.6, fontFamily: bodyFont }}>{education.description}</p> : null}{index < cv.education.length - 1 ? <div style={{ height: 1, background: "#f1f5f9", margin: "12px 0" }} /> : null}</div>)}</div> : null}
          {cv.skills.length ? <div style={card}><CardSecT>{copy.skills}</CardSecT><SkillsBlock accent={accent} display={skillDisplay} skills={cv.skills} /></div> : null}
          {cv.languages.length ? <div style={card}><CardSecT>{copy.languages}</CardSecT>{cv.languages.map((language, index) => <div key={language.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: index < cv.languages.length - 1 ? 8 : 0, marginBottom: index < cv.languages.length - 1 ? 8 : 0, borderBottom: index < cv.languages.length - 1 ? "1px solid #f8fafc" : "none" }}><span style={{ fontWeight: 600, fontSize: size * 0.87, color: "#334155", fontFamily: bodyFont }}>{language.name}</span><span style={{ fontSize: size * 0.77, color: "#94a3b8", fontFamily: bodyFont }}>{language.level}</span></div>)}</div> : null}
          {cv.hobbies.length ? <div style={card}><CardSecT>{copy.interests}</CardSecT><div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{cv.hobbies.map((hobby, index) => <span key={index} style={{ background: "#f1f5f9", color: "#475569", padding: "3px 10px", borderRadius: 20, fontSize: size * 0.79, fontFamily: bodyFont }}>{hobby}</span>)}</div></div> : null}
        </div>
      </div>
    </div>
  );
}
