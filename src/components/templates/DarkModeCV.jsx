import { normalizePhotoConfig, PhotoFrame, SkillsBlock, useResumeTemplateCopy } from "./shared.jsx";

export function DarkModeCV({ cv, st, displayFont, bodyFont, pageMode = "preview" }) {
  const copy = useResumeTemplateCopy();
  const { accent, size, skillDisplay } = st;
  const personal = cv.personal;
  const photo = normalizePhotoConfig(personal);
  const bg = "#0e1117";
  const surface = "#161b22";
  const border = "#21262d";
  const textPrimary = "#e6edf3";
  const textSecondary = "#8b949e";
  const textMuted = "#484f58";
  const isExportPage = pageMode === "export";

  function DS({ children }) {
    return <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, marginTop: 22 }}><div style={{ width: 3, height: 16, background: accent, borderRadius: 2, flexShrink: 0, boxShadow: `0 0 8px ${accent}80` }} /><span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: accent, fontFamily: bodyFont }}>{children}</span><div style={{ flex: 1, height: 1, background: `${accent}30` }} /></div>;
  }

  function DT({ title, sub, period, extra, body }) {
    return <div style={{ display: "flex", gap: 14, marginBottom: 20 }}><div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 4 }}><div style={{ width: 9, height: 9, borderRadius: "50%", background: accent, flexShrink: 0, border: `2px solid ${bg}`, boxShadow: `0 0 6px ${accent}80`, marginLeft: -5 }} /><div style={{ flex: 1, width: 1, background: `${accent}30`, marginTop: 4, minHeight: 20 }} /></div><div style={{ flex: 1, paddingBottom: 14 }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 4, marginBottom: 2 }}><span style={{ fontWeight: 700, fontSize: size, color: textPrimary, fontFamily: displayFont }}>{title}</span><span style={{ fontSize: size * 0.77, color: textMuted, fontFamily: bodyFont }}>{period}{extra ? ` · ${extra}` : ""}</span></div><div style={{ color: accent, fontSize: size * 0.86, fontWeight: 600, marginBottom: 5, fontFamily: bodyFont }}>{sub}</div>{body ? <p style={{ color: textSecondary, fontSize: size * 0.88, lineHeight: 1.65, margin: 0, fontFamily: bodyFont }}>{body}</p> : null}</div></div>;
  }

  return (
    <div style={{ background: bg, ...(isExportPage ? { boxSizing: "border-box" } : { minHeight: 900 }) }}>
      <div style={{ background: `linear-gradient(135deg,${surface} 0%,${bg} 100%)`, borderBottom: `1px solid ${border}`, padding: "40px 44px 32px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -80, right: -80, width: 280, height: 280, borderRadius: "50%", background: `${accent}18`, filter: "blur(60px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -40, left: 60, width: 160, height: 160, borderRadius: "50%", background: `${accent}10`, filter: "blur(40px)", pointerEvents: "none" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 28, position: "relative", zIndex: 1 }}>
          <PhotoFrame
            frameStyle={{ width: 108, height: 108, borderRadius: "50%", flexShrink: 0, border: `2px solid ${accent}`, boxShadow: `0 0 24px ${accent}50` }}
            photo={photo}
            placeholder={<div style={{ width: "100%", height: "100%", background: `${accent}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34, color: accent, fontFamily: displayFont, fontWeight: 700 }}>{(personal.firstName?.[0] ?? "") + (personal.lastName?.[0] ?? "")}</div>}
            trackForCanvas
          />
          <div style={{ flex: 1 }}>
            <h1 style={{ color: textPrimary, margin: "0 0 4px", fontSize: size * 2.3, fontWeight: 800, fontFamily: displayFont, letterSpacing: "-0.02em", lineHeight: 1.1 }}>{personal.firstName || copy.nameFallback.split(" ")[0]} {personal.lastName || copy.nameFallback.split(" ").slice(1).join(" ")}</h1>
            {personal.title ? <div style={{ color: accent, fontSize: size * 1, fontWeight: 500, marginBottom: 14, fontFamily: bodyFont, letterSpacing: "0.03em" }}>{personal.title}</div> : null}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "5px 18px" }}>{[personal.email, personal.phone, personal.address, personal.website].filter(Boolean).map((text, index) => <span key={index} style={{ color: textSecondary, fontSize: size * 0.8, fontFamily: bodyFont, display: "flex", alignItems: "center", gap: 5 }}><span style={{ width: 3, height: 3, borderRadius: "50%", background: accent }} />{text}</span>)}</div>
          </div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", ...(isExportPage ? { alignItems: "start" } : {}) }}>
        <div style={{ background: surface, borderRight: `1px solid ${border}`, padding: "8px 20px 30px" }}>
          {cv.skills.length ? <><DS>{copy.skills}</DS><SkillsBlock accent={accent} dark display={skillDisplay} skills={cv.skills} /></> : null}
          {cv.languages.length ? <><DS>{copy.languages}</DS>{cv.languages.map(language => <div key={language.id} style={{ marginBottom: 10 }}><div style={{ fontWeight: 700, fontSize: size * 0.88, color: textPrimary, fontFamily: bodyFont }}>{language.name}</div><div style={{ color: textMuted, fontSize: size * 0.78, marginTop: 2, fontFamily: bodyFont }}>{language.level}</div></div>)}</> : null}
          {cv.hobbies.length ? <><DS>{copy.interests}</DS><div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{cv.hobbies.map((hobby, index) => <span key={index} style={{ background: `${accent}18`, color: accent, padding: "3px 9px", borderRadius: 20, fontSize: size * 0.78, fontWeight: 600, fontFamily: bodyFont, border: `1px solid ${accent}30` }}>{hobby}</span>)}</div></> : null}
        </div>
        <div style={{ padding: "8px 36px 40px", background: bg }}>
          {personal.summary ? <><DS>{copy.profile}</DS><p style={{ lineHeight: 1.75, color: textSecondary, margin: "0 0 8px", fontSize: size * 0.92, fontFamily: bodyFont, background: `${accent}0a`, borderLeft: `3px solid ${accent}`, padding: "10px 14px", borderRadius: "0 6px 6px 0" }}>{personal.summary}</p></> : null}
          {cv.experience.length ? <><DS>{copy.experience}</DS><div style={{ borderLeft: `2px solid ${accent}30` }}>{cv.experience.map(experience => <DT key={experience.id} body={experience.description} period={experience.start && experience.end ? `${experience.start} – ${experience.end}` : ""} sub={experience.company} title={experience.role} />)}</div></> : null}
          {cv.education.length ? <><DS>{copy.education}</DS><div style={{ borderLeft: `2px solid ${accent}30` }}>{cv.education.map(education => <DT key={education.id} body={education.description} extra={education.grade ? `Ø ${education.grade}` : ""} period={education.start && education.end ? `${education.start} – ${education.end}` : ""} sub={education.institution} title={education.degree} />)}</div></> : null}
        </div>
      </div>
    </div>
  );
}
