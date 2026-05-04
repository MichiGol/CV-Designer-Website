import { normalizePhotoConfig, PhotoFrame, SkillsBlock, useResumeTemplateCopy } from "./shared.jsx";

export function EditorialCV({ cv, st, displayFont, bodyFont, pageMode = "preview" }) {
  const copy = useResumeTemplateCopy();
  const { accent, size, skillDisplay } = st;
  const personal = cv.personal;
  const photo = normalizePhotoConfig(personal);
  const hasPhoto = Boolean(photo?.src);
  const contactItems = [personal.email, personal.phone, personal.website].filter(Boolean);
  const isExportPage = pageMode === "export";

  function EdSec({ title, children }) {
    return (
      <div style={{ marginBottom: 28 }}>
        <div style={{ borderTop: "1px solid #000", display: "grid", gap: 0, gridTemplateColumns: "140px 1fr", marginBottom: 16, paddingTop: 10 }}>
          <span style={{ color: accent, fontFamily: bodyFont, fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", paddingTop: 1, textTransform: "uppercase" }}>
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
      <div className="cv-pdf-avoid-break" style={{ alignItems: "start", display: "grid", gap: 20, gridTemplateColumns: "140px 1fr", marginBottom: 18 }}>
        <div>
          <div style={{ color: accent, fontFamily: bodyFont, fontSize: size * 0.8, fontWeight: 700 }}>{period}</div>
          {extra ? <div style={{ color: "#999", fontFamily: bodyFont, fontSize: size * 0.75, marginTop: 2 }}>{extra}</div> : null}
        </div>
        <div>
          <div style={{ color: "#0a0a0a", fontFamily: displayFont, fontSize: size * 1.05, fontWeight: 700, marginBottom: 2 }}>{title}</div>
          <div style={{ color: "#555", fontFamily: bodyFont, fontSize: size * 0.88, fontStyle: "italic", fontWeight: 500, marginBottom: 5 }}>{sub}</div>
          {body ? <p style={{ color: "#444", fontFamily: bodyFont, fontSize: size * 0.88, lineHeight: 1.7, margin: 0 }}>{body}</p> : null}
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "white", padding: "48px 52px 52px", ...(isExportPage ? { boxSizing: "border-box" } : {}) }}>
      <header style={{ marginBottom: 36 }}>
        <div style={{ alignItems: "flex-end", borderBottom: "3px solid #000", display: "flex", gap: 24, marginBottom: 6, paddingBottom: 16 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ color: "#000", fontFamily: "'Bebas Neue','Cormorant Garamond',Georgia,serif", fontSize: size * 5.5, fontWeight: 400, letterSpacing: "0.04em", lineHeight: 0.9, margin: 0, textTransform: "uppercase" }}>
              {personal.firstName} {personal.lastName}
            </h1>
          </div>

          {hasPhoto ? (
            <PhotoFrame
              frameStyle={{
                border: "1px solid #d4d4d8",
                borderRadius: 2,
                boxShadow: "0 14px 28px rgba(0, 0, 0, 0.08)",
                flexShrink: 0,
                height: 144,
                width: 112,
              }}
              photo={photo}
              trackForCanvas
            />
          ) : null}
        </div>

        <div style={{ alignItems: hasPhoto ? "flex-end" : "center", borderBottom: "1px solid #000", display: "flex", justifyContent: "space-between", paddingBottom: 10 }}>
          <div style={{ color: accent, fontFamily: bodyFont, fontSize: size * 0.95, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            {personal.title}
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            {contactItems.map((text, index) => (
              <span key={index} style={{ color: "#666", fontFamily: bodyFont, fontSize: size * 0.79 }}>
                {text}
              </span>
            ))}
          </div>
        </div>
      </header>

      {personal.summary ? (
        <div style={{ marginBottom: 36 }}>
          <p style={{ borderLeft: `4px solid ${accent}`, color: "#222", fontFamily: displayFont, fontSize: size * 1.08, fontStyle: "italic", letterSpacing: "0.01em", lineHeight: 1.9, margin: 0, paddingLeft: 20 }}>
            {personal.summary}
          </p>
        </div>
      ) : null}

      {cv.experience.length ? (
        <EdSec title={copy.experience}>
          {cv.experience.map(experience => (
            <EdTL
              key={experience.id}
              body={experience.description}
              period={experience.start && experience.end ? `${experience.start} – ${experience.end}` : ""}
              sub={experience.company}
              title={experience.role}
            />
          ))}
        </EdSec>
      ) : null}

      {cv.education.length ? (
        <EdSec title={copy.education}>
          {cv.education.map(education => (
            <EdTL
              key={education.id}
              body={education.description}
              extra={education.grade ? `Ø ${education.grade}` : ""}
              period={education.start && education.end ? `${education.start} – ${education.end}` : ""}
              sub={education.institution}
              title={education.degree}
            />
          ))}
        </EdSec>
      ) : null}

      {cv.skills.length || cv.languages.length || cv.hobbies.length ? (
        <EdSec title={copy.knowledge}>
          <div style={{ display: "grid", gap: 32, gridTemplateColumns: "1fr 1fr 1fr" }}>
            {cv.skills.length ? (
              <div>
                <div style={{ color: "#999", fontFamily: bodyFont, fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", marginBottom: 12, textTransform: "uppercase" }}>
                  {copy.skills}
                </div>
                <SkillsBlock accent={accent} display={skillDisplay} skills={cv.skills} />
              </div>
            ) : null}

            {cv.languages.length ? (
              <div>
                <div style={{ color: "#999", fontFamily: bodyFont, fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", marginBottom: 12, textTransform: "uppercase" }}>
                  {copy.languages}
                </div>
                {cv.languages.map(language => (
                  <div key={language.id} style={{ marginBottom: 8 }}>
                    <div style={{ color: "#222", fontFamily: bodyFont, fontSize: size * 0.88, fontWeight: 700 }}>{language.name}</div>
                    <div style={{ color: "#888", fontFamily: bodyFont, fontSize: size * 0.8 }}>{language.level}</div>
                  </div>
                ))}
              </div>
            ) : null}

            {cv.hobbies.length ? (
              <div>
                <div style={{ color: "#999", fontFamily: bodyFont, fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", marginBottom: 12, textTransform: "uppercase" }}>
                  {copy.interests}
                </div>
                <div style={{ color: "#555", fontFamily: bodyFont, fontSize: size * 0.88, lineHeight: 1.9 }}>{cv.hobbies.join(" · ")}</div>
              </div>
            ) : null}
          </div>
        </EdSec>
      ) : null}
    </div>
  );
}
