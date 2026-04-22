import { Globe, GraduationCap, Languages, Mail, MapPin, Phone, TerminalSquare } from "lucide-react";
import { SkillsBlock } from "./shared.jsx";

const monoFont = "'Space Mono', 'IBM Plex Mono', monospace";
const defaultDisplayFont = "'Space Mono', 'IBM Plex Mono', monospace";
const defaultBodyFont = "'DM Sans', system-ui, sans-serif";

function Prompt({ command }) {
  return (
    <div style={{ fontFamily: monoFont, fontSize: 12, marginBottom: 10 }}>
      <span style={{ color: "#4ade80" }}>guest@portfolio:~$</span>{" "}
      <span style={{ color: "#f8fafc" }}>{command}</span>
    </div>
  );
}

function OutputPanel({ children, accent }) {
  return (
    <div
      style={{
        borderLeft: `2px solid ${accent}40`,
        color: "#9ca3af",
        paddingLeft: 14,
      }}
    >
      {children}
    </div>
  );
}

function InfoLine({ children, icon: Icon, accent }) {
  return (
    <div style={{ alignItems: "center", display: "flex", gap: 10 }}>
      <Icon color={accent} size={14} strokeWidth={2.1} />
      <span>{children}</span>
    </div>
  );
}

function TerminalSkillDisplay({ accent, bodyFont, display, skills }) {
  if (display === "radar") {
    return <div style={{ paddingTop: 6 }}><SkillsBlock accent={accent} dark display="radar" skills={skills} /></div>;
  }

  if (display === "bars") {
    return (
      <div style={{ display: "grid", gap: 12 }}>
        {skills.map(skill => (
          <div key={skill.id}>
            <div style={{ alignItems: "baseline", color: "#e5e7eb", display: "flex", fontFamily: bodyFont, fontSize: 12, justifyContent: "space-between", marginBottom: 6 }}>
              <span>{skill.name}</span>
              <span style={{ color: accent, fontFamily: monoFont, fontSize: 11 }}>{skill.value}%</span>
            </div>
            <div style={{ background: "#202020", borderRadius: 999, height: 4, overflow: "hidden" }}>
              <div style={{ background: accent, borderRadius: 999, height: "100%", width: `${skill.value}%` }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {skills.map(skill => (
        <span
          key={skill.id}
          style={{
            background: "#161616",
            border: `1px solid ${accent}40`,
            borderRadius: 999,
            color: "#d4d4d4",
            fontSize: 11.5,
            padding: "4px 10px",
          }}
        >
          [{skill.name}]
        </span>
      ))}
    </div>
  );
}

function createShellUser(name) {
  const normalized = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");

  return normalized || "portfolio";
}

export function TerminalCV({
  accent,
  bodyFont = defaultBodyFont,
  data,
  displayFont = defaultDisplayFont,
  pageMode = "preview",
  size = 13,
  skillDisplay = "chips",
}) {
  const isExportPage = pageMode === "export";
  const shellUser = createShellUser(data.name);
  const skillCommand = skillDisplay === "bars"
    ? "./skills --view=bars"
    : skillDisplay === "radar"
      ? "./skills --view=radar"
      : "printf \"%s\\n\" $SKILLS";

  return (
    <div
      style={{
        background: "#050505",
        padding: 18,
        ...(isExportPage ? { boxSizing: "border-box", minHeight: "100%" } : { minHeight: 900 }),
      }}
    >
      <div
        className="terminal-shell"
        style={{
          background: "#111111",
          border: "1px solid #252525",
          borderRadius: 24,
          boxShadow: "0 28px 70px rgba(0,0,0,0.55)",
          color: "#d4d4d4",
          fontFamily: monoFont,
          minHeight: "100%",
          overflow: "hidden",
          padding: "18px 22px 26px",
        }}
      >
        <div
          style={{
            alignItems: "center",
            borderBottom: "1px solid #232323",
            color: "#6b7280",
            display: "flex",
            fontSize: 11,
            gap: 12,
            marginBottom: 24,
            paddingBottom: 14,
          }}
        >
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ background: "#ef4444", borderRadius: "50%", height: 12, width: 12 }} />
            <div style={{ background: "#f59e0b", borderRadius: "50%", height: 12, width: 12 }} />
            <div style={{ background: "#22c55e", borderRadius: "50%", height: 12, width: 12 }} />
          </div>
          <div style={{ alignItems: "center", display: "flex", gap: 8, marginLeft: 10 }}>
            <TerminalSquare color={accent} size={14} strokeWidth={2.1} />
            <span>guest@{shellUser} ~ bash</span>
          </div>
        </div>

        <section style={{ marginBottom: 24 }}>
          <Prompt command="whoami" />
          <OutputPanel accent={accent}>
            <div style={{ color: "#60a5fa", fontFamily: displayFont, fontSize: size * 1.62, fontWeight: 700, lineHeight: 1.1 }}>{data.name}</div>
            {data.title ? <div style={{ color: accent, fontFamily: bodyFont, fontSize: size, marginTop: 6 }}>{data.title}</div> : null}
            <div style={{ display: "grid", gap: 9, marginTop: 12 }}>
              {data.contact.email ? <InfoLine accent={accent} icon={Mail}><span style={{ fontFamily: bodyFont }}>{data.contact.email}</span></InfoLine> : null}
              {data.contact.phone ? <InfoLine accent={accent} icon={Phone}><span style={{ fontFamily: bodyFont }}>{data.contact.phone}</span></InfoLine> : null}
              {data.contact.location ? <InfoLine accent={accent} icon={MapPin}><span style={{ fontFamily: bodyFont }}>{data.contact.location}</span></InfoLine> : null}
              {data.contact.website ? <InfoLine accent={accent} icon={Globe}><span style={{ fontFamily: bodyFont }}>{data.contact.website}</span></InfoLine> : null}
            </div>
          </OutputPanel>
        </section>

        {data.summary ? (
          <section style={{ marginBottom: 24 }}>
            <Prompt command="cat profile.md" />
            <OutputPanel accent={accent}>
              <p style={{ color: "#9ca3af", fontFamily: bodyFont, fontSize: 13, lineHeight: 1.78, margin: 0 }}>
                {data.summary}
              </p>
            </OutputPanel>
          </section>
        ) : null}

        {data.experience.length ? (
          <section style={{ marginBottom: 24 }}>
            <Prompt command="ls -la experience/" />
            <OutputPanel accent={accent}>
              <div style={{ display: "grid", gap: 16 }}>
                {data.experience.map(item => (
                  <div key={item.id}>
                    <div style={{ color: "#facc15", fontFamily: displayFont, fontSize: 14, fontWeight: 700 }}>
                      {item.role}{" "}
                      {item.company ? <span style={{ color: "#60a5fa", fontFamily: bodyFont, fontWeight: 500 }}>@ {item.company}</span> : null}
                    </div>
                    {item.period ? <div style={{ color: "#6b7280", fontFamily: bodyFont, fontSize: 11, marginTop: 3 }}>[ {item.period} ]</div> : null}
                    {item.description ? (
                      <p style={{ color: "#9ca3af", fontFamily: bodyFont, fontSize: 13, lineHeight: 1.72, margin: "8px 0 0" }}>
                        {item.description}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            </OutputPanel>
          </section>
        ) : null}

        {data.education.length ? (
          <section style={{ marginBottom: 24 }}>
            <Prompt command="cat education.log" />
            <OutputPanel accent={accent}>
              <div style={{ display: "grid", gap: 14 }}>
                {data.education.map(item => (
                  <div key={item.id}>
                    <div style={{ alignItems: "center", color: "#e5e7eb", display: "flex", gap: 8, fontFamily: displayFont, fontSize: 13, fontWeight: 700 }}>
                      <GraduationCap color={accent} size={14} strokeWidth={2.1} />
                      <span>{item.degree}</span>
                    </div>
                    <div style={{ color: "#93c5fd", fontFamily: bodyFont, fontSize: 12, marginTop: 4 }}>
                      {item.institution}
                      {item.period ? `  //  ${item.period}` : ""}
                    </div>
                    {item.details || item.note ? (
                      <p style={{ color: "#9ca3af", fontFamily: bodyFont, fontSize: 12.5, lineHeight: 1.72, margin: "7px 0 0" }}>
                        {[item.details, item.note].filter(Boolean).join(" | ")}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            </OutputPanel>
          </section>
        ) : null}

        {data.skills.length ? (
          <section style={{ marginBottom: 24 }}>
            <Prompt command={skillCommand} />
            <OutputPanel accent={accent}>
              <TerminalSkillDisplay accent={accent} bodyFont={bodyFont} display={skillDisplay} skills={data.skills} />
            </OutputPanel>
          </section>
        ) : null}

        {data.languages.length || data.hobbies.length ? (
          <section style={{ marginBottom: 12 }}>
            <Prompt command="printenv extras" />
            <OutputPanel accent={accent}>
              {data.languages.length ? (
                <div style={{ alignItems: "center", display: "flex", gap: 8, marginBottom: data.hobbies.length ? 10 : 0 }}>
                  <Languages color={accent} size={14} strokeWidth={2.1} />
                  <span style={{ color: "#e5e7eb", fontFamily: bodyFont }}>
                    {data.languages.map(language => `${language.name} (${language.level})`).join(", ")}
                  </span>
                </div>
              ) : null}
              {data.hobbies.length ? (
                <div style={{ color: "#9ca3af", fontFamily: bodyFont, fontSize: 12.5, lineHeight: 1.72 }}>
                  interests={data.hobbies.join(", ")}
                </div>
              ) : null}
            </OutputPanel>
          </section>
        ) : null}

        <div style={{ fontFamily: monoFont, fontSize: 12, marginTop: 18 }}>
          <span style={{ color: "#4ade80" }}>guest@portfolio:~$</span>{" "}
          <span
            style={{
              animation: isExportPage ? "none" : "pulse 1.2s ease-in-out infinite",
              background: "#d1d5db",
              display: "inline-block",
              height: 16,
              verticalAlign: "middle",
              width: 8,
            }}
          />
        </div>
      </div>
    </div>
  );
}
