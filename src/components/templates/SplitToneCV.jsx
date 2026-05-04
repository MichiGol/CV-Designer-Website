import { Globe, Mail, MapPin, Phone } from "lucide-react";
import { PhotoFrame, SkillsBlock, useResumeTemplateCopy } from "./shared.jsx";

const defaultDisplayFont = "'Bebas Neue', 'DM Sans', sans-serif";
const defaultBodyFont = "'DM Sans', system-ui, sans-serif";

function ContactLine({ bodyFont, children, icon: Icon }) {
  return (
    <div style={{ alignItems: "center", color: "rgba(255,255,255,0.84)", display: "flex", fontFamily: bodyFont, fontSize: 14, gap: 10 }}>
      <Icon size={14} strokeWidth={2.2} />
      <span>{children}</span>
    </div>
  );
}

function SectionTitle({ children, displayFont }) {
  return (
    <h3
      style={{
        color: "#111827",
        fontFamily: displayFont,
        fontSize: 34,
        letterSpacing: "0.03em",
        lineHeight: 0.95,
        margin: "0 0 18px",
      }}
    >
      {children}
    </h3>
  );
}

export function SplitToneCV({
  accent,
  bodyFont = defaultBodyFont,
  data,
  displayFont = defaultDisplayFont,
  pageMode = "preview",
  size = 13,
  skillDisplay = "chips",
}) {
  const isExportPage = pageMode === "export";
  const copy = useResumeTemplateCopy();

  return (
    <div
      className="splittone-shell"
      style={{
        background: "#ffffff",
        display: "grid",
        gridTemplateColumns: "minmax(260px, 0.9fr) minmax(0, 1.1fr)",
        ...(isExportPage ? { alignItems: "start", boxSizing: "border-box" } : { minHeight: 900 }),
      }}
    >
      <aside
        className="splittone-sidebar"
        style={{
          background: `linear-gradient(160deg, ${accent} 0%, #111827 100%)`,
          color: "#ffffff",
          display: "flex",
          flexDirection: "column",
          gap: isExportPage ? 40 : 0,
          justifyContent: isExportPage ? "flex-start" : "space-between",
          overflow: isExportPage ? "visible" : "hidden",
          padding: "42px 34px",
          position: "relative",
        }}
      >
        <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: "50%", height: 220, position: "absolute", right: -90, top: -80, width: 220 }} />
        <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: "50%", bottom: 56, left: -50, position: "absolute", height: 140, width: 140 }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <PhotoFrame
            frameStyle={{
              border: "3px solid rgba(255,255,255,0.24)",
              borderRadius: 28,
              height: 116,
              marginBottom: 26,
              width: 116,
            }}
            photo={data.photo}
            placeholder={
              <div
                style={{
                  alignItems: "center",
                  background: "rgba(255,255,255,0.1)",
                  display: "flex",
                  fontFamily: displayFont,
                  fontSize: 50,
                  height: "100%",
                  justifyContent: "center",
                  letterSpacing: "0.04em",
                  width: "100%",
                }}
              >
                {data.initials}
              </div>
            }
            trackForCanvas
          />

          <h1 style={{ fontFamily: displayFont, fontSize: 62, letterSpacing: "0.02em", lineHeight: 0.92, margin: 0 }}>
            {data.name}
          </h1>
          {data.title ? (
            <div style={{ color: "rgba(224,231,255,0.88)", fontFamily: bodyFont, fontSize: size * 1.16, marginTop: 12 }}>
              {data.title}
            </div>
          ) : null}

          <div style={{ display: "grid", gap: 12, marginTop: 34 }}>
            {data.contact.email ? <ContactLine bodyFont={bodyFont} icon={Mail}>{data.contact.email}</ContactLine> : null}
            {data.contact.phone ? <ContactLine bodyFont={bodyFont} icon={Phone}>{data.contact.phone}</ContactLine> : null}
            {data.contact.location ? <ContactLine bodyFont={bodyFont} icon={MapPin}>{data.contact.location}</ContactLine> : null}
            {data.contact.website ? <ContactLine bodyFont={bodyFont} icon={Globe}>{data.contact.website}</ContactLine> : null}
          </div>
        </div>

        {data.skills.length ? (
          <div style={{ marginTop: 40, position: "relative", zIndex: 1 }}>
            <div style={{ color: "rgba(199,210,254,0.86)", fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", marginBottom: 18, textTransform: "uppercase" }}>
              {copy.skills}
            </div>
            <div style={{ marginRight: 8 }}>
              <SkillsBlock accent={accent} dark display={skillDisplay} skills={data.skills} />
            </div>
          </div>
        ) : null}
      </aside>

      <main
        className="splittone-main"
        style={{
          background: "#ffffff",
          overflow: isExportPage ? "visible" : "hidden",
          padding: "44px 38px 40px",
        }}
      >
        {data.summary ? (
          <section style={{ marginBottom: 38 }}>
            <SectionTitle displayFont={displayFont}>{copy.profile}.</SectionTitle>
            <p style={{ color: "#4b5563", fontFamily: bodyFont, fontSize: size * 1.12, fontWeight: 300, lineHeight: 1.82, margin: 0 }}>
              {data.summary}
            </p>
          </section>
        ) : null}

        {data.experience.length ? (
          <section style={{ marginBottom: 38 }}>
            <SectionTitle displayFont={displayFont}>{copy.experience}.</SectionTitle>
            <div style={{ display: "grid", gap: 24 }}>
              {data.experience.map(item => (
                <article key={item.id}>
                  {item.period ? (
                    <div style={{ color: accent, fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", marginBottom: 4, textTransform: "uppercase" }}>
                      {item.period}
                    </div>
                  ) : null}
                  <h4 style={{ color: "#111827", fontFamily: bodyFont, fontSize: 22, fontWeight: 700, margin: 0 }}>
                    {item.role}
                  </h4>
                  {item.company ? <div style={{ color: "#6b7280", fontSize: 16, marginTop: 4 }}>{item.company}</div> : null}
                  {item.description ? (
                    <p style={{ color: "#4b5563", fontFamily: bodyFont, fontSize: 13.5, lineHeight: 1.76, margin: "10px 0 0" }}>
                      {item.description}
                    </p>
                  ) : null}
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {data.education.length ? (
          <section style={{ marginBottom: data.languages.length || data.hobbies.length ? 38 : 0 }}>
            <SectionTitle displayFont={displayFont}>{copy.education}.</SectionTitle>
            <div style={{ display: "grid", gap: 18 }}>
              {data.education.map(item => (
                <article key={item.id}>
                  <h4 style={{ color: "#111827", fontFamily: bodyFont, fontSize: 20, fontWeight: 700, margin: 0 }}>
                    {item.degree}
                  </h4>
                  {item.institution ? <div style={{ color: "#6b7280", fontSize: 16, marginTop: 4 }}>{item.institution}</div> : null}
                  {item.period ? (
                    <div style={{ color: accent, fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", marginTop: 8, textTransform: "uppercase" }}>
                      {item.period}
                    </div>
                  ) : null}
                  {item.details || item.note ? (
                    <p style={{ color: "#4b5563", fontFamily: bodyFont, fontSize: 13, lineHeight: 1.72, margin: "10px 0 0" }}>
                      {[item.details, item.note].filter(Boolean).join(" - ")}
                    </p>
                  ) : null}
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {data.languages.length || data.hobbies.length ? (
          <section>
            <SectionTitle displayFont={displayFont}>{copy.details}.</SectionTitle>
            {data.languages.length ? (
              <p style={{ color: "#4b5563", fontFamily: bodyFont, fontSize: 13.5, lineHeight: 1.72, margin: 0 }}>
                <strong style={{ color: "#111827" }}>{copy.languages}:</strong>{" "}
                {data.languages.map(language => `${language.name} (${language.level})`).join(", ")}
              </p>
            ) : null}
            {data.hobbies.length ? (
              <p style={{ color: "#4b5563", fontFamily: bodyFont, fontSize: 13.5, lineHeight: 1.72, margin: data.languages.length ? "10px 0 0" : 0 }}>
                <strong style={{ color: "#111827" }}>{copy.interests}:</strong> {data.hobbies.join(", ")}
              </p>
            ) : null}
          </section>
        ) : null}
      </main>
    </div>
  );
}
