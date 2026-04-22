import { normalizePhotoConfig, PhotoFrame, SecTitle, SkillsBlock, TLItem } from "./shared.jsx";

export function HeaderCV({ cv, st, displayFont, bodyFont, pageMode = "preview" }) {
  const { accent, size, layout, sidebarSide, skillDisplay } = st;
  const personal = cv.personal;
  const photo = normalizePhotoConfig(personal);
  const isExportPage = pageMode === "export";

  return (
    <div style={isExportPage ? { minHeight: "100%", display: "flex", flexDirection: "column", boxSizing: "border-box" } : undefined}>
      <div style={{ position: "relative", background: accent }}>
        <div style={{ position: "absolute", top: -50, right: -50, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 20, right: 90, width: 60, height: 60, borderRadius: "50%", background: "rgba(255,255,255,0.08)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: 20, left: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />
        <div className="cv-preview-hero" style={{ display: "flex", alignItems: "center", gap: 28, padding: "36px 44px 24px", position: "relative", zIndex: 1 }}>
          <PhotoFrame
            frameStyle={{ width: 108, height: 108, borderRadius: "50%", flexShrink: 0, border: "3px solid rgba(255,255,255,0.25)", boxShadow: "0 8px 24px rgba(0,0,0,0.3)" }}
            photo={photo}
            placeholder={
              <div style={{ width: "100%", height: "100%", background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34, color: "rgba(255,255,255,0.65)", fontFamily: displayFont, fontWeight: 700 }}>
                {(personal.firstName?.[0] ?? "") + (personal.lastName?.[0] ?? "")}
              </div>
            }
            trackForCanvas
          />
          <div style={{ flex: 1 }}>
            <h1 style={{ color: "white", margin: "0 0 4px", fontSize: size * 2.3, fontWeight: 800, fontFamily: displayFont, letterSpacing: "-0.02em", lineHeight: 1.1 }}>
              {personal.firstName || "Vorname"} {personal.lastName || "Nachname"}
            </h1>
            {personal.title ? <div style={{ color: "rgba(255,255,255,0.75)", fontSize: size * 1, fontWeight: 500, marginBottom: 14, fontFamily: bodyFont, letterSpacing: "0.03em" }}>{personal.title}</div> : null}
            <div className="cv-contact-strip" style={{ display: "flex", flexWrap: "wrap", gap: "5px 18px" }}>
              {[personal.email, personal.phone, personal.address, personal.website].filter(Boolean).map((text, index) => (
                <span key={index} style={{ color: "rgba(255,255,255,0.65)", fontSize: size * 0.8, fontFamily: bodyFont, display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(255,255,255,0.5)" }} />
                  {text}
                </span>
              ))}
            </div>
          </div>
        </div>
        {layout === "wave" ? <svg preserveAspectRatio="none" style={{ display: "block", width: "100%", height: 52 }} viewBox="0 0 1080 52"><path d="M0,52 C200,10 400,50 600,25 C800,0 1000,40 1080,20 L1080,52 Z" fill="white" /></svg> : null}
        {layout === "diagonal" ? <svg preserveAspectRatio="none" style={{ display: "block", width: "100%", height: 52 }} viewBox="0 0 1080 52"><path d="M0,52 L1080,10 L1080,52 Z" fill="white" /></svg> : null}
        {layout === "arch" ? <svg preserveAspectRatio="none" style={{ display: "block", width: "100%", height: 60 }} viewBox="0 0 1080 60"><path d="M0,60 Q540,0 1080,60 Z" fill="white" /></svg> : null}
      </div>
      <div className="cv-preview-columns" style={{ display: "grid", gridTemplateColumns: sidebarSide === "left" ? "200px 1fr" : "1fr 200px", ...(isExportPage ? { flex: 1, minHeight: 0 } : { minHeight: 600 }) }}>
        <div className="cv-preview-sidebar" style={{ order: sidebarSide === "left" ? 1 : 2, background: "#f8fafc", borderLeft: sidebarSide === "right" ? "1px solid #e2e8f0" : "none", borderRight: sidebarSide === "left" ? "1px solid #e2e8f0" : "none", padding: "8px 20px 30px" }}>
          {cv.skills.length ? <><SecTitle accent={accent} bodyFont={bodyFont}>Fähigkeiten</SecTitle><SkillsBlock accent={accent} display={skillDisplay} skills={cv.skills} /></> : null}
          {cv.languages.length ? <><SecTitle accent={accent} bodyFont={bodyFont}>Sprachen</SecTitle>{cv.languages.map(language => <div key={language.id} style={{ marginBottom: 10 }}><div style={{ fontWeight: 700, fontSize: size * 0.88, color: "#334155", fontFamily: bodyFont }}>{language.name}</div><div style={{ color: "#94a3b8", fontSize: size * 0.78, marginTop: 2, fontFamily: bodyFont }}>{language.level}</div></div>)}</> : null}
          {cv.hobbies.length ? <><SecTitle accent={accent} bodyFont={bodyFont}>Interessen</SecTitle><div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{cv.hobbies.map((hobby, index) => <span key={index} style={{ background: `${accent}12`, color: accent, padding: "3px 9px", borderRadius: 20, fontSize: size * 0.78, fontWeight: 600, fontFamily: bodyFont, border: `1px solid ${accent}25` }}>{hobby}</span>)}</div></> : null}
        </div>
        <div className="cv-preview-main" style={{ order: sidebarSide === "left" ? 2 : 1, padding: "8px 32px 36px" }}>
          {personal.summary ? <><SecTitle accent={accent} bodyFont={bodyFont}>Profil</SecTitle><p style={{ lineHeight: 1.75, color: "#334155", margin: "0 0 8px", fontSize: size * 0.92, fontFamily: bodyFont, background: `${accent}08`, borderLeft: `3px solid ${accent}`, padding: "10px 14px", borderRadius: "0 6px 6px 0" }}>{personal.summary}</p></> : null}
          {cv.experience.length ? <><SecTitle accent={accent} bodyFont={bodyFont}>Berufserfahrung</SecTitle><div style={{ borderLeft: `2px solid ${accent}20` }}>{cv.experience.map(experience => <TLItem key={experience.id} accent={accent} body={experience.description} bodyFont={bodyFont} displayFont={displayFont} period={experience.start && experience.end ? `${experience.start} – ${experience.end}` : ""} size={size} sub={experience.company} title={experience.role} />)}</div></> : null}
          {cv.education.length ? <><SecTitle accent={accent} bodyFont={bodyFont}>Ausbildung</SecTitle><div style={{ borderLeft: `2px solid ${accent}20` }}>{cv.education.map(education => <TLItem key={education.id} accent={accent} body={education.description} bodyFont={bodyFont} displayFont={displayFont} extra={education.grade ? `Ø ${education.grade}` : ""} period={education.start && education.end ? `${education.start} – ${education.end}` : ""} size={size} sub={education.institution} title={education.degree} />)}</div></> : null}
        </div>
      </div>
      <div style={{ height: 5, background: `linear-gradient(90deg,${accent},${accent}55)` }} />
    </div>
  );
}
