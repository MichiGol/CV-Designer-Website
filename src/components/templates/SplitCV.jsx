import { normalizePhotoConfig, PhotoFrame, SecTitle, SidebarLabel, SkillsBlock, TLItem, useResumeTemplateCopy } from "./shared.jsx";

export function SplitCV({ cv, st, displayFont, bodyFont, pageMode = "preview" }) {
  const copy = useResumeTemplateCopy();
  const { accent, size, skillDisplay } = st;
  const personal = cv.personal;
  const photo = normalizePhotoConfig(personal);
  const isExportPage = pageMode === "export";

  return (
    <div style={{ display: "flex", ...(isExportPage ? { alignItems: "flex-start", boxSizing: "border-box" } : { minHeight: 900 }) }}>
      <div style={{ width: "32%", flexShrink: 0, background: accent, padding: "40px 22px 40px", display: "flex", flexDirection: "column", position: "relative", overflow: isExportPage ? "visible" : "hidden" }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.07)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: 60, left: -40, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
          <PhotoFrame
            frameStyle={{ width: 96, height: 96, borderRadius: "50%", border: "3px solid rgba(255,255,255,0.3)", boxShadow: "0 6px 20px rgba(0,0,0,0.3)" }}
            photo={photo}
            placeholder={<div style={{ width: "100%", height: "100%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 700, color: "rgba(255,255,255,0.7)", fontFamily: displayFont }}>{(personal.firstName?.[0] ?? "") + (personal.lastName?.[0] ?? "")}</div>}
            trackForCanvas
          />
        </div>
        <div style={{ textAlign: "center", marginBottom: 6 }}>
          <div style={{ color: "white", fontSize: size * 1.55, fontWeight: 800, fontFamily: displayFont, lineHeight: 1.15 }}>{personal.firstName} {personal.lastName}</div>
          {personal.title ? <div style={{ color: "rgba(255,255,255,0.7)", fontSize: size * 0.85, fontFamily: bodyFont, fontWeight: 500, marginTop: 5, letterSpacing: "0.03em" }}>{personal.title}</div> : null}
        </div>
        <div style={{ height: 1, background: "rgba(255,255,255,0.2)", margin: "18px 0" }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 22 }}>
          {[personal.email, personal.phone, personal.address, personal.website].filter(Boolean).map((text, index) => <div key={index} style={{ color: "rgba(255,255,255,0.75)", fontSize: size * 0.79, fontFamily: bodyFont, display: "flex", alignItems: "flex-start", gap: 8 }}><span style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(255,255,255,0.45)", marginTop: 4, flexShrink: 0 }} /><span style={{ lineHeight: 1.4, wordBreak: "break-all" }}>{text}</span></div>)}
        </div>
        {cv.skills.length ? <><SidebarLabel>{copy.skills}</SidebarLabel><div style={{ marginBottom: 20 }}><SkillsBlock accent={accent} dark display={skillDisplay} skills={cv.skills} /></div></> : null}
        {cv.languages.length ? <><SidebarLabel>{copy.languages}</SidebarLabel><div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>{cv.languages.map(language => <div key={language.id}><div style={{ color: "rgba(255,255,255,0.9)", fontSize: size * 0.84, fontWeight: 600, fontFamily: bodyFont }}>{language.name}</div><div style={{ color: "rgba(255,255,255,0.5)", fontSize: size * 0.75, fontFamily: bodyFont }}>{language.level}</div></div>)}</div></> : null}
        {cv.hobbies.length ? <><SidebarLabel>{copy.interests}</SidebarLabel><div style={{ color: "rgba(255,255,255,0.65)", fontSize: size * 0.79, fontFamily: bodyFont, lineHeight: 1.8 }}>{cv.hobbies.join("  ·  ")}</div></> : null}
      </div>
      <div style={{ flex: 1, padding: "40px 34px 40px", background: "white" }}>
        {personal.summary ? <><SecTitle accent={accent} bodyFont={bodyFont}>{copy.profile}</SecTitle><p style={{ color: "#475569", lineHeight: 1.78, fontSize: size * 0.92, fontFamily: bodyFont, margin: "0 0 24px" }}>{personal.summary}</p></> : null}
        {cv.experience.length ? <><SecTitle accent={accent} bodyFont={bodyFont}>{copy.experience}</SecTitle><div style={{ borderLeft: `2px solid ${accent}20` }}>{cv.experience.map(experience => <TLItem key={experience.id} accent={accent} body={experience.description} bodyFont={bodyFont} displayFont={displayFont} period={experience.start && experience.end ? `${experience.start} – ${experience.end}` : ""} size={size} sub={experience.company} title={experience.role} />)}</div></> : null}
        {cv.education.length ? <><SecTitle accent={accent} bodyFont={bodyFont}>{copy.education}</SecTitle><div style={{ borderLeft: `2px solid ${accent}20` }}>{cv.education.map(education => <TLItem key={education.id} accent={accent} body={education.description} bodyFont={bodyFont} displayFont={displayFont} extra={education.grade ? `Ø ${education.grade}` : ""} period={education.start && education.end ? `${education.start} – ${education.end}` : ""} size={size} sub={education.institution} title={education.degree} />)}</div></> : null}
      </div>
    </div>
  );
}
