import { Globe, GraduationCap, Languages, Mail, MapPin, Phone, TerminalSquare } from "lucide-react";
import cx from "clsx";

import {
  TEMPLATE_ALPHA,
  TERMINAL_EXPORT_CURSOR_ANIMATION,
  TERMINAL_PREVIEW_CURSOR_ANIMATION,
  TERMINAL_SKILL_COMMANDS,
  TERMINAL_TEMPLATE_COLORS,
  TERMINAL_TEMPLATE_FONTS,
  TERMINAL_TEMPLATE_LAYOUT,
  TERMINAL_TEMPLATE_TYPOGRAPHY,
} from "../../constants/templateConstants.js";
import { PhotoFrame, SkillsBlock, useResumeTemplateCopy } from "./shared.jsx";
import styles from "./TerminalCV.module.scss";

function withAlpha(color, alpha) {
  return `${color}${alpha}`;
}

function getTerminalCssVars({ accent, bodyFont, displayFont, isExportPage, size }) {
  return {
    "--terminal-accent": accent,
    "--terminal-accent-soft": withAlpha(accent, TEMPLATE_ALPHA.soft),
    "--terminal-avatar-background": TERMINAL_TEMPLATE_COLORS.avatarBackground,
    "--terminal-avatar-border": withAlpha(accent, TEMPLATE_ALPHA.medium),
    "--terminal-avatar-size": `${TERMINAL_TEMPLATE_LAYOUT.avatarSize}px`,
    "--terminal-body-font": bodyFont,
    "--terminal-body-size": `${size}px`,
    "--terminal-body-text": TERMINAL_TEMPLATE_COLORS.bodyText,
    "--terminal-command-text": TERMINAL_TEMPLATE_COLORS.commandText,
    "--terminal-cursor": TERMINAL_TEMPLATE_COLORS.cursor,
    "--terminal-cursor-animation": isExportPage
      ? TERMINAL_EXPORT_CURSOR_ANIMATION
      : TERMINAL_PREVIEW_CURSOR_ANIMATION,
    "--terminal-cursor-font-size": `${TERMINAL_TEMPLATE_TYPOGRAPHY.cursorFontSize}px`,
    "--terminal-display-font": displayFont,
    "--terminal-education-body-size": `${TERMINAL_TEMPLATE_TYPOGRAPHY.educationBodySize}px`,
    "--terminal-education-institution": TERMINAL_TEMPLATE_COLORS.educationInstitution,
    "--terminal-education-meta-size": `${TERMINAL_TEMPLATE_TYPOGRAPHY.educationMetaSize}px`,
    "--terminal-education-title-size": `${TERMINAL_TEMPLATE_TYPOGRAPHY.educationTitleSize}px`,
    "--terminal-experience-body-size": `${TERMINAL_TEMPLATE_TYPOGRAPHY.experienceBodySize}px`,
    "--terminal-experience-company": TERMINAL_TEMPLATE_COLORS.experienceCompany,
    "--terminal-experience-meta-size": `${TERMINAL_TEMPLATE_TYPOGRAPHY.experienceMetaSize}px`,
    "--terminal-experience-role": TERMINAL_TEMPLATE_COLORS.experienceRole,
    "--terminal-experience-title-size": `${TERMINAL_TEMPLATE_TYPOGRAPHY.experienceTitleSize}px`,
    "--terminal-header-size": `${TERMINAL_TEMPLATE_TYPOGRAPHY.headerSize}px`,
    "--terminal-line-text": TERMINAL_TEMPLATE_COLORS.lineText,
    "--terminal-mono-font": TERMINAL_TEMPLATE_FONTS.mono,
    "--terminal-muted": TERMINAL_TEMPLATE_COLORS.muted,
    "--terminal-name-line-height": TERMINAL_TEMPLATE_TYPOGRAPHY.nameLineHeight,
    "--terminal-name-size": `${size * TERMINAL_TEMPLATE_TYPOGRAPHY.nameSizeMultiplier}px`,
    "--terminal-page-background": TERMINAL_TEMPLATE_COLORS.pageBackground,
    "--terminal-page-min-height": `${TERMINAL_TEMPLATE_LAYOUT.pageMinHeight}px`,
    "--terminal-page-padding": `${TERMINAL_TEMPLATE_LAYOUT.pagePadding}px`,
    "--terminal-primary-name": TERMINAL_TEMPLATE_COLORS.primaryName,
    "--terminal-prompt": TERMINAL_TEMPLATE_COLORS.prompt,
    "--terminal-prompt-size": `${TERMINAL_TEMPLATE_TYPOGRAPHY.promptSize}px`,
    "--terminal-secondary-text": TERMINAL_TEMPLATE_COLORS.secondaryText,
    "--terminal-shell-background": TERMINAL_TEMPLATE_COLORS.shellBackground,
    "--terminal-shell-border": TERMINAL_TEMPLATE_COLORS.shellBorder,
    "--terminal-shell-padding": TERMINAL_TEMPLATE_LAYOUT.shellPadding,
    "--terminal-shell-radius": `${TERMINAL_TEMPLATE_LAYOUT.shellBorderRadius}px`,
    "--terminal-skill-chip-background": TERMINAL_TEMPLATE_COLORS.skillChipBackground,
    "--terminal-skill-percent-size": `${TERMINAL_TEMPLATE_TYPOGRAPHY.skillPercentSize}px`,
    "--terminal-skill-text-size": `${TERMINAL_TEMPLATE_TYPOGRAPHY.skillTextSize}px`,
    "--terminal-skill-track": TERMINAL_TEMPLATE_COLORS.skillTrack,
    "--terminal-summary-line-height": TERMINAL_TEMPLATE_TYPOGRAPHY.summaryLineHeight,
    "--terminal-summary-size": `${TERMINAL_TEMPLATE_TYPOGRAPHY.bodySize}px`,
    "--terminal-top-border": TERMINAL_TEMPLATE_COLORS.topBorder,
    "--terminal-traffic-green": TERMINAL_TEMPLATE_COLORS.trafficGreen,
    "--terminal-traffic-red": TERMINAL_TEMPLATE_COLORS.trafficRed,
    "--terminal-traffic-yellow": TERMINAL_TEMPLATE_COLORS.trafficYellow,
  };
}

function Prompt({ command }) {
  return (
    <div className={styles.prompt}>
      <span className={styles.promptUser}>guest@portfolio:~$</span>{" "}
      <span className={styles.promptCommand}>{command}</span>
    </div>
  );
}

function OutputPanel({ children }) {
  return <div className={styles.outputPanel}>{children}</div>;
}

function InfoLine({ children, icon: Icon, accent }) {
  return (
    <div className={styles.infoLine}>
      <Icon color={accent} size={TERMINAL_TEMPLATE_LAYOUT.iconSize} strokeWidth={TERMINAL_TEMPLATE_LAYOUT.iconStrokeWidth} />
      <span className={styles.infoText}>{children}</span>
    </div>
  );
}

function TerminalSkillDisplay({ accent, display, skills }) {
  if (display === "radar") {
    return (
      <div className={styles.radarSkills}>
        <SkillsBlock accent={accent} dark display="radar" skills={skills} />
      </div>
    );
  }

  if (display === "bars") {
    return (
      <div className={styles.skillBars}>
        {skills.map(skill => (
          <div key={skill.id}>
            <div className={styles.skillBarHeader}>
              <span>{skill.name}</span>
              <span className={styles.skillPercent}>{skill.value}%</span>
            </div>
            <div className={styles.skillTrack}>
              <div
                className={styles.skillFill}
                style={{ "--terminal-skill-width": `${skill.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={styles.skillChips}>
      {skills.map(skill => (
        <span key={skill.id} className={styles.skillChip}>
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
  bodyFont = TERMINAL_TEMPLATE_FONTS.body,
  data,
  displayFont = TERMINAL_TEMPLATE_FONTS.display,
  pageMode = "preview",
  size = TERMINAL_TEMPLATE_TYPOGRAPHY.bodySize,
  skillDisplay = "chips",
}) {
  const isExportPage = pageMode === "export";
  const copy = useResumeTemplateCopy();
  const hasPhoto = Boolean(data.photo?.src);
  const shellUser = createShellUser(data.name);
  const skillCommand = TERMINAL_SKILL_COMMANDS[skillDisplay] ?? TERMINAL_SKILL_COMMANDS.chips;

  return (
    <div
      className={cx(styles.page, {
        [styles.pageExport]: isExportPage,
        [styles.pagePreview]: !isExportPage,
      })}
      style={getTerminalCssVars({ accent, bodyFont, displayFont, isExportPage, size })}
    >
      <div className={cx(styles.shell, "terminal-shell")}>
        <div className={styles.topBar}>
          <div className={styles.trafficLights}>
            <div className={cx(styles.trafficLight, styles.trafficLightRed)} />
            <div className={cx(styles.trafficLight, styles.trafficLightYellow)} />
            <div className={cx(styles.trafficLight, styles.trafficLightGreen)} />
          </div>
          <div className={styles.sessionLabel}>
            <TerminalSquare color={accent} size={TERMINAL_TEMPLATE_LAYOUT.iconSize} strokeWidth={TERMINAL_TEMPLATE_LAYOUT.iconStrokeWidth} />
            <span>guest@{shellUser} ~ bash</span>
          </div>
        </div>

        <section className={styles.section}>
          <Prompt command="whoami" />
          <OutputPanel>
            <div className={styles.heroRow}>
              <div className={styles.heroCopy}>
                <div className={styles.name}>{data.name}</div>
                {data.title ? <div className={styles.title}>{data.title}</div> : null}
                <div className={styles.contactList}>
                  {data.contact.email ? <InfoLine accent={accent} icon={Mail}>{data.contact.email}</InfoLine> : null}
                  {data.contact.phone ? <InfoLine accent={accent} icon={Phone}>{data.contact.phone}</InfoLine> : null}
                  {data.contact.location ? <InfoLine accent={accent} icon={MapPin}>{data.contact.location}</InfoLine> : null}
                  {data.contact.website ? <InfoLine accent={accent} icon={Globe}>{data.contact.website}</InfoLine> : null}
                </div>
              </div>

              {hasPhoto ? (
                <div className={styles.avatarBlock}>
                  <div className={styles.avatarLabel}>[ avatar.png ]</div>
                  <div className={styles.avatarFrame}>
                    <PhotoFrame photo={data.photo} trackForCanvas />
                  </div>
                </div>
              ) : null}
            </div>
          </OutputPanel>
        </section>

        {data.summary ? (
          <section className={styles.section}>
            <Prompt command="cat profile.md" />
            <OutputPanel>
              <p className={styles.summary}>{data.summary}</p>
            </OutputPanel>
          </section>
        ) : null}

        {data.experience.length ? (
          <section className={styles.section}>
            <Prompt command="ls -la experience/" />
            <OutputPanel>
              <div className={styles.entryStack}>
                {data.experience.map(item => (
                  <div className="cv-pdf-avoid-break" key={item.id}>
                    <div className={styles.experienceTitle}>
                      {item.role}{" "}
                      {item.company ? <span className={styles.experienceCompany}>@ {item.company}</span> : null}
                    </div>
                    {item.period ? <div className={styles.period}>[ {item.period} ]</div> : null}
                    {item.description ? <p className={styles.entryBody}>{item.description}</p> : null}
                  </div>
                ))}
              </div>
            </OutputPanel>
          </section>
        ) : null}

        {data.education.length ? (
          <section className={styles.section}>
            <Prompt command="cat education.log" />
            <OutputPanel>
              <div className={styles.educationStack}>
                {data.education.map(item => (
                  <div className="cv-pdf-avoid-break" key={item.id}>
                    <div className={styles.educationTitle}>
                      <GraduationCap color={accent} size={TERMINAL_TEMPLATE_LAYOUT.iconSize} strokeWidth={TERMINAL_TEMPLATE_LAYOUT.iconStrokeWidth} />
                      <span>{item.degree}</span>
                    </div>
                    <div className={styles.educationMeta}>
                      {item.institution}
                      {item.period ? `  //  ${item.period}` : ""}
                    </div>
                    {item.details || item.note ? (
                      <p className={styles.educationBody}>
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
          <section className={styles.section}>
            <Prompt command={skillCommand} />
            <OutputPanel>
              <TerminalSkillDisplay accent={accent} display={skillDisplay} skills={data.skills} />
            </OutputPanel>
          </section>
        ) : null}

        {data.languages.length || data.hobbies.length ? (
          <section className={styles.sectionTight}>
            <Prompt command="printenv extras" />
            <OutputPanel>
              {data.languages.length ? (
                <div
                  className={cx(styles.extrasLanguages, {
                    [styles.extrasLanguagesWithHobbies]: data.hobbies.length,
                  })}
                >
                  <Languages color={accent} size={TERMINAL_TEMPLATE_LAYOUT.iconSize} strokeWidth={TERMINAL_TEMPLATE_LAYOUT.iconStrokeWidth} />
                  <span className={styles.languageText}>
                    {data.languages.map(language => `${language.name} (${language.level})`).join(", ")}
                  </span>
                </div>
              ) : null}
              {data.hobbies.length ? (
                <div className={styles.hobbies}>{copy.interests.toLowerCase()}={data.hobbies.join(", ")}</div>
              ) : null}
            </OutputPanel>
          </section>
        ) : null}

        <div className={styles.cursorLine}>
          <span className={styles.promptUser}>guest@portfolio:~$</span>{" "}
          <span className={styles.cursor} />
        </div>
      </div>
    </div>
  );
}
