import cx from "clsx";

import {
  DEFAULT_BODY_FONT,
  DEFAULT_DISPLAY_FONT,
  EYEBROW_LABEL,
  SECTION_ICONS,
} from "./ModernFlowCV.constants.js";
import {
  buildModernFlowCssVariables,
  buildModernFlowViewModel,
  buildSkillRadarModel,
} from "./ModernFlowCV.helpers.js";

import styles from "./ModernFlowCV.module.scss";
import { useResumeTemplateCopy } from "./shared.jsx";

function SectionLabel({ children, icon: Icon }) {
  return (
    <div className={styles.sectionLabel}>
      <Icon className={styles.sectionLabelIcon} size={14} strokeWidth={2.1} />
      <span>{children}</span>
    </div>
  );
}

function TemplateSection({ children, icon, isLast = false, title, variant }) {
  const sectionClassName = variant === "sidebar" ? styles.sidebarSection : styles.mainSection;
  const lastClassName = variant === "sidebar"
    ? styles["sidebarSection--last"]
    : styles["mainSection--last"];

  return (
    <section className={cx("cv-pdf-avoid-break", sectionClassName, isLast && lastClassName)}>
      <SectionLabel icon={icon}>{title}</SectionLabel>
      {children}
    </section>
  );
}

function ContactItem({ icon: Icon, text }) {
  return (
    <span className={styles.contactItem}>
      <Icon className={styles.contactIcon} size={14} strokeWidth={2} />
      <span className={styles.contactText}>{text}</span>
    </span>
  );
}

function ProfilePhoto({ initials, photo }) {
  const copy = useResumeTemplateCopy();

  return (
    <div className={styles.photoFrame} data-canvas-image-frame="true">
      {photo?.src ? (
        <img
          alt={copy.profilePhoto}
          className={styles.photoImage}
          data-canvas-image-inner="true"
          src={photo.src}
        />
      ) : (
        <div className={styles.photoPlaceholder}>{initials}</div>
      )}
    </div>
  );
}

function HeaderSection({ contactItems, initials, name, photo, title }) {
  return (
    <header className={styles.header}>
      <div aria-hidden="true" className={styles.headerAccentOrb} />
      <div aria-hidden="true" className={styles.headerSoftOrb} />

      <div className={styles.headerInner}>
        <div className={styles.hero}>
          <p className={styles.eyebrow}>{EYEBROW_LABEL}</p>
          <h1 className={styles.name}>{name}</h1>

          {title ? <p className={styles.title}>{title}</p> : null}

          {contactItems.length ? (
            <div className={styles.contactList}>
              {contactItems.map(item => (
                <ContactItem icon={item.icon} key={item.id} text={item.text} />
              ))}
            </div>
          ) : null}
        </div>

        <ProfilePhoto initials={initials} photo={photo} />
      </div>
    </header>
  );
}

function LanguagesList({ items }) {
  return (
    <div className={styles.languagesList}>
      {items.map(item => (
        <div className={styles.languageItem} key={item.id}>
          <div className={styles.languageName}>{item.name}</div>
          {item.level ? <div className={styles.languageLevel}>{item.level}</div> : null}
        </div>
      ))}
    </div>
  );
}

function SkillChip({ name }) {
  return <span className={styles.skillChip}>{name}</span>;
}

function SkillBar({ level, name, percentage }) {
  return (
    <div className={styles.skillBar}>
      <div className={styles.skillBarHeader}>
        <span className={styles.skillName}>{name}</span>
        {level ? <span className={styles.skillLevel}>{level}</span> : null}
      </div>
      <progress
        aria-label={`${name}: ${percentage}%`}
        className={styles.skillMeter}
        max="100"
        value={percentage}
      />
    </div>
  );
}

function SkillRadar({ model }) {
  return (
    <svg className={cx("cv-pdf-avoid-break", styles.skillRadar)} viewBox="0 0 160 160">
      {model.rings.map(ring => (
        <polygon
          className={styles.skillRadarRing}
          key={ring.id}
          points={ring.points.map(point => `${point.x},${point.y}`).join(" ")}
        />
      ))}

      {model.spokes.map(spoke => (
        <line
          className={styles.skillRadarSpoke}
          key={spoke.id}
          x1={model.center}
          x2={spoke.end.x}
          y1={model.center}
          y2={spoke.end.y}
        />
      ))}

      <polygon className={styles.skillRadarShape} points={model.dataPointsString} />

      {model.dataPoints.map((point, index) => (
        <circle className={styles.skillRadarPoint} cx={point.x} cy={point.y} key={index} r="3" />
      ))}

      {model.labels.map(label => (
        <text
          className={styles.skillRadarLabel}
          dominantBaseline="middle"
          key={label.id}
          textAnchor="middle"
          x={label.point.x}
          y={label.point.y}
        >
          {label.text}
        </text>
      ))}
    </svg>
  );
}

function SkillDisplay({ display, skills }) {
  if (!skills.length) {
    return null;
  }

  if (display === "bars") {
    return (
      <div className={cx("cv-pdf-avoid-break", styles.skillBarList)}>
        {skills.map(skill => (
          <SkillBar
            key={skill.id}
            level={skill.level}
            name={skill.name}
            percentage={skill.percentage}
          />
        ))}
      </div>
    );
  }

  if (display === "radar") {
    const radarModel = buildSkillRadarModel(skills);

    if (radarModel) {
      return <SkillRadar model={radarModel} />;
    }
  }

  return (
    <div className={cx("cv-pdf-avoid-break", styles.skillChipList)}>
      {skills.map(skill => (
        <SkillChip key={skill.id} name={skill.name} />
      ))}
    </div>
  );
}

function TimelineItem({ item, isLast }) {
  return (
    <div className={cx("cv-pdf-avoid-break", styles.timelineItem, isLast && styles["timelineItem--last"])}>
      <div className={styles.timelineMarker} />
      {!isLast ? <div className={styles.timelineLine} /> : null}

      <div className={styles.timelineHeader}>
        <div className={styles.timelineHeading}>
          <h3 className={styles.timelineTitle}>{item.title}</h3>
          {item.subtitle ? <div className={styles.timelineSubtitle}>{item.subtitle}</div> : null}
        </div>

        {item.period ? <span className={styles.timelinePeriod}>{item.period}</span> : null}
      </div>

      {item.body ? <p className={styles.timelineBody}>{item.body}</p> : null}
    </div>
  );
}

function TimelineList({ items }) {
  return (
    <div className={styles.timelineList}>
      {items.map((item, index) => (
        <TimelineItem
          isLast={index === items.length - 1}
          item={item}
          key={item.id}
        />
      ))}
    </div>
  );
}

export function ModernFlowCV({
  accent,
  bodyFont = DEFAULT_BODY_FONT,
  data,
  displayFont = DEFAULT_DISPLAY_FONT,
  pageMode = "preview",
  size = 13,
  skillDisplay = "chips",
}) {
  const copy = useResumeTemplateCopy();
  const isExportPage = pageMode === "export";
  const viewModel = buildModernFlowViewModel(data);
  const rootStyle = buildModernFlowCssVariables({
    accent,
    bodyFont,
    displayFont,
    photo: viewModel.photo,
    size,
  });

  const sidebarSections = [
    viewModel.summary
      ? {
          content: <p className={styles.bodyCopy}>{viewModel.summary}</p>,
          icon: SECTION_ICONS.profile,
          id: "summary",
          title: copy.profile,
        }
      : null,
    viewModel.skills.length
      ? {
          content: <SkillDisplay display={skillDisplay} skills={viewModel.skills} />,
          icon: SECTION_ICONS.skills,
          id: "skills",
          title: copy.skills,
        }
      : null,
    viewModel.languages.length
      ? {
          content: <LanguagesList items={viewModel.languages} />,
          icon: SECTION_ICONS.languages,
          id: "languages",
          title: copy.languages,
        }
      : null,
    viewModel.hobbiesText
      ? {
          content: <p className={styles.bodyCopy}>{viewModel.hobbiesText}</p>,
          icon: SECTION_ICONS.hobbies,
          id: "hobbies",
          title: copy.interests,
        }
      : null,
  ].filter(Boolean);

  const mainSections = [
    viewModel.experienceItems.length
      ? {
          content: <TimelineList items={viewModel.experienceItems} />,
          icon: SECTION_ICONS.experience,
          id: "experience",
          title: copy.experience,
        }
      : null,
    viewModel.educationItems.length
      ? {
          content: <TimelineList items={viewModel.educationItems} />,
          icon: SECTION_ICONS.education,
          id: "education",
          title: copy.education,
        }
      : null,
  ].filter(Boolean);

  return (
    <div
      className={cx(styles.root, {
        [styles["root--export"]]: isExportPage,
        [styles["root--preview"]]: !isExportPage,
      })}
      style={rootStyle}
    >
      <HeaderSection
        contactItems={viewModel.contactItems}
        initials={viewModel.initials}
        name={viewModel.name}
        photo={viewModel.photo}
        title={viewModel.title}
      />

      <div className={cx(styles.columns, isExportPage && styles["columns--export"])}>
        <aside className={styles.sidebar}>
          {sidebarSections.map((section, index) => (
            <TemplateSection
              icon={section.icon}
              isLast={index === sidebarSections.length - 1}
              key={section.id}
              title={section.title}
              variant="sidebar"
            >
              {section.content}
            </TemplateSection>
          ))}
        </aside>

        <main className={styles.main}>
          {mainSections.map((section, index) => (
            <TemplateSection
              icon={section.icon}
              isLast={index === mainSections.length - 1}
              key={section.id}
              title={section.title}
              variant="main"
            >
              {section.content}
            </TemplateSection>
          ))}
        </main>
      </div>
    </div>
  );
}
