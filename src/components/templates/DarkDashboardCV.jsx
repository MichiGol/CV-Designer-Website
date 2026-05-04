import cx from "clsx";
import { Globe, GraduationCap, Heart, Languages, Mail, MapPin, Phone, Radar as RadarIcon } from "lucide-react";
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip } from "recharts";

import {
  DASHBOARD_RADAR_LIMITS,
  DASHBOARD_TEMPLATE_COLORS,
  DASHBOARD_TEMPLATE_FONTS,
  DASHBOARD_TEMPLATE_LAYOUT,
  DASHBOARD_TEMPLATE_TEXT,
  DASHBOARD_TEMPLATE_TYPOGRAPHY,
  TEMPLATE_ALPHA,
} from "../../constants/templateConstants.js";
import { PhotoFrame, SkillsBlock, useResumeTemplateCopy } from "./shared.jsx";
import styles from "./DarkDashboardCV.module.scss";

const RADAR_TICK_STYLE = {
  fill: DASHBOARD_TEMPLATE_COLORS.headingSecondary,
  fontFamily: DASHBOARD_TEMPLATE_FONTS.mono,
  fontSize: DASHBOARD_TEMPLATE_TYPOGRAPHY.radarLabelSize,
};

const RADAR_TOOLTIP_PROPS = {
  contentStyle: {
    background: DASHBOARD_TEMPLATE_COLORS.pageBackground,
    border: `1px solid ${DASHBOARD_TEMPLATE_COLORS.cardBorder}`,
    borderRadius: DASHBOARD_TEMPLATE_LAYOUT.radarTooltipBorderRadius,
    color: DASHBOARD_TEMPLATE_COLORS.bodyText,
    fontFamily: DASHBOARD_TEMPLATE_FONTS.mono,
    fontSize: DASHBOARD_TEMPLATE_TYPOGRAPHY.radarTooltipSize,
  },
  formatter: value => [`${value}`, "Level"],
  labelStyle: { color: DASHBOARD_TEMPLATE_COLORS.bodyText },
};

function px(value) {
  return `${value}px`;
}

function withAlpha(color, alpha) {
  return `${color}${alpha}`;
}

function formatRadarLabel(value) {
  const label = String(value);
  const maxLength = DASHBOARD_RADAR_LIMITS.maxLabelLength;

  return label.length > maxLength ? `${label.slice(0, maxLength)}...` : label;
}

function getDashboardCssVars({ accent, bodyFont, displayFont, size }) {
  const colors = DASHBOARD_TEMPLATE_COLORS;
  const layout = DASHBOARD_TEMPLATE_LAYOUT;
  const typography = DASHBOARD_TEMPLATE_TYPOGRAPHY;

  return {
    "--dashboard-accent": accent,
    "--dashboard-accent-medium": withAlpha(accent, TEMPLATE_ALPHA.medium),
    "--dashboard-badge-background": colors.badgeBackground,
    "--dashboard-badge-border": colors.badgeBorder,
    "--dashboard-base-size": px(size),
    "--dashboard-body-font": bodyFont,
    "--dashboard-body-text": colors.bodyText,
    "--dashboard-card-background": colors.cardBackground,
    "--dashboard-card-border": colors.cardBorder,
    "--dashboard-card-padding": px(layout.cardPadding),
    "--dashboard-card-radius": px(layout.cardBorderRadius),
    "--dashboard-contact-gap": px(layout.contactGap),
    "--dashboard-contact-line-gap": px(layout.contactLineGap),
    "--dashboard-description-line-height": typography.descriptionLineHeight,
    "--dashboard-description-size": px(typography.descriptionSize),
    "--dashboard-display-font": displayFont,
    "--dashboard-education-details-line-height": typography.educationDetailsLineHeight,
    "--dashboard-education-details-size": px(typography.educationDetailsSize),
    "--dashboard-education-degree-size": px(typography.educationDegreeSize),
    "--dashboard-education-gap": px(layout.educationGap),
    "--dashboard-education-header-margin-bottom": px(layout.educationHeaderMarginBottom),
    "--dashboard-education-item-padding-top": px(layout.educationItemPaddingTop),
    "--dashboard-education-meta-size": px(typography.educationMetaSize),
    "--dashboard-entry-gap": px(layout.entryGap),
    "--dashboard-experience-card-padding": px(layout.experienceCardPadding),
    "--dashboard-experience-card-radius": px(layout.experienceCardBorderRadius),
    "--dashboard-experience-company-size": px(typography.experienceCompanySize),
    "--dashboard-experience-header-gap": px(layout.experienceHeaderGap),
    "--dashboard-experience-header-margin-bottom": px(layout.experienceHeaderMarginBottom),
    "--dashboard-experience-role-size": px(typography.experienceRoleSize),
    "--dashboard-grid-columns": layout.dashboardGridColumns,
    "--dashboard-grid-gap": px(layout.dashboardGap),
    "--dashboard-header-gap": px(layout.headerGap),
    "--dashboard-header-margin-bottom": px(layout.headerMarginBottom),
    "--dashboard-header-meta-contact-only-width": px(layout.headerMetaContactOnlyWidth),
    "--dashboard-header-meta-photo-contact-width": px(layout.headerMetaPhotoContactWidth),
    "--dashboard-header-meta-photo-only-width": px(layout.headerMetaPhotoOnlyWidth),
    "--dashboard-heading-letter-spacing": typography.headingLetterSpacing,
    "--dashboard-heading-margin-bottom": px(typography.headingMarginBottom),
    "--dashboard-heading-primary": colors.headingPrimary,
    "--dashboard-heading-secondary": colors.headingSecondary,
    "--dashboard-heading-size": px(typography.headingSize),
    "--dashboard-heading-weight": typography.headingWeight,
    "--dashboard-hobbies-line-height": typography.hobbiesLineHeight,
    "--dashboard-hobbies-size": px(typography.hobbiesSize),
    "--dashboard-language-block-margin-bottom": px(layout.languageBlockMarginBottom),
    "--dashboard-language-gap": px(layout.languageGap),
    "--dashboard-language-level-size": px(typography.languageLevelSize),
    "--dashboard-language-name-size": px(typography.languageNameSize),
    "--dashboard-language-name-weight": typography.languageNameWeight,
    "--dashboard-meta-margin-top": px(layout.metaMarginTop),
    "--dashboard-mono-font": DASHBOARD_TEMPLATE_FONTS.mono,
    "--dashboard-muted": colors.muted,
    "--dashboard-name-letter-spacing": typography.nameLetterSpacing,
    "--dashboard-name-line-height": typography.nameLineHeight,
    "--dashboard-name-size": px(size * typography.nameSizeMultiplier),
    "--dashboard-name-weight": typography.nameWeight,
    "--dashboard-nested-card-background": colors.nestedCardBackground,
    "--dashboard-page-background": colors.pageBackground,
    "--dashboard-page-min-height": px(layout.pageMinHeight),
    "--dashboard-page-padding": px(layout.pagePadding),
    "--dashboard-pill-radius": px(layout.pillRadius),
    "--dashboard-period-badge-padding": layout.periodBadgePadding,
    "--dashboard-period-badge-radius": px(layout.periodBadgeRadius),
    "--dashboard-period-size": px(typography.periodSize),
    "--dashboard-period-weight": typography.periodWeight,
    "--dashboard-photo-background": colors.photoBackground,
    "--dashboard-photo-grid-gap": px(layout.photoGridGap),
    "--dashboard-photo-grid-photo-only-columns": layout.photoGridPhotoOnlyColumns,
    "--dashboard-photo-grid-with-contact-columns": layout.photoGridWithContactColumns,
    "--dashboard-photo-height": px(layout.photoHeight),
    "--dashboard-photo-shadow": layout.photoShadow,
    "--dashboard-photo-width": px(layout.photoWidth),
    "--dashboard-radar-min-height": px(layout.radarMinHeight),
    "--dashboard-secondary-text": colors.secondaryText,
    "--dashboard-section-meta-weight": typography.sectionMetaWeight,
    "--dashboard-section-title-weight": typography.sectionTitleWeight,
    "--dashboard-skill-card-heading-margin-bottom": px(layout.skillCardHeadingMarginBottom),
    "--dashboard-skill-label-size": px(typography.skillLabelSize),
    "--dashboard-skill-level-gap": px(layout.skillLevelGap),
    "--dashboard-skill-level-header-margin-bottom": px(layout.skillLevelHeaderMarginBottom),
    "--dashboard-skill-track-height": px(layout.skillTrackHeight),
    "--dashboard-skill-value-size": px(typography.skillValueSize),
    "--dashboard-strong-text": colors.strongText,
    "--dashboard-summary-line-height": typography.summaryLineHeight,
    "--dashboard-summary-size": px(typography.summarySize),
    "--dashboard-text-block-margin-top": px(layout.textBlockMarginTop),
    "--dashboard-title-margin-top": px(layout.titleMarginTop),
    "--dashboard-title-size": px(size * typography.titleSizeMultiplier),
  };
}

function DashboardHeading({ children, tone = "primary" }) {
  return (
    <div
      className={cx(styles.heading, {
        [styles.headingSecondary]: tone === "secondary",
      })}
    >
      {children}
    </div>
  );
}

function ContactLine({ accent, children, icon: Icon }) {
  return (
    <div className={styles.contactLine}>
      <Icon
        color={accent}
        size={DASHBOARD_TEMPLATE_LAYOUT.contactIconSize}
        strokeWidth={DASHBOARD_TEMPLATE_LAYOUT.contactIconStrokeWidth}
      />
      <span>{children}</span>
    </div>
  );
}

function RadarPanel({ accent, copy, exportMode, skills }) {
  const radarData = skills.map(skill => ({
    label: skill.name,
    value: skill.value,
  }));

  if (!radarData.length) {
    return <p className={styles.radarEmpty}>{copy.noSkills}</p>;
  }

  if (exportMode) {
    return (
      <div className={styles.radarExport}>
        <RadarChart
          cx={DASHBOARD_TEMPLATE_LAYOUT.radarCenter}
          cy={DASHBOARD_TEMPLATE_LAYOUT.radarCenter}
          data={radarData}
          height={DASHBOARD_TEMPLATE_LAYOUT.radarExportHeight}
          outerRadius={DASHBOARD_TEMPLATE_LAYOUT.radarOuterRadius}
          width={DASHBOARD_TEMPLATE_LAYOUT.radarExportWidth}
        >
          <PolarGrid stroke={DASHBOARD_TEMPLATE_COLORS.radarGrid} />
          <PolarRadiusAxis axisLine={false} stroke={DASHBOARD_TEMPLATE_COLORS.cardBorder} tick={false} />
          <PolarAngleAxis
            dataKey="label"
            stroke={DASHBOARD_TEMPLATE_COLORS.muted}
            tick={RADAR_TICK_STYLE}
            tickFormatter={formatRadarLabel}
          />
          <Radar
            dataKey="value"
            fill={accent}
            fillOpacity={DASHBOARD_TEMPLATE_LAYOUT.radarFillOpacity}
            stroke={accent}
            strokeWidth={DASHBOARD_TEMPLATE_LAYOUT.radarStrokeWidth}
          />
        </RadarChart>
      </div>
    );
  }

  return (
    <div className={styles.radarPreview}>
      <ResponsiveContainer height="100%" width="100%">
        <RadarChart
          cx={DASHBOARD_TEMPLATE_LAYOUT.radarCenter}
          cy={DASHBOARD_TEMPLATE_LAYOUT.radarCenter}
          data={radarData}
          outerRadius={DASHBOARD_TEMPLATE_LAYOUT.radarOuterRadius}
        >
          <PolarGrid stroke={DASHBOARD_TEMPLATE_COLORS.radarGrid} />
          <PolarRadiusAxis axisLine={false} stroke={DASHBOARD_TEMPLATE_COLORS.cardBorder} tick={false} />
          <PolarAngleAxis
            dataKey="label"
            stroke={DASHBOARD_TEMPLATE_COLORS.muted}
            tick={RADAR_TICK_STYLE}
            tickFormatter={formatRadarLabel}
          />
          <Radar
            dataKey="value"
            fill={accent}
            fillOpacity={DASHBOARD_TEMPLATE_LAYOUT.radarFillOpacity}
            stroke={accent}
            strokeWidth={DASHBOARD_TEMPLATE_LAYOUT.radarStrokeWidth}
          />
          <Tooltip {...RADAR_TOOLTIP_PROPS} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DarkDashboardCV({
  accent,
  bodyFont = DASHBOARD_TEMPLATE_FONTS.body,
  data,
  displayFont = DASHBOARD_TEMPLATE_FONTS.display,
  pageMode = "preview",
  size = DASHBOARD_TEMPLATE_TYPOGRAPHY.baseSize,
  skillDisplay = "radar",
}) {
  const copy = useResumeTemplateCopy();
  const isExportPage = pageMode === "export";
  const hasPhoto = Boolean(data.photo?.src);
  const contactItems = [
    { icon: Mail, text: data.contact.email },
    { icon: Phone, text: data.contact.phone },
    { icon: MapPin, text: data.contact.location },
    { icon: Globe, text: data.contact.website },
  ].filter(item => item.text);

  const contactContent = contactItems.length ? (
    <div className={styles.contactList}>
      {contactItems.map(item => (
        <ContactLine accent={accent} icon={item.icon} key={`${item.text}-${item.icon.displayName ?? "contact"}`}>
          {item.text}
        </ContactLine>
      ))}
    </div>
  ) : null;

  return (
    <div
      className={cx(styles.shell, "darkdashboard-shell", {
        [styles.shellExport]: isExportPage,
        [styles.shellPreview]: !isExportPage,
      })}
      style={getDashboardCssVars({ accent, bodyFont, displayFont, size })}
    >
      <header className={cx(styles.card, styles.header)}>
        <div className={styles.headerMain}>
          <DashboardHeading>Curriculum Vitae</DashboardHeading>
          <h1 className={styles.name}>{data.name}</h1>
          {data.title ? <p className={styles.title}>{data.title}</p> : null}
        </div>

        {hasPhoto || contactItems.length ? (
          <div
            className={cx({
              [styles.headerMetaPhotoContact]: hasPhoto && contactItems.length,
              [styles.headerMetaPhotoOnly]: hasPhoto && !contactItems.length,
              [styles.headerMetaContactOnly]: !hasPhoto && contactItems.length,
            })}
          >
            {hasPhoto ? (
              <div
                className={cx(
                  styles.photoContactGrid,
                  contactItems.length
                    ? styles.photoContactGridWithContact
                    : styles.photoContactGridPhotoOnly,
                )}
              >
                <div className={styles.photoFrame}>
                  <PhotoFrame photo={data.photo} trackForCanvas />
                </div>
                {contactContent}
              </div>
            ) : contactContent}
          </div>
        ) : null}
      </header>

      <div className={cx(styles.dashboardGrid, "darkdashboard-grid")}>
        <div className={styles.column}>
          {data.summary ? (
            <section className={styles.card}>
              <DashboardHeading>{copy.profile}</DashboardHeading>
              <p className={styles.summary}>{data.summary}</p>
            </section>
          ) : null}

          {data.experience.length ? (
            <section className={styles.card}>
              <DashboardHeading>{copy.experience}</DashboardHeading>
              <div className={styles.entryStack}>
                {data.experience.map(item => (
                  <article className={cx("cv-pdf-avoid-break", styles.experienceCard)} key={item.id}>
                    <div className={styles.experienceHeader}>
                      <div>
                        <h3 className={styles.experienceRole}>{item.role}</h3>
                        <div className={styles.experienceCompany}>{item.company}</div>
                      </div>
                      {item.period ? <span className={styles.periodBadge}>{item.period}</span> : null}
                    </div>
                    {item.description ? <p className={styles.description}>{item.description}</p> : null}
                  </article>
                ))}
              </div>
            </section>
          ) : null}
        </div>

        <div className={styles.column}>
          <section className={styles.card}>
            <div className={styles.cardHeadingRow}>
              <DashboardHeading>{copy.skills}</DashboardHeading>
              <RadarIcon color={accent} size={DASHBOARD_TEMPLATE_LAYOUT.iconSize} strokeWidth={DASHBOARD_TEMPLATE_LAYOUT.iconStrokeWidth} />
            </div>
            {skillDisplay === "radar" ? (
              <RadarPanel accent={accent} copy={copy} exportMode={isExportPage} skills={data.skills} />
            ) : (
              <SkillsBlock accent={accent} dark display={skillDisplay} skills={data.skills} />
            )}
          </section>

          {data.skills.length > 0 && skillDisplay === "radar" ? (
            <section className={styles.card}>
              <DashboardHeading tone="secondary">{copy.skillLevel}</DashboardHeading>
              <div className={styles.skillLevelStack}>
                {data.skills.map(skill => (
                  <div key={`${skill.id}-bar`}>
                    <div className={styles.skillLevelHeader}>
                      <span className={styles.skillName}>{skill.name}</span>
                      <span className={styles.skillValue}>{skill.value}</span>
                    </div>
                    <div className={styles.skillTrack}>
                      <div
                        className={styles.skillFill}
                        style={{ "--dashboard-skill-width": `${skill.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {data.education.length ? (
            <section className={styles.card}>
              <div className={styles.educationHeader}>
                <DashboardHeading>{copy.education}</DashboardHeading>
                <GraduationCap color={accent} size={DASHBOARD_TEMPLATE_LAYOUT.iconSize} strokeWidth={DASHBOARD_TEMPLATE_LAYOUT.iconStrokeWidth} />
              </div>
              <div className={styles.educationStack}>
                {data.education.map(item => (
                  <article className={cx("cv-pdf-avoid-break", styles.educationItem)} key={item.id}>
                    <h3 className={styles.educationDegree}>{item.degree}</h3>
                    <div className={styles.educationMeta}>
                      {item.institution}
                      {item.period ? `${DASHBOARD_TEMPLATE_TEXT.educationSeparator}${item.period}` : ""}
                    </div>
                    {item.details || item.note ? (
                      <p className={styles.educationDetails}>
                        {[item.details, item.note].filter(Boolean).join(DASHBOARD_TEMPLATE_TEXT.educationSeparator)}
                      </p>
                    ) : null}
                  </article>
                ))}
              </div>
            </section>
          ) : null}

          {data.languages.length || data.hobbies.length ? (
            <section className={styles.card}>
              {data.languages.length ? (
                <div
                  className={cx(styles.languageBlock, {
                    [styles.languageBlockWithHobbies]: data.hobbies.length,
                  })}
                >
                  <div className={styles.headingRow}>
                    <DashboardHeading>{copy.languages}</DashboardHeading>
                    <Languages color={accent} size={DASHBOARD_TEMPLATE_LAYOUT.iconSize} strokeWidth={DASHBOARD_TEMPLATE_LAYOUT.iconStrokeWidth} />
                  </div>
                  <div className={styles.languageList}>
                    {data.languages.map(language => (
                      <div className={styles.languageRow} key={language.id}>
                        <span className={styles.languageName}>{language.name}</span>
                        <span className={styles.languageLevel}>{language.level}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {data.hobbies.length ? (
                <div>
                  <div className={styles.headingRow}>
                    <DashboardHeading>{copy.interests}</DashboardHeading>
                    <Heart color={accent} size={DASHBOARD_TEMPLATE_LAYOUT.iconSize} strokeWidth={DASHBOARD_TEMPLATE_LAYOUT.iconStrokeWidth} />
                  </div>
                  <p className={styles.hobbies}>{data.hobbies.join(", ")}</p>
                </div>
              ) : null}
            </section>
          ) : null}
        </div>
      </div>
    </div>
  );
}
