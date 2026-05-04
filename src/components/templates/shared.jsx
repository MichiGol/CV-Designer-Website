import {
  LANGUAGE_LEVEL_LABELS,
  SKILL_LEVEL_LABELS,
  SKILL_LEVEL_VALUE,
} from "../../config/layoutConfig.js";
import { useLanguage } from "../../context/LanguageContext.jsx";
import { FONT_EDITOR } from "../../styles/tokens.js";

export const RESUME_TEMPLATE_COPY = {
  DE: {
    education: "Ausbildung",
    experience: "Berufserfahrung",
    gradePrefix: "Note",
    interests: "Interessen",
    languages: "Sprachen",
    nameFallback: "Vorname Nachname",
    profile: "Profil",
    profilePhoto: "Profilfoto",
    skills: "Faehigkeiten",
    skillsAndLanguages: "Kenntnisse & Sprachen",
    knowledge: "Kenntnisse",
    details: "Weitere Details",
    noSkills: "Keine Skills vorhanden.",
    skillLevel: "Skill-Level",
  },
  EN: {
    education: "Education",
    experience: "Experience",
    gradePrefix: "Grade",
    interests: "Interests",
    languages: "Languages",
    nameFallback: "First name Last name",
    profile: "Profile",
    profilePhoto: "Profile photo",
    skills: "Skills",
    skillsAndLanguages: "Skills & Languages",
    knowledge: "Knowledge",
    details: "Additional Details",
    noSkills: "No skills available.",
    skillLevel: "Skill Level",
  },
};

export function useResumeTemplateCopy() {
  const { languageCode } = useLanguage();

  return RESUME_TEMPLATE_COPY[languageCode];
}

const LANGUAGE_LEVEL_VALUE = {
  Muttersprache: 100,
  "Verhandlungssicher (C2)": 95,
  "FlieÃŸend (C1)": 86,
  "Fortgeschritten (B2)": 74,
  "Mittelstufe (B1)": 58,
  "Grundkenntnisse (A2)": 40,
};

function formatPeriod(start, end) {
  if (start && end) {
    return `${start} - ${end}`;
  }

  return start || end || "";
}

function getInitials(firstName, lastName) {
  const initials = `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.trim().toUpperCase();
  return initials || "CV";
}

export function normalizePhotoConfig(source) {
  const rawPhoto = source?.photo;
  const src =
    typeof rawPhoto === "string"
      ? rawPhoto
      : rawPhoto && typeof rawPhoto === "object"
        ? rawPhoto.src ?? null
        : null;

  if (!src) {
    return null;
  }

  const positionX =
    typeof rawPhoto === "object" && rawPhoto !== null && Number.isFinite(rawPhoto.positionX)
      ? rawPhoto.positionX
      : source?.photoPositionX ?? 50;
  const positionY =
    typeof rawPhoto === "object" && rawPhoto !== null && Number.isFinite(rawPhoto.positionY)
      ? rawPhoto.positionY
      : source?.photoPositionY ?? 50;
  const scale =
    typeof rawPhoto === "object" && rawPhoto !== null && Number.isFinite(rawPhoto.scale)
      ? rawPhoto.scale
      : source?.photoScale ?? 1;

  return {
    positionX: Math.max(0, Math.min(100, positionX)),
    positionY: Math.max(0, Math.min(100, positionY)),
    scale: Math.max(1, Math.min(3, scale)),
    src,
  };
}

export function PhotoFrame({
  alt,
  frameStyle,
  imageStyle,
  photo,
  placeholder = null,
  trackForCanvas = false,
}) {
  const copy = useResumeTemplateCopy();
  const frameProps = trackForCanvas ? { "data-canvas-image-frame": "true" } : {};
  const imageProps = trackForCanvas ? { "data-canvas-image-inner": "true" } : {};

  return (
    <div
      {...frameProps}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        position: "relative",
        ...frameStyle,
      }}
    >
      {photo?.src ? (
        <img
          {...imageProps}
          alt={alt ?? copy.profilePhoto}
          src={photo.src}
          style={{
            display: "block",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: `${photo.positionX}% ${photo.positionY}%`,
            transform: `scale(${photo.scale})`,
            transformOrigin: `${photo.positionX}% ${photo.positionY}%`,
            ...imageStyle,
          }}
        />
      ) : (
        placeholder
      )}
    </div>
  );
}

export function buildTemplateData(cv, languageCode = "DE") {
  const personal = cv.personal ?? {};
  const copy = RESUME_TEMPLATE_COPY[languageCode] ?? RESUME_TEMPLATE_COPY.DE;

  return {
    name: [personal.firstName, personal.lastName].filter(Boolean).join(" ").trim() || copy.nameFallback,
    initials: getInitials(personal.firstName, personal.lastName),
    title: personal.title || "",
    photo: normalizePhotoConfig(personal),
    summary: personal.summary || "",
    contact: {
      email: personal.email || "",
      phone: personal.phone || "",
      location: personal.address || "",
      website: personal.website || "",
    },
    experience: (cv.experience ?? []).map(item => ({
      ...item,
      period: formatPeriod(item.start, item.end),
    })),
    education: (cv.education ?? []).map(item => ({
      ...item,
      period: formatPeriod(item.start, item.end),
      details: item.description || "",
      note: item.grade ? `${copy.gradePrefix} ${item.grade}` : "",
    })),
    skills: (cv.skills ?? []).map(item => ({
      ...item,
      levelLabel: SKILL_LEVEL_LABELS[item.level]?.[languageCode] ?? item.level,
      value: SKILL_LEVEL_VALUE[item.level] ?? 60,
    })),
    languages: (cv.languages ?? []).map(item => ({
      ...item,
      level: LANGUAGE_LEVEL_LABELS[item.level]?.[languageCode] ?? item.level,
      value: LANGUAGE_LEVEL_VALUE[item.level] ?? 60,
    })),
    hobbies: cv.hobbies ?? [],
  };
}

export function SkillChip({ name, accent, dark = false }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "3px 10px",
        borderRadius: 20,
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: "0.02em",
        background: dark ? "rgba(255,255,255,0.14)" : `${accent}14`,
        color: dark ? "rgba(255,255,255,0.9)" : accent,
        border: dark ? "1px solid rgba(255,255,255,0.18)" : `1px solid ${accent}28`,
      }}
    >
      {name}
    </span>
  );
}

export function SkillBar({ name, level, levelLabel, accent, dark = false }) {
  const pct = SKILL_LEVEL_VALUE[level] ?? 60;

  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 10, fontWeight: 600, color: dark ? "rgba(255,255,255,0.85)" : "#334155", fontFamily: FONT_EDITOR }}>
          {name}
        </span>
        <span style={{ fontSize: 9, color: dark ? "rgba(255,255,255,0.45)" : "#94a3b8", fontFamily: FONT_EDITOR }}>
          {levelLabel ?? level}
        </span>
      </div>
      <div style={{ height: 4, borderRadius: 4, background: dark ? "rgba(255,255,255,0.12)" : `${accent}18`, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, borderRadius: 4, background: dark ? "rgba(255,255,255,0.75)" : accent }} />
      </div>
    </div>
  );
}

export function SkillRadar({ skills, accent, dark = false }) {
  const items = skills.slice(0, 6);
  const count = items.length;

  if (count < 3) {
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
        {skills.map(skill => (
          <SkillChip key={skill.id} accent={accent} dark={dark} name={skill.name} />
        ))}
      </div>
    );
  }

  const cx = 80;
  const cy = 80;
  const radius = 60;
  const step = (2 * Math.PI) / count;
  const toXY = (index, pct) => ({
    x: cx + radius * (pct / 100) * Math.cos(-Math.PI / 2 + index * step),
    y: cy + radius * (pct / 100) * Math.sin(-Math.PI / 2 + index * step),
  });
  const spokeEnd = index => ({
    x: cx + radius * Math.cos(-Math.PI / 2 + index * step),
    y: cy + radius * Math.sin(-Math.PI / 2 + index * step),
  });
  const labelPoint = index => ({
    x: cx + (radius + 16) * Math.cos(-Math.PI / 2 + index * step),
    y: cy + (radius + 16) * Math.sin(-Math.PI / 2 + index * step),
  });
  const dataPoints = items.map((skill, index) => toXY(index, SKILL_LEVEL_VALUE[skill.level] ?? 60));
  const ringColor = dark ? "rgba(255,255,255,0.1)" : `${accent}18`;
  const shapeColor = dark ? "rgba(255,255,255,0.6)" : accent;

  return (
    <svg
      className="cv-pdf-avoid-break"
      style={{ maxWidth: 160, display: "block", margin: "0 auto" }}
      viewBox="0 0 160 160"
      width="100%"
    >
      {[25, 50, 75, 100].map(pct => {
        const points = items.map((_, index) => toXY(index, pct));
        return <polygon key={pct} fill="none" points={points.map(point => `${point.x},${point.y}`).join(" ")} stroke={ringColor} strokeWidth="1" />;
      })}
      {items.map((_, index) => {
        const end = spokeEnd(index);
        return <line key={index} stroke={ringColor} strokeWidth="1" x1={cx} x2={end.x} y1={cy} y2={end.y} />;
      })}
      <polygon fill={shapeColor} fillOpacity={dark ? 0.2 : 0.12} points={dataPoints.map(point => `${point.x},${point.y}`).join(" ")} stroke={shapeColor} strokeLinejoin="round" strokeWidth="1.5" />
      {dataPoints.map((point, index) => (
        <circle key={index} cx={point.x} cy={point.y} fill={shapeColor} r={3} />
      ))}
      {items.map((skill, index) => {
        const label = labelPoint(index);
        return (
          <text
            key={index}
            dominantBaseline="middle"
            style={{ fontSize: "7.5px", fill: dark ? "rgba(255,255,255,0.7)" : "#475569", fontFamily: FONT_EDITOR, fontWeight: 600 }}
            textAnchor="middle"
            x={label.x}
            y={label.y}
          >
            {skill.name.split("/")[0].trim().substring(0, 10)}
          </text>
        );
      })}
    </svg>
  );
}

export function SkillsBlock({ skills, display, accent, dark = false }) {
  if (!skills.length) {
    return null;
  }

  if (display === "radar") {
    return <SkillRadar accent={accent} dark={dark} skills={skills} />;
  }

  if (display === "bars") {
    return (
      <div className="cv-pdf-avoid-break">
        {skills.map(skill => (
          <SkillBar key={skill.id} accent={accent} dark={dark} level={skill.level} levelLabel={skill.levelLabel} name={skill.name} />
        ))}
      </div>
    );
  }

  return (
    <div className="cv-pdf-avoid-break" style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
      {skills.map(skill => (
        <SkillChip key={skill.id} accent={accent} dark={dark} name={skill.name} />
      ))}
    </div>
  );
}

export function SecTitle({ children, accent, bodyFont }) {
  return (
    <div
      className="cv-pdf-avoid-break"
      style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, marginTop: 22 }}
    >
      <div style={{ width: 3, height: 16, background: accent, borderRadius: 2, flexShrink: 0 }} />
      <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: accent, fontFamily: bodyFont }}>
        {children}
      </span>
      <div style={{ flex: 1, height: 1, background: `${accent}20` }} />
    </div>
  );
}

export function TLItem({ title, sub, period, extra, body, accent, size, displayFont, bodyFont }) {
  return (
    <div className="cv-pdf-avoid-break" style={{ display: "flex", gap: 14, marginBottom: 20 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 4 }}>
        <div style={{ width: 9, height: 9, borderRadius: "50%", background: accent, flexShrink: 0, border: "2px solid white", boxShadow: `0 0 0 2px ${accent}30`, marginLeft: -5 }} />
        <div style={{ flex: 1, width: 1, background: `${accent}20`, marginTop: 4, minHeight: 20 }} />
      </div>
      <div style={{ flex: 1, paddingBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 4, marginBottom: 2 }}>
          <span style={{ fontWeight: 700, fontSize: size, color: "#0f172a", fontFamily: displayFont }}>{title}</span>
          <span style={{ fontSize: size * 0.77, color: "#94a3b8", fontFamily: bodyFont }}>
            {period}
            {extra ? ` · ${extra}` : ""}
          </span>
        </div>
        <div style={{ color: accent, fontSize: size * 0.86, fontWeight: 600, marginBottom: 5, fontFamily: bodyFont }}>{sub}</div>
        {body ? <p style={{ color: "#475569", fontSize: size * 0.88, lineHeight: 1.65, margin: 0, fontFamily: bodyFont }}>{body}</p> : null}
      </div>
    </div>
  );
}

export function SidebarLabel({ children }) {
  return (
    <div
      className="cv-pdf-avoid-break"
      style={{ color: "rgba(255,255,255,0.42)", fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 10, fontFamily: FONT_EDITOR }}
    >
      {children}
    </div>
  );
}
