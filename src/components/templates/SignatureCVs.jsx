import { TEMPLATE_COLOR_DEFAULTS } from "../../config/defaults.js";
import { PhotoFrame, useResumeTemplateCopy } from "./shared.jsx";

function getContactItems(data) {
  return [
    data.contact.email,
    data.contact.phone,
    data.contact.location,
    data.contact.website,
  ].filter(Boolean);
}

function getNameParts(name) {
  const [first = "", ...rest] = String(name).trim().split(/\s+/);
  const last = rest.join(" ");

  return {
    first: first || name,
    last,
  };
}

function getAccent(accent, fallback) {
  return accent || fallback;
}

function IdentityPhoto({ data, dark = false, displayFont, frameStyle = {} }) {
  return (
    <PhotoFrame
      frameStyle={{
        background: dark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.06)",
        border: dark ? "1px solid rgba(255,255,255,0.18)" : "1px solid rgba(15,23,42,0.12)",
        borderRadius: 18,
        color: dark ? "rgba(255,255,255,0.82)" : "#111827",
        fontFamily: displayFont,
        fontSize: 28,
        height: 84,
        marginBottom: 20,
        width: 84,
        ...frameStyle,
      }}
      photo={data.photo}
      placeholder={<span>{data.initials}</span>}
      trackForCanvas
    />
  );
}

function SkillChips({ accent, chipText = "#ffffff", skills }) {
  return (
    <div className="cv-pdf-avoid-break" style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      {skills.map(skill => (
        <span
          key={skill.id}
          style={{
            background: accent,
            borderRadius: 20,
            color: chipText,
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.02em",
            padding: "3px 10px",
          }}
        >
          {skill.name}
        </span>
      ))}
    </div>
  );
}

function SkillBars({ accent, dark = false, skills }) {
  return (
    <div className="cv-pdf-avoid-break" style={{ display: "grid", gap: 8 }}>
      {skills.map(skill => (
        <div key={skill.id}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
            <span style={{ color: dark ? "rgba(255,255,255,0.86)" : "#1f2937", fontSize: 11, fontWeight: 600 }}>
              {skill.name}
            </span>
            <span style={{ color: dark ? "rgba(255,255,255,0.5)" : "#6b7280", fontSize: 10 }}>
              {skill.value}%
            </span>
          </div>
          <div style={{ background: dark ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.1)", borderRadius: 2, height: 4, overflow: "hidden" }}>
            <div style={{ background: accent, borderRadius: 2, height: "100%", width: `${skill.value}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function SkillRadar({ accent, dark = false, skills }) {
  const items = skills.slice(0, 6);
  const count = items.length;

  if (count < 3) {
    return <SkillChips accent={accent} chipText={dark ? "#111827" : "#ffffff"} skills={skills} />;
  }

  const size = 132;
  const center = size / 2;
  const radius = 48;
  const step = (2 * Math.PI) / count;
  const point = (index, pct) => ({
    x: center + radius * (pct / 100) * Math.cos(-Math.PI / 2 + index * step),
    y: center + radius * (pct / 100) * Math.sin(-Math.PI / 2 + index * step),
  });
  const outerPoint = index => point(index, 100);
  const pointsToString = points => points.map(item => `${item.x},${item.y}`).join(" ");
  const dataPoints = items.map((skill, index) => point(index, skill.value ?? 60));
  const gridColor = dark ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.1)";
  const labelColor = dark ? "rgba(255,255,255,0.62)" : "#6b7280";

  return (
    <svg className="cv-pdf-avoid-break" style={{ color: labelColor, display: "block", margin: "0 auto", maxWidth: 142 }} viewBox={`0 0 ${size} ${size}`}>
      {[0.35, 0.7, 1].map(scale => (
        <polygon
          fill="none"
          key={scale}
          points={pointsToString(items.map((_, index) => point(index, scale * 100)))}
          stroke={gridColor}
          strokeWidth="1"
        />
      ))}
      {items.map((_, index) => {
        const end = outerPoint(index);
        return <line key={index} stroke={gridColor} strokeWidth="1" x1={center} x2={end.x} y1={center} y2={end.y} />;
      })}
      <polygon fill={accent} fillOpacity="0.24" points={pointsToString(dataPoints)} stroke={accent} strokeLinejoin="round" strokeWidth="1.6" />
      {dataPoints.map((item, index) => <circle cx={item.x} cy={item.y} fill={accent} key={index} r="2.6" />)}
      {items.map((skill, index) => {
        const label = point(index, 118);
        return (
          <text
            dominantBaseline="middle"
            fill="currentColor"
            fontSize="7.5"
            fontWeight="600"
            key={skill.id}
            textAnchor="middle"
            x={label.x}
            y={label.y}
          >
            {skill.name.split("/")[0].trim().slice(0, 10)}
          </text>
        );
      })}
    </svg>
  );
}

function TemplateSkillDisplay({ accent, chipText, dark = false, display, skills }) {
  if (!skills.length) {
    return null;
  }

  if (display === "bars") {
    return <SkillBars accent={accent} dark={dark} skills={skills} />;
  }

  if (display === "radar") {
    return <SkillRadar accent={accent} dark={dark} skills={skills} />;
  }

  return <SkillChips accent={accent} chipText={chipText} skills={skills} />;
}

function LanguageMeterList({ accent, dark = false, languages, size }) {
  if (!languages.length) {
    return null;
  }

  return (
    <div className="cv-pdf-avoid-break" style={{ display: "grid", gap: 8 }}>
      {languages.map(language => (
        <div key={language.id}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
            <span style={{ color: dark ? "rgba(255,255,255,0.88)" : "inherit", fontSize: size - 1, fontWeight: 700 }}>
              {language.name}
            </span>
            <span style={{ color: dark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.55)", fontSize: size - 2 }}>
              {language.level}
            </span>
          </div>
          <div style={{ background: dark ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.1)", borderRadius: 2, height: 3, overflow: "hidden" }}>
            <div style={{ background: accent, borderRadius: 2, height: "100%", width: `${language.value ?? 60}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function ExperienceList({
  accent,
  bodyFont,
  companyColor = "rgba(0,0,0,0.64)",
  items,
  periodColor = "rgba(0,0,0,0.48)",
  size,
  textColor = "rgba(0,0,0,0.72)",
  titleColor = "#111827",
}) {
  if (!items.length) {
    return null;
  }

  return (
    <div style={{ display: "grid", gap: 14 }}>
      {items.map(item => (
        <article className="cv-pdf-avoid-break" key={item.id} style={{ display: "flex", gap: 10 }}>
          <div style={{ flexShrink: 0, paddingTop: 5 }}>
            <div style={{ background: accent, borderRadius: "50%", height: 7, width: 7 }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ alignItems: "baseline", display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "space-between", marginBottom: 1 }}>
              <span style={{ color: titleColor, fontFamily: bodyFont, fontSize: size + 1, fontWeight: 800 }}>{item.role}</span>
              {item.period ? <span style={{ color: periodColor, fontFamily: bodyFont, fontSize: size - 1 }}>{item.period}</span> : null}
            </div>
            {item.company ? <div style={{ color: companyColor, fontFamily: bodyFont, fontSize: size, fontStyle: "italic", marginBottom: 3 }}>{item.company}</div> : null}
            {item.description ? <div style={{ color: textColor, fontFamily: bodyFont, fontSize: size, lineHeight: 1.55 }}>{item.description}</div> : null}
          </div>
        </article>
      ))}
    </div>
  );
}

function EducationList({
  accent,
  bodyFont,
  detailColor = "rgba(0,0,0,0.68)",
  institutionColor = "rgba(0,0,0,0.62)",
  items,
  size,
  titleColor = "#111827",
  variant = "dot",
}) {
  if (!items.length) {
    return null;
  }

  return (
    <div style={{ display: "grid", gap: 12 }}>
      {items.map(item => (
        <article
          className="cv-pdf-avoid-break"
          key={item.id}
          style={variant === "bar" ? { borderLeft: `2px solid ${accent}`, paddingLeft: 12 } : { display: "flex", gap: 10 }}
        >
          {variant === "dot" ? (
            <div style={{ flexShrink: 0, paddingTop: 5 }}>
              <div style={{ background: accent, borderRadius: "50%", height: 7, width: 7 }} />
            </div>
          ) : null}
          <div>
            <div style={{ color: titleColor, fontFamily: bodyFont, fontSize: size + 1, fontWeight: 800 }}>{item.degree}</div>
            <div style={{ color: institutionColor, fontFamily: bodyFont, fontSize: size, fontStyle: "italic" }}>
              {[item.institution, item.period].filter(Boolean).join(" - ")}
            </div>
            {[item.details, item.note].filter(Boolean).length ? (
              <div style={{ color: detailColor, fontFamily: bodyFont, fontSize: size, lineHeight: 1.5, marginTop: 3 }}>
                {[item.details, item.note].filter(Boolean).join(" - ")}
              </div>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  );
}

function SectionLabel({ color, font, label }) {
  return (
    <div style={{ borderBottom: `1px solid ${color}44`, color, fontFamily: font, fontSize: 10, fontWeight: 800, letterSpacing: "0.16em", marginBottom: -4, paddingBottom: 4, textTransform: "uppercase" }}>
      {label}
    </div>
  );
}

function GoldRule({ accent, font, label, size }) {
  return (
    <div style={{ alignItems: "center", display: "flex", gap: 10, marginBottom: 4 }}>
      <span style={{ color: accent, fontFamily: font, fontSize: size - 1, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase" }}>{label}</span>
      <div style={{ background: `linear-gradient(to right, ${accent}88, transparent)`, flex: 1, height: 1 }} />
    </div>
  );
}

function SwissSectionLabel({ accent, font, label, size }) {
  return (
    <div style={{ alignItems: "center", display: "flex", gap: 10, marginBottom: 10 }}>
      <div style={{ background: accent, flexShrink: 0, height: 3, width: 20 }} />
      <span style={{ color: "#111111", fontFamily: font, fontSize: size - 1, fontWeight: 900, letterSpacing: "0.18em", textTransform: "uppercase" }}>{label}</span>
    </div>
  );
}

function BauhausSectionLabel({ font, label, size, yellow }) {
  return (
    <div style={{ alignItems: "center", display: "flex", gap: 10, marginBottom: 8 }}>
      <div style={{ background: yellow, flexShrink: 0, height: 12, width: 12 }} />
      <span style={{ color: "#111111", fontFamily: font, fontSize: size - 1, fontWeight: 900, letterSpacing: "0.18em", textTransform: "uppercase" }}>{label}</span>
      <div style={{ background: "#e0e0e0", flex: 1, height: 1 }} />
    </div>
  );
}

function PrintSection({ crimson, font, label, size }) {
  return (
    <div style={{ alignItems: "center", display: "flex", gap: 6, marginBottom: 8 }}>
      <div style={{ background: "#c4aa7a", flex: 1, height: 1 }} />
      <span style={{ color: crimson, fontFamily: font, fontSize: size - 2, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase" }}>* {label} *</span>
      <div style={{ background: "#c4aa7a", flex: 1, height: 1 }} />
    </div>
  );
}

function ObsidianSection({ font, gold, label, size, light = false }) {
  return (
    <div style={{ borderBottom: `1px solid ${gold}${light ? "55" : "44"}`, marginBottom: light ? 4 : -8, paddingBottom: 6 }}>
      <span style={{ color: gold, fontFamily: font, fontSize: size - 2, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase" }}>{label}</span>
    </div>
  );
}

export function NoirParisianCV({
  accent,
  bodyFont,
  bodyBg,
  data,
  displayFont,
  headerBg,
  pageMode = "preview",
  sidebarSide = "right",
  size = 13,
  skillDisplay = "chips",
}) {
  const copy = useResumeTemplateCopy();
  const defaults = TEMPLATE_COLOR_DEFAULTS.noirparisian;
  const gold = getAccent(accent, defaults.accent);
  const navy = headerBg || defaults.headerBg;
  const cream = bodyBg || defaults.bodyBg;
  const isLeft = sidebarSide === "left";
  const contactItems = getContactItems(data);
  const isExportPage = pageMode === "export";

  const sidebar = (
    <aside style={{ background: navy, display: "flex", flexDirection: "column", flexShrink: 0, gap: 22, padding: "28px 20px", width: 200 }}>
      <IdentityPhoto data={data} dark displayFont={displayFont} frameStyle={{ borderColor: `${gold}66` }} />

      <SectionLabel color={gold} font={bodyFont} label={copy.skills} />
      <TemplateSkillDisplay accent={gold} chipText={navy} dark display={skillDisplay} skills={data.skills} />

      <SectionLabel color={gold} font={bodyFont} label={copy.languages} />
      <LanguageMeterList accent={gold} dark languages={data.languages} size={size} />

      {data.hobbies.length ? (
        <>
          <SectionLabel color={gold} font={bodyFont} label={copy.interests} />
          <div className="cv-pdf-avoid-break" style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {data.hobbies.map(item => (
              <span key={item} style={{ border: `1px solid ${gold}59`, borderRadius: 2, color: "rgba(255,255,255,0.62)", fontFamily: bodyFont, fontSize: size - 2, padding: "2px 8px" }}>{item}</span>
            ))}
          </div>
        </>
      ) : null}
    </aside>
  );

  return (
    <div style={{ background: cream, color: "#2a1e12", fontFamily: bodyFont, fontSize: size, minHeight: isExportPage ? 900 : 900 }}>
      <header style={{ background: navy, clipPath: "polygon(0 0, 100% 0, 100% 80%, 0 100%)", padding: "36px 40px 52px", position: "relative" }}>
        <div style={{ color: "#ffffff", fontFamily: displayFont, fontSize: 38, fontStyle: "italic", fontWeight: 500, letterSpacing: "-0.01em", lineHeight: 1.1 }}>{data.name}</div>
        {data.title ? <div style={{ color: gold, fontFamily: bodyFont, fontSize: size + 1, letterSpacing: "0.18em", marginBottom: 16, marginTop: 6, textTransform: "uppercase" }}>{data.title}</div> : null}
        {contactItems.length ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 18 }}>
            {contactItems.map(item => (
              <span key={item} style={{ alignItems: "center", color: "rgba(255,255,255,0.62)", display: "flex", fontFamily: bodyFont, fontSize: size - 1, gap: 5 }}>
                <span style={{ color: gold }}>-</span> {item}
              </span>
            ))}
          </div>
        ) : null}
      </header>

      <div style={{ display: "flex", flexDirection: isLeft ? "row" : "row-reverse", minHeight: 720 }}>
        {sidebar}
        <main style={{ display: "flex", flex: 1, flexDirection: "column", gap: 24, padding: "32px 36px" }}>
          {data.summary ? (
            <section>
              <GoldRule accent={gold} font={bodyFont} label={copy.profile} size={size} />
              <p style={{ color: "#44362a", fontFamily: bodyFont, fontSize: size, lineHeight: 1.7, margin: "10px 0 0" }}>{data.summary}</p>
            </section>
          ) : null}

          <section>
            <GoldRule accent={gold} font={bodyFont} label={copy.experience} size={size} />
            <div style={{ marginTop: 12 }}>
              <ExperienceList accent={gold} bodyFont={bodyFont} items={data.experience} size={size} textColor="#5f5144" />
            </div>
          </section>

          <section>
            <GoldRule accent={gold} font={bodyFont} label={copy.education} size={size} />
            <div style={{ marginTop: 12 }}>
              <EducationList accent={gold} bodyFont={bodyFont} items={data.education} size={size} />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export function SwissSignalCV({
  accent,
  bodyFont,
  bodyBg,
  data,
  displayFont,
  headerBg,
  pageMode = "preview",
  sidebarSide = "right",
  size = 13,
  skillDisplay = "chips",
}) {
  const copy = useResumeTemplateCopy();
  const defaults = TEMPLATE_COLOR_DEFAULTS.swisssignal;
  const red = headerBg || defaults.headerBg;
  const accentColor = getAccent(accent, defaults.accent);
  const white = bodyBg || defaults.bodyBg;
  const isLeft = sidebarSide === "left";
  const contactItems = getContactItems(data);
  const nameParts = getNameParts(data.name);
  const isExportPage = pageMode === "export";

  const sidebar = (
    <aside style={{ background: "#f7f7f7", borderLeft: isLeft ? "none" : `5px solid ${red}`, borderRight: isLeft ? `5px solid ${red}` : "none", display: "flex", flexDirection: "column", flexShrink: 0, gap: 22, padding: "28px 22px", width: 210 }}>
      <IdentityPhoto data={data} displayFont={displayFont} frameStyle={{ borderColor: `${red}33`, borderRadius: 999 }} />

      <SwissSectionLabel accent={red} font={bodyFont} label={copy.skills} size={size} />
      <TemplateSkillDisplay accent={accentColor} chipText="#ffffff" display={skillDisplay} skills={data.skills} />

      <SwissSectionLabel accent={red} font={bodyFont} label={copy.languages} size={size} />
      <LanguageMeterList accent={accentColor} languages={data.languages} size={size} />

      {data.hobbies.length ? (
        <>
          <SwissSectionLabel accent={red} font={bodyFont} label={copy.interests} size={size} />
          <div className="cv-pdf-avoid-break" style={{ display: "grid", gap: 5 }}>
            {data.hobbies.map(item => (
              <span key={item} style={{ alignItems: "center", color: "#333333", display: "flex", fontFamily: bodyFont, fontSize: size - 1, gap: 6 }}>
                <span style={{ background: red, display: "inline-block", flexShrink: 0, height: 1, width: 8 }} />{item}
              </span>
            ))}
          </div>
        </>
      ) : null}
    </aside>
  );

  return (
    <div style={{ background: white, fontFamily: bodyFont, fontSize: size, minHeight: isExportPage ? 900 : 900 }}>
      <header style={{ alignItems: "flex-end", borderBottom: `3px solid ${red}`, display: "flex", justifyContent: "space-between", padding: "36px 40px 28px" }}>
        <div>
          <div style={{ color: "#111111", fontFamily: bodyFont, fontSize: 42, fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1, textTransform: "uppercase" }}>
            <div>{nameParts.first}</div>
            <div style={{ color: red }}>{nameParts.last || nameParts.first}</div>
          </div>
          {data.title ? <div style={{ color: "#888888", fontFamily: bodyFont, fontSize: size, letterSpacing: "0.2em", marginTop: 8, textTransform: "uppercase" }}>{data.title}</div> : null}
        </div>
        {contactItems.length ? (
          <div style={{ display: "grid", gap: 4, textAlign: "right" }}>
            {contactItems.map(item => <span key={item} style={{ color: "#555555", fontFamily: bodyFont, fontSize: size - 1 }}>{item}</span>)}
          </div>
        ) : null}
      </header>

      <div style={{ display: "flex", flexDirection: isLeft ? "row" : "row-reverse", minHeight: 720 }}>
        {sidebar}
        <main style={{ display: "flex", flex: 1, flexDirection: "column", gap: 26, padding: "32px 36px" }}>
          {data.summary ? (
            <section>
              <SwissSectionLabel accent={red} font={bodyFont} label={copy.profile} size={size} />
              <p style={{ color: "#333333", fontFamily: bodyFont, fontSize: size, lineHeight: 1.7, margin: "8px 0 0" }}>{data.summary}</p>
            </section>
          ) : null}
          <section>
            <SwissSectionLabel accent={red} font={bodyFont} label={copy.experience} size={size} />
            <div style={{ marginTop: 12 }}>
              <ExperienceList accent={accentColor} bodyFont={bodyFont} items={data.experience} size={size} />
            </div>
          </section>
          <section>
            <SwissSectionLabel accent={red} font={bodyFont} label={copy.education} size={size} />
            <div style={{ marginTop: 12 }}>
              <EducationList accent={accentColor} bodyFont={bodyFont} institutionColor={accentColor} items={data.education} size={size} variant="bar" />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export function BauhausBlocksCV({
  accent,
  bodyFont,
  bodyBg,
  data,
  displayFont,
  headerBg,
  pageMode = "preview",
  sidebarSide = "right",
  size = 13,
  skillDisplay = "chips",
}) {
  const copy = useResumeTemplateCopy();
  const defaults = TEMPLATE_COLOR_DEFAULTS.bauhausblocks;
  const yellow = headerBg || defaults.headerBg;
  const accentColor = getAccent(accent, defaults.accent);
  const pageBg = bodyBg || defaults.bodyBg;
  const black = "#111111";
  const isLeft = sidebarSide === "left";
  const contactItems = getContactItems(data);
  const nameParts = getNameParts(data.name);
  const isExportPage = pageMode === "export";

  const sidebar = (
    <aside style={{ background: black, display: "flex", flexDirection: "column", flexShrink: 0, gap: 20, padding: "28px 20px", width: 200 }}>
      <IdentityPhoto data={data} dark displayFont={displayFont} frameStyle={{ borderColor: `${yellow}66`, borderRadius: 6 }} />

      <BauhausSectionLabel font={bodyFont} label={copy.skills} size={size} yellow={accentColor} />
      <TemplateSkillDisplay accent={accentColor} chipText={black} dark display={skillDisplay} skills={data.skills} />

      <BauhausSectionLabel font={bodyFont} label={copy.languages} size={size} yellow={accentColor} />
      <LanguageMeterList accent={accentColor} dark languages={data.languages} size={size} />

      {data.hobbies.length ? (
        <>
          <BauhausSectionLabel font={bodyFont} label={copy.interests} size={size} yellow={accentColor} />
          <div className="cv-pdf-avoid-break" style={{ display: "grid", gap: 5 }}>
            {data.hobbies.map(item => (
              <span key={item} style={{ alignItems: "center", color: "#bbbbbb", display: "flex", fontFamily: bodyFont, fontSize: size - 1, gap: 6 }}>
                <span style={{ background: accentColor, display: "inline-block", flexShrink: 0, height: 6, width: 6 }} />{item}
              </span>
            ))}
          </div>
        </>
      ) : null}
    </aside>
  );

  return (
    <div style={{ background: pageBg, fontFamily: bodyFont, fontSize: size, minHeight: isExportPage ? 900 : 900 }}>
      <header style={{ display: "flex", height: 130 }}>
        <div style={{ alignItems: "flex-end", background: yellow, display: "flex", flex: 3, padding: "28px 36px" }}>
          <div>
            <div style={{ color: black, fontFamily: bodyFont, fontSize: 44, fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1, textTransform: "uppercase" }}>{nameParts.first}</div>
            {data.title ? <div style={{ color: "rgba(0,0,0,0.54)", fontFamily: bodyFont, fontSize: size - 1, letterSpacing: "0.22em", marginTop: 4, textTransform: "uppercase" }}>{data.title}</div> : null}
          </div>
        </div>
        <div style={{ alignItems: "flex-end", background: black, display: "flex", flex: 2, padding: "28px 24px" }}>
          <div style={{ color: yellow, fontFamily: bodyFont, fontSize: 44, fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1, textTransform: "uppercase" }}>{nameParts.last || nameParts.first}</div>
        </div>
        <div style={{ alignSelf: "stretch", background: yellow, width: 16 }} />
      </header>

      {contactItems.length ? (
        <div style={{ background: pageBg, borderBottom: `3px solid ${accentColor}`, display: "flex", flexWrap: "wrap", gap: 24, padding: "10px 36px" }}>
          {contactItems.map(item => <span key={item} style={{ color: "#555555", fontFamily: bodyFont, fontSize: size - 1 }}>{item}</span>)}
        </div>
      ) : null}

      <div style={{ display: "flex", flexDirection: isLeft ? "row" : "row-reverse", minHeight: 690 }}>
        {sidebar}
        <main style={{ display: "flex", flex: 1, flexDirection: "column", gap: 22, padding: "28px 32px" }}>
          {data.summary ? (
            <section>
              <BauhausSectionLabel font={bodyFont} label={copy.profile} size={size} yellow={accentColor} />
              <p style={{ color: "#333333", fontFamily: bodyFont, fontSize: size, lineHeight: 1.7, margin: "8px 0 0" }}>{data.summary}</p>
            </section>
          ) : null}
          <section>
            <BauhausSectionLabel font={bodyFont} label={copy.experience} size={size} yellow={accentColor} />
            <div style={{ marginTop: 10 }}>
              <ExperienceList accent={accentColor} bodyFont={bodyFont} items={data.experience} size={size} />
            </div>
          </section>
          <section>
            <BauhausSectionLabel font={bodyFont} label={copy.education} size={size} yellow={accentColor} />
            <div style={{ marginTop: 10 }}>
              <EducationList accent={accentColor} bodyFont={bodyFont} items={data.education} size={size} variant="bar" />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export function AuroraDuskCV({
  accent,
  bodyFont,
  bodyBg,
  data,
  displayFont,
  headerBg,
  pageMode = "preview",
  sidebarSide = "right",
  size = 13,
  skillDisplay = "chips",
}) {
  const copy = useResumeTemplateCopy();
  const defaults = TEMPLATE_COLOR_DEFAULTS.auroradusk;
  const purple = headerBg || defaults.headerBg;
  const teal = getAccent(accent, defaults.accent);
  const lavender = bodyBg || defaults.bodyBg;
  const isLeft = sidebarSide === "left";
  const contactItems = getContactItems(data);
  const isExportPage = pageMode === "export";
  const cardStyle = {
    background: "#ffffff",
    border: `1px solid ${purple}14`,
    borderRadius: 12,
    boxShadow: `0 1px 8px ${purple}12`,
    padding: "18px 20px",
  };

  const sidebar = (
    <aside style={{ background: lavender, borderLeft: isLeft ? "none" : `1px solid ${purple}1c`, borderRight: isLeft ? `1px solid ${purple}1c` : "none", display: "flex", flexDirection: "column", flexShrink: 0, gap: 18, padding: "28px 20px", width: 220 }}>
      <div style={cardStyle}>
        <IdentityPhoto data={data} displayFont={displayFont} frameStyle={{ borderColor: `${purple}22`, height: 76, marginBottom: 14, width: 76 }} />
        <SectionLabel color={purple} font={bodyFont} label={copy.skills} />
        <div style={{ marginTop: 10 }}>
          <TemplateSkillDisplay accent={purple} chipText="#ffffff" display={skillDisplay} skills={data.skills} />
        </div>
      </div>
      <div style={cardStyle}>
        <SectionLabel color={purple} font={bodyFont} label={copy.languages} />
        <div style={{ marginTop: 10 }}>
          <LanguageMeterList accent={purple} languages={data.languages} size={size} />
        </div>
      </div>
      {data.hobbies.length ? (
        <div style={cardStyle}>
          <SectionLabel color={purple} font={bodyFont} label={copy.interests} />
          <div className="cv-pdf-avoid-break" style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 10 }}>
            {data.hobbies.map(item => <span key={item} style={{ background: `${purple}14`, borderRadius: 20, color: purple, fontFamily: bodyFont, fontSize: size - 2, padding: "2px 9px" }}>{item}</span>)}
          </div>
        </div>
      ) : null}
    </aside>
  );

  return (
    <div style={{ background: lavender, fontFamily: bodyFont, fontSize: size, minHeight: isExportPage ? 900 : 900 }}>
      <header style={{ background: `linear-gradient(135deg, ${purple} 0%, ${teal} 100%)`, borderRadius: "0 0 32px 32px", marginBottom: -30, padding: "40px 40px 60px", position: "relative" }}>
        <div style={{ color: "#ffffff", fontFamily: displayFont, fontSize: 36, fontWeight: 800, letterSpacing: "-0.01em", marginBottom: 4 }}>{data.name}</div>
        {data.title ? <div style={{ color: "rgba(255,255,255,0.82)", fontFamily: bodyFont, fontSize: size + 1, letterSpacing: "0.1em", marginBottom: 16, textTransform: "uppercase" }}>{data.title}</div> : null}
        {contactItems.length ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            {contactItems.map(item => <span key={item} style={{ background: "rgba(255,255,255,0.15)", borderRadius: 20, color: "rgba(255,255,255,0.82)", fontFamily: bodyFont, fontSize: size - 1, padding: "3px 12px" }}>{item}</span>)}
          </div>
        ) : null}
      </header>

      <div style={{ display: "flex", flexDirection: isLeft ? "row" : "row-reverse", minHeight: 690, paddingTop: 40 }}>
        {sidebar}
        <main style={{ display: "flex", flex: 1, flexDirection: "column", gap: 16, padding: "0 28px 28px" }}>
          {data.summary ? (
            <section style={cardStyle}>
              <SectionLabel color={purple} font={bodyFont} label={copy.profile} />
              <p style={{ color: "#374151", fontFamily: bodyFont, fontSize: size, lineHeight: 1.7, margin: "8px 0 0" }}>{data.summary}</p>
            </section>
          ) : null}
          <section style={cardStyle}>
            <SectionLabel color={purple} font={bodyFont} label={copy.experience} />
            <div style={{ marginTop: 12 }}>
              <ExperienceList accent={purple} bodyFont={bodyFont} items={data.experience} size={size} />
            </div>
          </section>
          <section style={cardStyle}>
            <SectionLabel color={purple} font={bodyFont} label={copy.education} />
            <div style={{ marginTop: 10 }}>
              <EducationList accent={teal} bodyFont={bodyFont} institutionColor={purple} items={data.education} size={size} />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export function PrintGuildCV({
  accent,
  bodyFont,
  bodyBg,
  data,
  displayFont,
  headerBg,
  pageMode = "preview",
  sidebarSide = "right",
  size = 13,
  skillDisplay = "chips",
}) {
  const copy = useResumeTemplateCopy();
  const defaults = TEMPLATE_COLOR_DEFAULTS.printguild;
  const crimson = getAccent(accent, defaults.accent);
  const masthead = headerBg || defaults.headerBg;
  const ink = "#2a1a0e";
  const paper = bodyBg || defaults.bodyBg;
  const isLeft = sidebarSide === "left";
  const contactItems = getContactItems(data);
  const isExportPage = pageMode === "export";

  const sidebar = (
    <aside style={{ background: paper, borderLeft: isLeft ? "none" : "3px double #c4aa7a", borderRight: isLeft ? "3px double #c4aa7a" : "none", display: "flex", flexDirection: "column", flexShrink: 0, gap: 20, padding: "28px 20px", width: 210 }}>
      <IdentityPhoto data={data} displayFont={displayFont} frameStyle={{ background: paper, borderColor: "#c4aa7a", borderRadius: 2 }} />

      <PrintSection crimson={crimson} font={bodyFont} label={copy.skills} size={size} />
      <TemplateSkillDisplay accent={crimson} chipText="#ffffff" display={skillDisplay} skills={data.skills} />

      <PrintSection crimson={crimson} font={bodyFont} label={copy.languages} size={size} />
      <LanguageMeterList accent={crimson} languages={data.languages} size={size} />

      {data.hobbies.length ? (
        <>
          <PrintSection crimson={crimson} font={bodyFont} label={copy.interests} size={size} />
          <div className="cv-pdf-avoid-break" style={{ display: "grid", gap: 5 }}>
            {data.hobbies.map(item => <span key={item} style={{ color: ink, fontFamily: bodyFont, fontSize: size - 1 }}>- {item}</span>)}
          </div>
        </>
      ) : null}
    </aside>
  );

  return (
    <div style={{ background: paper, color: ink, fontFamily: bodyFont, fontSize: size, minHeight: isExportPage ? 900 : 900 }}>
      <header style={{ background: masthead, borderBottom: "3px double #c4aa7a", padding: "28px 36px 16px", textAlign: "center" }}>
        <div style={{ color: paper, fontFamily: displayFont, fontSize: 48, fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1 }}>{data.name}</div>
        {data.title ? (
          <div style={{ alignItems: "center", display: "flex", gap: 14, justifyContent: "center", marginTop: 8 }}>
            <div style={{ background: "#c4aa7a", flex: 1, height: 1 }} />
            <span style={{ color: crimson, fontFamily: bodyFont, fontSize: size - 1, letterSpacing: "0.18em", textTransform: "uppercase" }}>{data.title}</span>
            <div style={{ background: "#c4aa7a", flex: 1, height: 1 }} />
          </div>
        ) : null}
        {contactItems.length ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center", marginTop: 8 }}>
            {contactItems.map(item => <span key={item} style={{ color: paper, fontFamily: bodyFont, fontSize: size - 2 }}>{item}</span>)}
          </div>
        ) : null}
      </header>

      <div style={{ display: "flex", flexDirection: isLeft ? "row" : "row-reverse", minHeight: 740 }}>
        {sidebar}
        <main style={{ display: "flex", flex: 1, flexDirection: "column", gap: 20, padding: "24px 32px" }}>
          {data.summary ? (
            <section>
              <PrintSection crimson={crimson} font={bodyFont} label={copy.profile} size={size} />
              <p style={{ fontFamily: bodyFont, fontSize: size, lineHeight: 1.75, margin: "8px 0 0", textAlign: "justify" }}>{data.summary}</p>
            </section>
          ) : null}
          <section>
            <PrintSection crimson={crimson} font={bodyFont} label={copy.experience} size={size} />
            <div style={{ marginTop: 10 }}>
              <ExperienceList accent={crimson} bodyFont={bodyFont} items={data.experience} size={size} textColor={ink} />
            </div>
          </section>
          <section>
            <PrintSection crimson={crimson} font={bodyFont} label={copy.education} size={size} />
            <div style={{ marginTop: 10 }}>
              <EducationList accent={crimson} bodyFont={bodyFont} detailColor={ink} institutionColor="#6b5030" items={data.education} size={size} variant="bar" />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export function ObsidianEdgeCV({
  accent,
  bodyFont,
  bodyBg,
  data,
  displayFont,
  headerBg,
  pageMode = "preview",
  sidebarSide = "right",
  size = 13,
  skillDisplay = "chips",
}) {
  const copy = useResumeTemplateCopy();
  const defaults = TEMPLATE_COLOR_DEFAULTS.obsidianedge;
  const gold = getAccent(accent, defaults.accent);
  const nearBlack = headerBg || defaults.headerBg;
  const silk = bodyBg || defaults.bodyBg;
  const isLeft = sidebarSide === "left";
  const contactItems = getContactItems(data);
  const isExportPage = pageMode === "export";

  const sidebar = (
    <aside style={{ background: nearBlack, display: "flex", flexDirection: "column", flexShrink: 0, gap: 22, padding: "28px 20px", width: 200 }}>
      <IdentityPhoto data={data} dark displayFont={displayFont} frameStyle={{ borderColor: `${gold}55`, borderRadius: 2 }} />

      <ObsidianSection font={bodyFont} gold={gold} label={copy.skills} size={size} />
      <TemplateSkillDisplay accent={gold} chipText={nearBlack} dark display={skillDisplay} skills={data.skills} />

      <ObsidianSection font={bodyFont} gold={gold} label={copy.languages} size={size} />
      <LanguageMeterList accent={gold} dark languages={data.languages} size={size} />

      {data.hobbies.length ? (
        <>
          <ObsidianSection font={bodyFont} gold={gold} label={copy.interests} size={size} />
          <div className="cv-pdf-avoid-break" style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {data.hobbies.map(item => <span key={item} style={{ border: `1px solid ${gold}44`, borderRadius: 2, color: "#aaaaaa", fontFamily: bodyFont, fontSize: size - 2, padding: "2px 8px" }}>{item}</span>)}
          </div>
        </>
      ) : null}
    </aside>
  );

  return (
    <div style={{ background: silk, fontFamily: bodyFont, fontSize: size, minHeight: isExportPage ? 900 : 900 }}>
      <header style={{ background: nearBlack, padding: "44px 40px 36px" }}>
        <div style={{ borderBottom: `1px solid ${gold}55`, marginBottom: 16, paddingBottom: 6 }}>
          <div style={{ color: "#ffffff", fontFamily: displayFont, fontSize: 42, fontWeight: 500, letterSpacing: "-0.02em", lineHeight: 1.05 }}>{data.name}</div>
        </div>
        <div style={{ alignItems: "center", display: "flex", justifyContent: "space-between", gap: 18 }}>
          {data.title ? <div style={{ color: gold, fontFamily: bodyFont, fontSize: size, letterSpacing: "0.22em", textTransform: "uppercase" }}>{data.title}</div> : <span />}
          {contactItems.length ? (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 18, justifyContent: "flex-end" }}>
              {contactItems.map(item => <span key={item} style={{ color: "#777777", fontFamily: bodyFont, fontSize: size - 1 }}>{item}</span>)}
            </div>
          ) : null}
        </div>
      </header>
      <div style={{ background: `linear-gradient(to right, ${gold}, transparent)`, height: 2 }} />

      <div style={{ display: "flex", flexDirection: isLeft ? "row" : "row-reverse", minHeight: 720 }}>
        {sidebar}
        <main style={{ display: "flex", flex: 1, flexDirection: "column", gap: 24, padding: "32px 36px" }}>
          {data.summary ? (
            <section>
              <ObsidianSection font={bodyFont} gold={gold} label={copy.profile} light size={size} />
              <p style={{ color: "#444444", fontFamily: bodyFont, fontSize: size, lineHeight: 1.75, margin: "10px 0 0" }}>{data.summary}</p>
            </section>
          ) : null}
          <section>
            <ObsidianSection font={bodyFont} gold={gold} label={copy.experience} light size={size} />
            <div style={{ marginTop: 12 }}>
              <ExperienceList accent={gold} bodyFont={bodyFont} items={data.experience} periodColor={gold} size={size} textColor="#666666" />
            </div>
          </section>
          <section>
            <ObsidianSection font={bodyFont} gold={gold} label={copy.education} light size={size} />
            <div style={{ marginTop: 12 }}>
              <EducationList accent={gold} bodyFont={bodyFont} institutionColor={gold} items={data.education} size={size} variant="bar" />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
