import { Globe, GraduationCap, Heart, Languages, Mail, MapPin, Phone, Radar as RadarIcon } from "lucide-react";
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip } from "recharts";
import { SkillsBlock } from "./shared.jsx";

const monoFont = "'Space Mono', 'IBM Plex Mono', monospace";
const defaultDisplayFont = "'DM Sans', system-ui, sans-serif";
const defaultBodyFont = "'DM Sans', system-ui, sans-serif";
const cardStyle = {
  background: "#0b1120",
  border: "1px solid #1e293b",
  borderRadius: 22,
  padding: 22,
};

function DashboardHeading({ children, tone = "primary" }) {
  return (
    <div
      style={{
        color: tone === "primary" ? "#67e8f9" : "#94a3b8",
        fontFamily: monoFont,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.18em",
        marginBottom: 14,
        textTransform: "uppercase",
      }}
    >
      // {children}
    </div>
  );
}

function ContactLine({ accent, bodyFont, children, icon: Icon }) {
  return (
    <div style={{ alignItems: "center", color: "#94a3b8", display: "flex", fontFamily: bodyFont, fontSize: 13, gap: 10 }}>
      <Icon color={accent} size={14} strokeWidth={2.2} />
      <span>{children}</span>
    </div>
  );
}

function RadarPanel({ accent, exportMode, skills }) {
  const radarData = skills.map(skill => ({
    label: skill.name,
    value: skill.value,
  }));

  if (!radarData.length) {
    return <p style={{ color: "#64748b", margin: 0 }}>Keine Skills vorhanden.</p>;
  }

  const tooltipProps = {
    contentStyle: {
      background: "#020617",
      border: "1px solid #1e293b",
      borderRadius: 12,
      color: "#e2e8f0",
      fontFamily: monoFont,
      fontSize: 11,
    },
    formatter: value => [`${value}`, "Level"],
    labelStyle: { color: "#e2e8f0" },
  };

  if (exportMode) {
    return (
      <div style={{ alignItems: "center", display: "flex", justifyContent: "center", minHeight: 230 }}>
        <RadarChart cx="50%" cy="50%" data={radarData} height={230} outerRadius="68%" width={290}>
          <PolarGrid stroke="#334155" />
          <PolarRadiusAxis axisLine={false} stroke="#1e293b" tick={false} />
          <PolarAngleAxis
            dataKey="label"
            stroke="#64748b"
            tick={{ fill: "#94a3b8", fontFamily: monoFont, fontSize: 10 }}
            tickFormatter={value => (value.length > 12 ? `${value.slice(0, 12)}…` : value)}
          />
          <Radar dataKey="value" fill={accent} fillOpacity={0.22} stroke={accent} strokeWidth={2.2} />
        </RadarChart>
      </div>
    );
  }

  return (
    <div style={{ height: 230 }}>
      <ResponsiveContainer height="100%" width="100%">
        <RadarChart cx="50%" cy="50%" data={radarData} outerRadius="68%">
          <PolarGrid stroke="#334155" />
          <PolarRadiusAxis axisLine={false} stroke="#1e293b" tick={false} />
          <PolarAngleAxis
            dataKey="label"
            stroke="#64748b"
            tick={{ fill: "#94a3b8", fontFamily: monoFont, fontSize: 10 }}
            tickFormatter={value => (value.length > 12 ? `${value.slice(0, 12)}…` : value)}
          />
          <Radar dataKey="value" fill={accent} fillOpacity={0.22} stroke={accent} strokeWidth={2.2} />
          <Tooltip {...tooltipProps} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DarkDashboardCV({
  accent,
  bodyFont = defaultBodyFont,
  data,
  displayFont = defaultDisplayFont,
  pageMode = "preview",
  size = 13,
  skillDisplay = "radar",
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
      className="darkdashboard-shell"
      style={{
        background: "#020617",
        color: "#e2e8f0",
        padding: 24,
        ...(isExportPage ? { boxSizing: "border-box", minHeight: "100%" } : { minHeight: 900 }),
      }}
    >
      <header
        style={{
          ...cardStyle,
          alignItems: "flex-start",
          display: "flex",
          gap: 24,
          justifyContent: "space-between",
          marginBottom: 18,
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <DashboardHeading>Curriculum Vitae</DashboardHeading>
          <h1 style={{ color: "#f8fafc", fontFamily: displayFont, fontSize: size * 2.7, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 0.96, margin: 0 }}>
            {data.name}
          </h1>
          {data.title ? <p style={{ color: "#cbd5e1", fontFamily: bodyFont, fontSize: size * 1.05, margin: "8px 0 0" }}>{data.title}</p> : null}
        </div>

        <div style={{ display: "grid", gap: 8, minWidth: 240 }}>
          {contactItems.map(item => (
            <ContactLine accent={accent} bodyFont={bodyFont} icon={item.icon} key={`${item.text}-${item.icon.displayName ?? "contact"}`}>
              {item.text}
            </ContactLine>
          ))}
        </div>
      </header>

      <div className="darkdashboard-grid" style={{ display: "grid", gap: 18, gridTemplateColumns: "minmax(0, 1.28fr) minmax(280px, 0.92fr)" }}>
        <div style={{ display: "grid", gap: 18 }}>
          {data.summary ? (
            <section style={cardStyle}>
              <DashboardHeading>Profil</DashboardHeading>
              <p style={{ color: "#cbd5e1", fontFamily: bodyFont, fontSize: 14, lineHeight: 1.8, margin: 0 }}>{data.summary}</p>
            </section>
          ) : null}

          {data.experience.length ? (
            <section style={cardStyle}>
              <DashboardHeading>Berufserfahrung</DashboardHeading>
              <div style={{ display: "grid", gap: 12 }}>
                {data.experience.map(item => (
                  <article
                    key={item.id}
                    style={{
                      background: "#0f172a",
                      border: "1px solid #1e293b",
                      borderRadius: 18,
                      padding: 16,
                    }}
                  >
                    <div style={{ alignItems: "flex-start", display: "flex", gap: 16, justifyContent: "space-between", marginBottom: 8 }}>
                      <div>
                        <h3 style={{ color: "#f8fafc", fontFamily: displayFont, fontSize: 17, fontWeight: 700, margin: 0 }}>{item.role}</h3>
                        <div style={{ color: accent, fontFamily: bodyFont, fontSize: 13, fontWeight: 600, marginTop: 4 }}>{item.company}</div>
                      </div>
                      {item.period ? (
                        <span
                          style={{
                            background: "#111827",
                            border: "1px solid #1f2937",
                            borderRadius: 999,
                            color: "#94a3b8",
                            fontFamily: monoFont,
                            fontSize: 10,
                            fontWeight: 700,
                            padding: "6px 10px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {item.period}
                        </span>
                      ) : null}
                    </div>
                    {item.description ? <p style={{ color: "#94a3b8", fontFamily: bodyFont, fontSize: 13, lineHeight: 1.75, margin: 0 }}>{item.description}</p> : null}
                  </article>
                ))}
              </div>
            </section>
          ) : null}
        </div>

        <div style={{ display: "grid", gap: 18 }}>
          <section style={cardStyle}>
            <div style={{ alignItems: "center", display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <DashboardHeading>Skills</DashboardHeading>
              <RadarIcon color={accent} size={16} strokeWidth={2.1} />
            </div>
            {skillDisplay === "radar"
              ? <RadarPanel accent={accent} exportMode={isExportPage} skills={data.skills} />
              : <SkillsBlock accent={accent} dark display={skillDisplay} skills={data.skills} />}
          </section>

          {data.skills.length && skillDisplay === "radar" ? (
            <section style={cardStyle}>
              <DashboardHeading tone="secondary">Skill-Level</DashboardHeading>
              <div style={{ display: "grid", gap: 11 }}>
                {data.skills.map(skill => (
                  <div key={`${skill.id}-bar`}>
                    <div style={{ alignItems: "baseline", display: "flex", fontFamily: bodyFont, fontSize: 12, justifyContent: "space-between", marginBottom: 5 }}>
                      <span style={{ color: "#e2e8f0" }}>{skill.name}</span>
                      <span style={{ color: accent, fontFamily: monoFont, fontSize: 11 }}>{skill.value}</span>
                    </div>
                    <div style={{ background: "#1e293b", borderRadius: 999, height: 4, overflow: "hidden" }}>
                      <div style={{ background: accent, borderRadius: 999, height: "100%", width: `${skill.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {data.education.length ? (
            <section style={cardStyle}>
              <div style={{ alignItems: "center", display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                <DashboardHeading>Ausbildung</DashboardHeading>
                <GraduationCap color={accent} size={16} strokeWidth={2.1} />
              </div>
              <div style={{ display: "grid", gap: 12 }}>
                {data.education.map(item => (
                  <article key={item.id} style={{ borderTop: "1px solid #1e293b", paddingTop: 12 }}>
                    <h3 style={{ color: "#f8fafc", fontFamily: displayFont, fontSize: 15, fontWeight: 700, margin: 0 }}>{item.degree}</h3>
                    <div style={{ color: accent, fontFamily: bodyFont, fontSize: 12, fontWeight: 600, marginTop: 4 }}>
                      {item.institution}
                      {item.period ? ` · ${item.period}` : ""}
                    </div>
                    {item.details || item.note ? <p style={{ color: "#94a3b8", fontFamily: bodyFont, fontSize: 12, lineHeight: 1.7, margin: "8px 0 0" }}>{[item.details, item.note].filter(Boolean).join(" · ")}</p> : null}
                  </article>
                ))}
              </div>
            </section>
          ) : null}

          {data.languages.length || data.hobbies.length ? (
            <section style={cardStyle}>
              {data.languages.length ? (
                <div style={{ marginBottom: data.hobbies.length ? 18 : 0 }}>
                  <div style={{ alignItems: "center", display: "flex", justifyContent: "space-between" }}>
                    <DashboardHeading>Sprachen</DashboardHeading>
                    <Languages color={accent} size={16} strokeWidth={2.1} />
                  </div>
                  <div style={{ display: "grid", gap: 9 }}>
                    {data.languages.map(language => (
                      <div key={language.id} style={{ alignItems: "center", display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "#e2e8f0", fontFamily: bodyFont, fontSize: 13, fontWeight: 600 }}>{language.name}</span>
                        <span style={{ color: "#64748b", fontFamily: monoFont, fontSize: 10 }}>{language.level}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {data.hobbies.length ? (
                <div>
                  <div style={{ alignItems: "center", display: "flex", justifyContent: "space-between" }}>
                    <DashboardHeading>Interessen</DashboardHeading>
                    <Heart color={accent} size={16} strokeWidth={2.1} />
                  </div>
                  <p style={{ color: "#94a3b8", fontFamily: bodyFont, fontSize: 13, lineHeight: 1.75, margin: 0 }}>{data.hobbies.join(", ")}</p>
                </div>
              ) : null}
            </section>
          ) : null}
        </div>
      </div>
    </div>
  );
}
