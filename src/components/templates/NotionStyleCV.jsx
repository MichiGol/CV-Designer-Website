import { Briefcase, Code2, Globe, GraduationCap, Languages, Mail, MapPin, Sparkles } from "lucide-react";
import { PhotoFrame, SkillsBlock } from "./shared.jsx";

const defaultDisplayFont = "'DM Sans', system-ui, sans-serif";
const defaultBodyFont = "'Lato', 'DM Sans', sans-serif";

function SectionHeading({ children, displayFont, icon: Icon }) {
  return (
    <div
      style={{
        alignItems: "center",
        borderBottom: "1px solid #e5e7eb",
        color: "#111827",
        display: "flex",
        fontSize: 24,
        fontFamily: displayFont,
        fontWeight: 700,
        gap: 10,
        marginBottom: 18,
        paddingBottom: 10,
      }}
    >
      <Icon color="#9ca3af" size={22} strokeWidth={2.1} />
      <span>{children}</span>
    </div>
  );
}

function MetaChip({ bodyFont, children, icon: Icon }) {
  return (
    <span
      style={{
        alignItems: "center",
        background: "#f8fafc",
        border: "1px solid #e5e7eb",
        borderRadius: 10,
        color: "#6b7280",
        display: "inline-flex",
        fontFamily: bodyFont,
        fontSize: 12,
        gap: 7,
        padding: "7px 10px",
      }}
    >
      <Icon size={14} strokeWidth={2.1} />
      <span>{children}</span>
    </span>
  );
}

export function NotionStyleCV({
  accent,
  bodyFont = defaultBodyFont,
  data,
  displayFont = defaultDisplayFont,
  pageMode = "preview",
  size = 13,
  skillDisplay = "chips",
}) {
  const isExportPage = pageMode === "export";

  return (
    <div
      style={{
        background: "#ffffff",
        color: "#37352f",
        fontFamily: displayFont,
        ...(isExportPage ? { boxSizing: "border-box", minHeight: "100%" } : { minHeight: 900 }),
      }}
    >
      <div className="notionstyle-shell" style={{ margin: "0 auto", maxWidth: 720, paddingBottom: 42 }}>
        <div
          style={{
            background: `linear-gradient(120deg, ${accent} 0%, #dbeafe 58%, #f5f3ff 100%)`,
            borderBottom: "1px solid #dbe3ee",
            borderRadius: isExportPage ? 0 : "0 0 24px 24px",
            height: 156,
            position: "relative",
          }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.32)",
              borderRadius: "50%",
              height: 140,
              position: "absolute",
              right: 24,
              top: 12,
              width: 140,
            }}
          />
        </div>

        <div style={{ padding: "0 32px" }}>
          <PhotoFrame
            frameStyle={{
              background: "#ffffff",
              border: "4px solid #ffffff",
              borderRadius: 24,
              boxShadow: "0 16px 36px rgba(15,23,42,0.08)",
              height: 92,
              marginTop: -46,
              position: "relative",
              width: 92,
              zIndex: 1,
            }}
            photo={data.photo}
            placeholder={
              <div
                style={{
                  alignItems: "center",
                  background: "#ffffff",
                  color: accent,
                  display: "flex",
                  fontSize: 34,
                  fontWeight: 800,
                  height: "100%",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                {data.initials}
              </div>
            }
            trackForCanvas
          />

          <div style={{ marginTop: 12 }}>
            <h1 style={{ color: "#111827", fontSize: size * 2.9, fontWeight: 800, letterSpacing: "-0.04em", margin: 0 }}>
              {data.name}
            </h1>
            {data.title ? <div style={{ color: "#6b7280", fontSize: size * 1.18, fontWeight: 600, marginTop: 8 }}>{data.title}</div> : null}
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 18, marginBottom: 24 }}>
              {data.contact.email ? <MetaChip bodyFont={bodyFont} icon={Mail}>{data.contact.email}</MetaChip> : null}
              {data.contact.location ? <MetaChip bodyFont={bodyFont} icon={MapPin}>{data.contact.location}</MetaChip> : null}
              {data.contact.website ? <MetaChip bodyFont={bodyFont} icon={Globe}>{data.contact.website}</MetaChip> : null}
          </div>

          {data.summary ? (
            <div
              style={{
                alignItems: "flex-start",
                background: "#f8fafc",
                border: "1px solid #e5e7eb",
                borderRadius: 14,
                display: "flex",
                gap: 12,
                marginBottom: 28,
                padding: "15px 16px",
              }}
            >
              <Sparkles color={accent} size={18} strokeWidth={2.1} style={{ flexShrink: 0, marginTop: 2 }} />
              <p style={{ color: "#44403c", fontFamily: bodyFont, fontSize: 13.5, lineHeight: 1.76, margin: 0 }}>
                {data.summary}
              </p>
            </div>
          ) : null}

          {data.experience.length ? (
            <section style={{ marginBottom: 28 }}>
              <SectionHeading displayFont={displayFont} icon={Briefcase}>Berufserfahrung</SectionHeading>
              <div style={{ display: "grid", gap: 18 }}>
                {data.experience.map(item => (
                  <article key={item.id} style={{ cursor: "default" }}>
                    <div style={{ alignItems: "center", display: "flex", gap: 9 }}>
                      <div style={{ background: "#111827", borderRadius: "50%", height: 6, width: 6 }} />
                      <h3 style={{ color: "#111827", fontSize: 18, fontWeight: 700, margin: 0 }}>{item.role}</h3>
                    </div>
                    <div style={{ marginLeft: 15, marginTop: 5 }}>
                      <div style={{ color: "#6b7280", fontFamily: bodyFont, fontSize: 12.5, fontWeight: 600, marginBottom: 6 }}>
                        {[item.company, item.period].filter(Boolean).join(" • ")}
                      </div>
                      {item.description ? (
                        <p style={{ color: "#44403c", fontFamily: bodyFont, fontSize: 13.5, lineHeight: 1.76, margin: 0 }}>
                          {item.description}
                        </p>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ) : null}

          {data.education.length ? (
            <section style={{ marginBottom: 28 }}>
              <SectionHeading displayFont={displayFont} icon={GraduationCap}>Ausbildung</SectionHeading>
              <div style={{ display: "grid", gap: 12 }}>
                {data.education.map(item => (
                  <article
                    key={item.id}
                    style={{
                      alignItems: "flex-start",
                      display: "flex",
                      gap: 14,
                      padding: "6px 2px",
                    }}
                  >
                    <div style={{ fontSize: 22, lineHeight: 1 }}>🎓</div>
                    <div>
                      <h3 style={{ color: "#111827", fontSize: 16, fontWeight: 700, margin: 0 }}>{item.degree}</h3>
                      {item.institution ? <div style={{ color: "#6b7280", fontFamily: bodyFont, fontSize: 12.5, marginTop: 3 }}>{item.institution}</div> : null}
                      {item.period ? <div style={{ color: "#9ca3af", fontFamily: bodyFont, fontSize: 11.5, marginTop: 4 }}>{item.period}</div> : null}
                      {item.details || item.note ? (
                        <p style={{ color: "#44403c", fontFamily: bodyFont, fontSize: 12.5, lineHeight: 1.68, margin: "7px 0 0" }}>
                          {[item.details, item.note].filter(Boolean).join(" • ")}
                        </p>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ) : null}

          {data.skills.length ? (
            <section style={{ marginBottom: data.languages.length || data.hobbies.length ? 28 : 0 }}>
              <SectionHeading displayFont={displayFont} icon={Code2}>Skills &amp; Tools</SectionHeading>
              <SkillsBlock accent={accent} display={skillDisplay} skills={data.skills} />
            </section>
          ) : null}

          {data.languages.length || data.hobbies.length ? (
            <section>
              <SectionHeading displayFont={displayFont} icon={Languages}>Weitere Details</SectionHeading>
              {data.languages.length ? (
                <p style={{ color: "#44403c", fontFamily: bodyFont, fontSize: 13.5, lineHeight: 1.74, margin: 0 }}>
                  <strong style={{ color: "#111827" }}>Sprachen:</strong>{" "}
                  {data.languages.map(language => `${language.name} (${language.level})`).join(", ")}
                </p>
              ) : null}
              {data.hobbies.length ? (
                <p style={{ color: "#44403c", fontFamily: bodyFont, fontSize: 13.5, lineHeight: 1.74, margin: data.languages.length ? "10px 0 0" : 0 }}>
                  <strong style={{ color: "#111827" }}>Interessen:</strong> {data.hobbies.join(", ")}
                </p>
              ) : null}
            </section>
          ) : null}
        </div>
      </div>
    </div>
  );
}
