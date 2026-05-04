import { SKILL_LEVEL_VALUE } from "../../config/layoutConfig.js";
import {
  CONTACT_FIELDS,
  FALLBACK_ACCENT,
  FALLBACK_INITIALS,
  FALLBACK_NAME,
  RADAR_CONFIG,
} from "./ModernFlowCV.constants.js";

const HEX_COLOR_PATTERN = /^#?(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function getText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeHexColor(color) {
  if (!HEX_COLOR_PATTERN.test(color ?? "")) {
    return FALLBACK_ACCENT;
  }

  const hex = color.startsWith("#") ? color.slice(1) : color;

  if (hex.length === 3) {
    return `#${hex
      .split("")
      .map(char => `${char}${char}`)
      .join("")}`;
  }

  return `#${hex}`;
}

function hexToRgb(hexColor) {
  const color = normalizeHexColor(hexColor).slice(1);
  const normalized = color.length === 3
    ? color
        .split("")
        .map(char => `${char}${char}`)
        .join("")
    : color;

  return {
    b: Number.parseInt(normalized.slice(4, 6), 16),
    g: Number.parseInt(normalized.slice(2, 4), 16),
    r: Number.parseInt(normalized.slice(0, 2), 16),
  };
}

function withAlpha(hexColor, alpha) {
  const { r, g, b } = hexToRgb(hexColor);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function getSafePhoto(photo) {
  if (!photo?.src) {
    return null;
  }

  return {
    ...photo,
    positionX: Number.isFinite(photo.positionX) ? clamp(photo.positionX, 0, 100) : 50,
    positionY: Number.isFinite(photo.positionY) ? clamp(photo.positionY, 0, 100) : 50,
    scale: Number.isFinite(photo.scale) ? clamp(photo.scale, 1, 3) : 1,
  };
}

function getItemId(item, index, parts) {
  if (item?.id) {
    return item.id;
  }

  return [...parts, index].filter(Boolean).join("-");
}

function buildTimelineItems(items = [], options) {
  return items
    .map((item, index) => {
      const title = getText(item?.[options.titleKey]);
      const subtitle = getText(item?.[options.subtitleKey]);
      const period = getText(item?.period);
      const body = getText(options.getBody(item));

      if (!title && !subtitle && !period && !body) {
        return null;
      }

      return {
        body,
        id: getItemId(item, index, [title, subtitle, period]),
        period,
        subtitle,
        title,
      };
    })
    .filter(Boolean);
}

function getSkillPercentage(skill) {
  if (Number.isFinite(skill?.value)) {
    return clamp(skill.value, 0, 100);
  }

  return clamp(SKILL_LEVEL_VALUE[skill?.level] ?? 60, 0, 100);
}

function getRadarPoint(index, percentage, step) {
  const angle = -Math.PI / 2 + index * step;
  const { center, radius } = RADAR_CONFIG;
  const distance = radius * (percentage / 100);

  return {
    x: center + distance * Math.cos(angle),
    y: center + distance * Math.sin(angle),
  };
}

function getRadarLabelPoint(index, step) {
  const angle = -Math.PI / 2 + index * step;
  const distance = RADAR_CONFIG.radius + RADAR_CONFIG.labelOffset;

  return {
    x: RADAR_CONFIG.center + distance * Math.cos(angle),
    y: RADAR_CONFIG.center + distance * Math.sin(angle),
  };
}

function pointsToString(points) {
  return points.map(point => `${point.x},${point.y}`).join(" ");
}

export function buildModernFlowViewModel(data = {}) {
  const photo = getSafePhoto(data.photo);
  const skills = (Array.isArray(data.skills) ? data.skills : [])
    .map((skill, index) => {
      const name = getText(skill?.name);

      if (!name) {
        return null;
      }

      return {
        id: getItemId(skill, index, [name, skill?.level]),
        level: getText(skill?.level),
        name,
        percentage: getSkillPercentage(skill),
      };
    })
    .filter(Boolean);

  const languages = (Array.isArray(data.languages) ? data.languages : [])
    .map((language, index) => {
      const name = getText(language?.name);

      if (!name) {
        return null;
      }

      return {
        id: getItemId(language, index, [name, language?.level]),
        level: getText(language?.level),
        name,
      };
    })
    .filter(Boolean);

  const hobbies = (Array.isArray(data.hobbies) ? data.hobbies : [])
    .map(getText)
    .filter(Boolean);

  return {
    contactItems: CONTACT_FIELDS.map(field => {
      const text = getText(data.contact?.[field.key]);
      return text ? { ...field, text } : null;
    }).filter(Boolean),
    educationItems: buildTimelineItems(data.education, {
      getBody: item => [item?.details, item?.note].map(getText).filter(Boolean).join(" - "),
      subtitleKey: "institution",
      titleKey: "degree",
    }),
    experienceItems: buildTimelineItems(data.experience, {
      getBody: item => item?.description,
      subtitleKey: "company",
      titleKey: "role",
    }),
    hobbiesText: hobbies.join(", "),
    initials: getText(data.initials) || FALLBACK_INITIALS,
    languages,
    name: getText(data.name) || FALLBACK_NAME,
    photo,
    skills,
    summary: getText(data.summary),
    title: getText(data.title),
  };
}

export function buildModernFlowCssVariables({
  accent,
  bodyFont,
  displayFont,
  photo,
  size,
}) {
  const safeAccent = normalizeHexColor(accent);
  const safeSize = Number.isFinite(size) ? size : 13;
  const safePhoto = getSafePhoto(photo);

  return {
    "--modern-flow-accent": safeAccent,
    "--modern-flow-accent-border": withAlpha(safeAccent, 0.16),
    "--modern-flow-accent-glow": withAlpha(safeAccent, 0.1),
    "--modern-flow-accent-ring": withAlpha(safeAccent, 0.12),
    "--modern-flow-accent-soft": withAlpha(safeAccent, 0.08),
    "--modern-flow-accent-soft-strong": withAlpha(safeAccent, 0.14),
    "--modern-flow-accent-track": withAlpha(safeAccent, 0.18),
    "--modern-flow-body-font": bodyFont,
    "--modern-flow-display-font": displayFont,
    "--modern-flow-name-size": `${safeSize * 3.5}px`,
    "--modern-flow-photo-position": safePhoto
      ? `${safePhoto.positionX}% ${safePhoto.positionY}%`
      : "50% 50%",
    "--modern-flow-photo-scale": String(safePhoto?.scale ?? 1),
    "--modern-flow-title-size": `${safeSize * 1.15}px`,
  };
}

export function buildSkillRadarModel(skills = []) {
  const items = skills.slice(0, RADAR_CONFIG.maxItems);

  if (items.length < 3) {
    return null;
  }

  const step = (2 * Math.PI) / items.length;
  const dataPoints = items.map((skill, index) => getRadarPoint(index, skill.percentage, step));
  const spokes = items.map((_, index) => ({
    end: getRadarPoint(index, 100, step),
    id: `spoke-${index}`,
  }));
  const rings = RADAR_CONFIG.ringSteps.map(percentage => ({
    id: `ring-${percentage}`,
    points: items.map((_, index) => getRadarPoint(index, percentage, step)),
  }));
  const labels = items.map((skill, index) => ({
    id: `label-${skill.id}`,
    point: getRadarLabelPoint(index, step),
    text: skill.name.split("/")[0].trim().slice(0, 10),
  }));

  return {
    center: RADAR_CONFIG.center,
    dataPoints,
    dataPointsString: pointsToString(dataPoints),
    labels,
    rings,
    spokes,
  };
}
