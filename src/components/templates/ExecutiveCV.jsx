import { normalizePhotoConfig, PhotoFrame, SkillsBlock, useResumeTemplateCopy } from "./shared.jsx";

export function ExecutiveCV({ cv, st, displayFont, bodyFont, pageMode = "preview" }) {
  const copy = useResumeTemplateCopy();
  const { accent, size, skillDisplay } = st;
  const personal = cv.personal;
  const photo = normalizePhotoConfig(personal);
  const hasPhoto = Boolean(photo?.src);
  const contactItems = [personal.email, personal.phone, personal.address, personal.website].filter(Boolean);
  const isExportPage = pageMode === "export";

  function ExecSec({ title, children }) {
    return (
      <div style={{ marginBottom: 30 }}>
        <div style={{ alignItems: "center", display: "flex", gap: 12, marginBottom: 18 }}>
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
      <div className="cv-pdf-avoid-break" style={{ alignItems: "start", display: "grid", gap: 24, gridTemplateColumns: "148px 1fr", marginBottom: 20 }}>
        <div style={{ paddingTop: 3 }}>
          <div style={{ color: accent, fontFamily: bodyFont, fontSize: size * 0.78, fontWeight: 600, lineHeight: 1.4 }}>{period}</div>
          {extra ? <div style={{ color: "#94a3b8", fontFamily: bodyFont, fontSize: size * 0.75, marginTop: 2 }}>{extra}</div> : null}
        </div>
        <div>
          <div style={{ color: "#0f172a", fontFamily: displayFont, fontSize: size * 1.02, fontWeight: 700, marginBottom: 3 }}>{title}</div>
          <div style={{ color: "#475569", fontFamily: bodyFont, fontSize: size * 0.88, fontWeight: 500, marginBottom: 6 }}>{sub}</div>
          {body ? <p style={{ color: "#64748b", fontFamily: bodyFont, fontSize: size * 0.88, lineHeight: 1.68, margin: 0 }}>{body}</p> : null}
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "white", padding: "52px 56px 56px", ...(isExportPage ? { boxSizing: "border-box" } : {}) }}>
      <div style={{ background: accent, borderRadius: 2, height: 3, marginBottom: 36 }} />

      <div style={{ alignItems: "flex-start", display: "flex", gap: 32, justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ color: "#080808", fontFamily: displayFont, fontSize: size * 2.9, fontWeight: 700, letterSpacing: "-0.025em", lineHeight: 1.05, margin: "0 0 6px" }}>
            {personal.firstName} {personal.lastName}
          </h1>
          {personal.title ? <div style={{ color: "#475569", fontFamily: bodyFont, fontSize: size * 0.98, fontWeight: 300, letterSpacing: "0.06em", textTransform: "uppercase" }}>{personal.title}</div> : null}
        </div>

        {hasPhoto ? (
          <PhotoFrame
            frameStyle={{
              border: `1px solid ${accent}20`,
              borderRadius: 20,
              boxShadow: "0 14px 32px rgba(15, 23, 42, 0.08)",
              flexShrink: 0,
              height: 136,
              width: 112,
            }}
            photo={photo}
            trackForCanvas
          />
        ) : null}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 0", marginBottom: 32 }}>
        {contactItems.flatMap((text, index, array) => [
          <span key={`text-${index}`} style={{ color: "#64748b", fontFamily: bodyFont, fontSize: size * 0.8 }}>
            {text}
          </span>,
          index < array.length - 1 ? (
            <span key={`sep-${index}`} style={{ color: "#cbd5e1", fontFamily: bodyFont, fontSize: size * 0.8, padding: "0 10px" }}>
              ·
            </span>
          ) : null,
        ])}
      </div>

      <div style={{ background: "#e2e8f0", height: 1, marginBottom: 4 }} />
      <div style={{ background: `${accent}30`, height: 1, marginBottom: 36 }} />

      {personal.summary ? (
        <ExecSec title={copy.profile}>
          <p style={{ color: "#334155", fontFamily: displayFont, fontSize: size * 0.94, fontStyle: "italic", letterSpacing: "0.01em", lineHeight: 1.85, margin: 0 }}>
            {personal.summary}
          </p>
        </ExecSec>
      ) : null}

      {cv.experience.length ? (
        <ExecSec title={copy.experience}>
          {cv.experience.map(experience => (
            <ExecTL
              key={experience.id}
              body={experience.description}
              period={experience.start && experience.end ? `${experience.start} – ${experience.end}` : ""}
              sub={experience.company}
              title={experience.role}
            />
          ))}
        </ExecSec>
      ) : null}

      {cv.education.length ? (
        <ExecSec title={copy.education}>
          {cv.education.map(education => (
            <ExecTL
              key={education.id}
              body={education.description}
              extra={education.grade ? `Ø ${education.grade}` : ""}
              period={education.start && education.end ? `${education.start} – ${education.end}` : ""}
              sub={education.institution}
              title={education.degree}
            />
          ))}
        </ExecSec>
      ) : null}

      {cv.skills.length || cv.languages.length ? (
        <ExecSec title={copy.skillsAndLanguages}>
          <div style={{ display: "grid", gap: 36, gridTemplateColumns: "1fr 1fr" }}>
            {cv.skills.length ? (
              <div>
                <div style={{ color: "#94a3b8", fontFamily: bodyFont, fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", marginBottom: 10, textTransform: "uppercase" }}>
                  {copy.skills}
                </div>
                <SkillsBlock accent={accent} display={skillDisplay} skills={cv.skills} />
              </div>
            ) : null}

            {cv.languages.length ? (
              <div>
                <div style={{ color: "#94a3b8", fontFamily: bodyFont, fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", marginBottom: 10, textTransform: "uppercase" }}>
                  {copy.languages}
                </div>
                {cv.languages.map(language => (
                  <div key={language.id} style={{ borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", marginBottom: 8, paddingBottom: 8 }}>
                    <span style={{ color: "#334155", fontFamily: bodyFont, fontSize: size * 0.88, fontWeight: 600 }}>{language.name}</span>
                    <span style={{ color: "#94a3b8", fontFamily: bodyFont, fontSize: size * 0.82 }}>{language.level}</span>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </ExecSec>
      ) : null}

      {cv.hobbies.length ? (
        <ExecSec title={copy.interests}>
          <div style={{ color: "#64748b", fontFamily: bodyFont, fontSize: size * 0.88 }}>{cv.hobbies.join("  ·  ")}</div>
        </ExecSec>
      ) : null}

      <div style={{ background: "#e2e8f0", height: 1, marginTop: 36 }} />
    </div>
  );
}
