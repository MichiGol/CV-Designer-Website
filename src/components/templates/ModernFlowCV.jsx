import { Briefcase, Globe, GraduationCap, Heart, Languages, Mail, MapPin, Phone, Sparkles, User } from "lucide-react";
import { PhotoFrame, SkillsBlock } from "./shared.jsx";

const sectionLabelStyle = {
  alignItems: "center",
  color: "#0f172a",
  display: "flex",
  fontSize: 11,
  fontWeight: 700,
  gap: 8,
  letterSpacing: "0.14em",
  marginBottom: 14,
  textTransform: "uppercase",
};

function SectionLabel({ bodyFont, children, icon: Icon }) {
  return (
    <div style={{ ...sectionLabelStyle, fontFamily: bodyFont }}>
      <Icon size={14} strokeWidth={2.1} />
      <span>{children}</span>
    </div>
  );
}

function ContactItem({ accent, bodyFont, children, icon: Icon }) {
  return (
    <span
      style={{
        alignItems: "center",
        color: "rgba(226, 232, 240, 0.84)",
        display: "inline-flex",
        fontFamily: bodyFont,
        fontSize: 12,
        gap: 8,
      }}
    >
      <Icon color={accent} size={14} strokeWidth={2} />
      <span>{children}</span>
    </span>
  );
}

function TimelineItem({ accent, body, bodyFont, displayFont, index, period, subtitle, title, total }) {
  return (
    <div style={{ paddingLeft: 28, position: "relative", paddingBottom: index < total - 1 ? 24 : 0 }}>
      <div
        style={{
          background: accent,
          borderRadius: "50%",
          boxShadow: `0 0 0 6px ${accent}1f`,
          height: 11,
          left: 0,
          position: "absolute",
          top: 7,
          width: 11,
        }}
      />
      {index < total - 1 ? (
        <div
          style={{
            background: "linear-gradient(180deg, rgba(148,163,184,0.6), rgba(226,232,240,0.35))",
            bottom: 0,
            left: 5,
            position: "absolute",
            top: 24,
            width: 1.5,
          }}
        />
      ) : null}
      <div
        style={{
          alignItems: "flex-start",
          display: "flex",
          gap: 16,
          justifyContent: "space-between",
          marginBottom: 4,
        }}
        >
        <div>
          <h3 style={{ color: "#0f172a", fontFamily: displayFont, fontSize: 25, fontWeight: 700, lineHeight: 1, margin: 0 }}>
            {title}
          </h3>
          {subtitle ? <div style={{ color: accent, fontFamily: bodyFont, fontSize: 13, fontWeight: 700, letterSpacing: "0.04em", marginTop: 6 }}>{subtitle}</div> : null}
        </div>
        {period ? (
          <span
            style={{
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: 999,
              color: "#64748b",
              flexShrink: 0,
              fontFamily: bodyFont,
              fontSize: 11,
              fontWeight: 700,
              padding: "6px 11px",
              whiteSpace: "nowrap",
            }}
          >
            {period}
          </span>
        ) : null}
      </div>
      {body ? <p style={{ color: "#475569", fontFamily: bodyFont, fontSize: 13, lineHeight: 1.72, margin: 0 }}>{body}</p> : null}
    </div>
  );
}

const defaultDisplayFont = "'Cormorant Garamond', Georgia, serif";
const defaultBodyFont = "'DM Sans', system-ui, sans-serif";

export function ModernFlowCV({
  accent,
  bodyFont = defaultBodyFont,
  data,
  displayFont = defaultDisplayFont,
  pageMode = "preview",
  size = 13,
  skillDisplay = "chips",
}) {
  const isExportPage = pageMode === "export";
  const contactItems = [
    { icon: Mail, text: data.contact.email },
    { icon: Phone, text: data.contact.phone },
    { icon: MapPin, text: data.contact.location },
    { icon: Globe, text: data.contact.website },
  ].filter(item => item.text);

  return (
    <div
      style={{
        background: "#ffffff",
        ...(isExportPage ? { boxSizing: "border-box", minHeight: "100%" } : { minHeight: 900 }),
      }}
    >
      <div
        className="modernflow-header"
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #111827 58%, #020617 100%)",
          borderBottomLeftRadius: 64,
          borderBottomRightRadius: 64,
          color: "white",
          overflow: "hidden",
          padding: "42px 44px 56px",
          position: "relative",
        }}
      >
        <div style={{ background: `${accent}18`, borderRadius: "50%", filter: "blur(56px)", height: 220, position: "absolute", right: -60, top: -90, width: 220 }} />
        <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: "50%", height: 160, left: 80, position: "absolute", top: -90, width: 160 }} />
        <div
          className="modernflow-header-meta"
          style={{ alignItems: "center", display: "flex", gap: 24, justifyContent: "space-between", position: "relative", zIndex: 1 }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: accent, fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", marginBottom: 12, textTransform: "uppercase" }}>
              Modern Flow CV
            </div>
            <h1 style={{ fontFamily: displayFont, fontSize: size * 3.5, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 0.94, margin: 0 }}>
              {data.name}
            </h1>
            {data.title ? <p style={{ color: accent, fontFamily: bodyFont, fontSize: size * 1.15, fontWeight: 600, letterSpacing: "0.05em", margin: "8px 0 18px", textTransform: "uppercase" }}>{data.title}</p> : null}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px 18px" }}>
              {contactItems.map(item => (
                <ContactItem accent={accent} bodyFont={bodyFont} icon={item.icon} key={`${item.text}-${item.icon.displayName ?? "contact"}`}>
                  {item.text}
                </ContactItem>
              ))}
            </div>
          </div>

          <PhotoFrame
            frameStyle={{
              border: "3px solid rgba(255,255,255,0.18)",
              borderRadius: 28,
              boxShadow: "0 18px 38px rgba(2, 6, 23, 0.36)",
              height: 132,
              minWidth: 132,
            }}
            photo={data.photo}
            placeholder={
              <div
                style={{
                  alignItems: "center",
                  background: "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
                  color: "rgba(255,255,255,0.92)",
                  display: "flex",
                  fontFamily: displayFont,
                  fontSize: 40,
                  fontWeight: 700,
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
        </div>
      </div>

      <div className="modernflow-columns" style={{ display: "grid", gridTemplateColumns: "285px minmax(0, 1fr)" }}>
        <aside style={{ background: "#f8fafc", borderRight: "1px solid #e2e8f0", padding: "30px 24px 34px" }}>
          {data.summary ? (
            <section style={{ marginBottom: 30 }}>
              <SectionLabel bodyFont={bodyFont} icon={User}>Profil</SectionLabel>
              <p style={{ color: "#475569", fontFamily: bodyFont, fontSize: 13, lineHeight: 1.74, margin: 0 }}>{data.summary}</p>
            </section>
          ) : null}

          {data.skills.length ? (
            <section style={{ marginBottom: 30 }}>
              <SectionLabel bodyFont={bodyFont} icon={Sparkles}>Skills</SectionLabel>
              <SkillsBlock accent={accent} display={skillDisplay} skills={data.skills} />
            </section>
          ) : null}

          {data.languages.length ? (
            <section style={{ marginBottom: 30 }}>
              <SectionLabel bodyFont={bodyFont} icon={Languages}>Sprachen</SectionLabel>
              <div style={{ display: "grid", gap: 10 }}>
                {data.languages.map(language => (
                  <div key={language.id}>
                    <div style={{ color: "#0f172a", fontFamily: bodyFont, fontSize: 12, fontWeight: 700 }}>{language.name}</div>
                    <div style={{ color: "#64748b", fontFamily: bodyFont, fontSize: 11, marginTop: 2 }}>{language.level}</div>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {data.hobbies.length ? (
            <section>
              <SectionLabel bodyFont={bodyFont} icon={Heart}>Interessen</SectionLabel>
              <p style={{ color: "#475569", fontFamily: bodyFont, fontSize: 13, lineHeight: 1.7, margin: 0 }}>{data.hobbies.join(", ")}</p>
            </section>
          ) : null}
        </aside>

        <main style={{ padding: "30px 32px 36px" }}>
          {data.experience.length ? (
            <section style={{ marginBottom: data.education.length ? 30 : 0 }}>
              <SectionLabel bodyFont={bodyFont} icon={Briefcase}>Berufserfahrung</SectionLabel>
              <div style={{ display: "grid", gap: 24 }}>
                {data.experience.map((item, index) => (
                  <TimelineItem
                    accent={accent}
                    body={item.description}
                    bodyFont={bodyFont}
                    displayFont={displayFont}
                    index={index}
                    key={item.id}
                    period={item.period}
                    subtitle={item.company}
                    title={item.role}
                    total={data.experience.length}
                  />
                ))}
              </div>
            </section>
          ) : null}

          {data.education.length ? (
            <section>
              <SectionLabel bodyFont={bodyFont} icon={GraduationCap}>Ausbildung</SectionLabel>
              <div style={{ display: "grid", gap: 24 }}>
                {data.education.map((item, index) => (
                  <TimelineItem
                    accent={accent}
                    body={[item.details, item.note].filter(Boolean).join(" - ")}
                    bodyFont={bodyFont}
                    displayFont={displayFont}
                    index={index}
                    key={item.id}
                    period={item.period}
                    subtitle={item.institution}
                    title={item.degree}
                    total={data.education.length}
                  />
                ))}
              </div>
            </section>
          ) : null}
        </main>
      </div>
    </div>
  );
}
