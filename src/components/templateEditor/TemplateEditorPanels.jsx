import { memo } from "react";
import cx from "clsx";

import { DEFAULT_TEMPLATE_SETTINGS, TEMPLATE_COLOR_DEFAULTS } from "../../config/defaults.js";
import {
  FIXED_SKILL_DISPLAY_LAYOUT_IDS,
  FONT_PAIRS,
  getLocalizedLayout,
  getLocalizedLayoutGroup,
  LANGUAGE_LEVELS,
  LANGUAGE_LEVEL_LABELS,
  LAYOUT_GROUPS,
  SIDEBAR_POSITION_LAYOUT_IDS,
  SKILL_DISPLAY_OPTIONS,
  SKILL_LEVELS,
  SKILL_LEVEL_LABELS,
  TEMPLATE_LAYOUTS,
} from "../../config/layoutConfig.js";
import { useTemplateEditorStore } from "../../store/templateEditorStore.js";
import { LayoutMiniPreview } from "../LayoutMiniPreview.jsx";
import { normalizePhotoConfig, PhotoFrame } from "../templates/shared.jsx";

import styles from "./TemplateEditor.module.scss";

function getLayoutAccentVars(accent) {
  return {
    "--layout-accent": accent,
    "--layout-accent-soft": `${accent}18`,
    "--layout-accent-border": `${accent}40`,
  };
}

function getTemplateColorDefaults(layoutId) {
  const defaults = TEMPLATE_COLOR_DEFAULTS[layoutId] ?? DEFAULT_TEMPLATE_SETTINGS;

  return {
    accent: defaults.accent,
    bodyBg: defaults.bodyBg,
    headerBg: defaults.headerBg,
  };
}

const FieldInput = memo(function FieldInput({ label, onChange, type = "text", value }) {
  return (
    <label className={styles.field}>
      <span className={styles.fieldLabel}>{label}</span>
      <input
        className={styles.fieldInput}
        onChange={event => onChange(event.target.value)}
        type={type}
        value={value ?? ""}
      />
    </label>
  );
});

const FieldTextarea = memo(function FieldTextarea({ label, onChange, rows = 4, value }) {
  return (
    <label className={styles.field}>
      <span className={styles.fieldLabel}>{label}</span>
      <textarea
        className={styles.fieldTextarea}
        onChange={event => onChange(event.target.value)}
        rows={rows}
        value={value ?? ""}
      />
    </label>
  );
});

const FieldSelect = memo(function FieldSelect({ label, onChange, options, value }) {
  return (
    <label className={styles.field}>
      <span className={styles.fieldLabel}>{label}</span>
      <select
        className={styles.fieldSelect}
        onChange={event => onChange(event.target.value)}
        value={value}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
});

const FieldRange = memo(function FieldRange({
  formatValue = value => `${Math.round(value)}`,
  label,
  max = 100,
  min = 0,
  onChange,
  step = 1,
  value,
}) {
  const safeValue = Number.isFinite(value) ? value : min;

  return (
    <label className={styles.field}>
      <span className={styles.fieldLabelRow}>
        <span className={styles.fieldLabel}>{label}</span>
        <span className={styles.fieldValue}>{formatValue(safeValue)}</span>
      </span>
      <input
        className={styles.rangeInput}
        max={max}
        min={min}
        onChange={event => onChange(Number(event.target.value))}
        step={step}
        type="range"
        value={safeValue}
      />
    </label>
  );
});

const ColorSwatchControl = memo(function ColorSwatchControl({ label, onChange, value }) {
  const safeValue = value || "#000000";

  return (
    <label className={styles.colorRow}>
      <span className={styles.colorLabel}>{label}</span>
      <span className={styles.colorPicker}>
        <input
          aria-label={label}
          className={styles.colorInput}
          onChange={event => onChange(event.target.value)}
          type="color"
          value={safeValue}
        />
        <span className={styles.colorSwatch} style={{ background: safeValue }} />
      </span>
    </label>
  );
});

function FieldGrid({ children, columns = 2 }) {
  return <div className={columns === 3 ? styles.fieldGrid3 : styles.fieldGrid2}>{children}</div>;
}

const ToggleGroup = memo(function ToggleGroup({
  disabled = false,
  onChange,
  options,
  triple = false,
  value,
}) {
  return (
    <div className={cx(styles.toggleGroup, { [styles["toggleGroup--triple"]]: triple })}>
      {options.map(option => (
        <button
          key={option.value}
          className={cx(styles.toggleButton, {
            [styles["toggleButton--active"]]: value === option.value,
          })}
          disabled={disabled}
          onClick={() => onChange(option.value)}
          type="button"
        >
          {option.label}
        </button>
      ))}
    </div>
  );
});

const DynamicList = memo(function DynamicList({ addLabel, deleteLabel, entryLabel, items, onAdd, onDelete, renderItem }) {
  return (
    <div className={styles.cardList}>
      {items.map((item, index) => (
        <div key={item.id} className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>{entryLabel} {index + 1}</span>
            <button
              className={styles.cardDelete}
              onClick={() => onDelete(item.id)}
              type="button"
            >
              {deleteLabel}
            </button>
          </div>
          <div className={styles.cardBody}>{renderItem(item)}</div>
        </div>
      ))}

      <button className={styles.addButton} onClick={onAdd} type="button">
        {addLabel}
      </button>
    </div>
  );
});

const DesignGallery = memo(function DesignGallery({ copy, languageCode, patchSettings, settings }) {
  const activeFontIndex = Number.isFinite(settings.fontIdx)
    ? settings.fontIdx
    : DEFAULT_TEMPLATE_SETTINGS.fontIdx;
  const skillDisplayLocked = FIXED_SKILL_DISPLAY_LAYOUT_IDS.has(settings.layout);
  const templateColorDefaults = getTemplateColorDefaults(settings.layout);
  const colorResetDisabled =
    settings.accent === templateColorDefaults.accent &&
    settings.bodyBg === templateColorDefaults.bodyBg &&
    settings.headerBg === templateColorDefaults.headerBg;

  return (
    <div className={styles.designGallery}>
      {LAYOUT_GROUPS.map(group => (
        <section key={group.key} className={styles.designGroup}>
          <div className={styles.sectionHeading}>{getLocalizedLayoutGroup(group, languageCode).label}</div>

          <div className={styles.layoutGrid}>
            {TEMPLATE_LAYOUTS.filter(option => option.group === group.key).map((option, index) => {
              const active = settings.layout === option.id;
              const localizedOption = getLocalizedLayout(option, languageCode);

              return (
                <button
                  key={option.id}
                  className={cx(styles.layoutButton, {
                    [styles["layoutButton--active"]]: active,
                  })}
                  onClick={() => patchSettings({ layout: option.id })}
                  style={{
                    ...getLayoutAccentVars(settings.accent),
                    "--layout-card-index": index,
                  }}
                  type="button"
                >
                  <div className={styles.layoutPreview}>
                    <LayoutMiniPreview accent={settings.accent} id={option.id} />
                  </div>
                  <div
                    className={cx(styles.layoutMeta, {
                      [styles["layoutMeta--active"]]: active,
                    })}
                  >
                    <div className={styles.layoutTitle}>{localizedOption.label}</div>
                    <div className={styles.layoutDescription}>{localizedOption.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      ))}

      {SIDEBAR_POSITION_LAYOUT_IDS.has(settings.layout) ? (
        <section className={styles.designGroup}>
          <div className={styles.sectionHeading}>{copy.design.sidebarPosition}</div>
          <ToggleGroup
            onChange={value => patchSettings({ sidebarSide: value })}
            options={[
              { label: copy.left, value: "left" },
              { label: copy.right, value: "right" },
            ]}
            value={settings.sidebarSide}
          />
        </section>
      ) : null}

      <section className={styles.designGroup}>
        <div className={styles.sectionHeading}>{copy.design.skillDisplay}</div>
        <ToggleGroup
          disabled={skillDisplayLocked}
          onChange={value => patchSettings({ skillDisplay: value })}
          options={SKILL_DISPLAY_OPTIONS.map(option => ({
            label: option.label[languageCode],
            value: option.id,
          }))}
          triple
          value={settings.skillDisplay}
        />
        {skillDisplayLocked ? (
          <div className={styles.designNote}>
            {copy.design.layoutSkillLocked}
          </div>
        ) : null}
      </section>

      <FieldSelect
        label={copy.design.fontPair}
        onChange={value => patchSettings({ fontIdx: Number(value) })}
        options={FONT_PAIRS.map((font, index) => ({
          label: font.label,
          value: String(index),
        }))}
        value={String(activeFontIndex)}
      />

      <div className={styles.fontControls}>
        <FieldInput
          label={copy.design.fontSize}
          onChange={value =>
            patchSettings({
              size: Number(value) || DEFAULT_TEMPLATE_SETTINGS.size,
            })
          }
          type="number"
          value={settings.size}
        />
      </div>

      <section className={styles.designGroup}>
        <div className={styles.sectionHeading}>{copy.design.colors}</div>
        <div className={styles.colorList}>
          <ColorSwatchControl
            label={copy.design.headerSidebarColor}
            onChange={value => patchSettings({ headerBg: value })}
            value={settings.headerBg}
          />
          <ColorSwatchControl
            label={copy.design.bodyBackgroundColor}
            onChange={value => patchSettings({ bodyBg: value })}
            value={settings.bodyBg}
          />
          <ColorSwatchControl
            label={copy.design.accentColor}
            onChange={value => patchSettings({ accent: value })}
            value={settings.accent}
          />
        </div>
        <button
          className={styles.colorResetButton}
          disabled={colorResetDisabled}
          onClick={() => patchSettings(templateColorDefaults)}
          type="button"
        >
          {copy.design.resetTemplateColors}
        </button>
      </section>
    </div>
  );
});

const PersonalPanel = memo(function PersonalPanel({ copy, onPhotoUpload, photoRef }) {
  const personal = useTemplateEditorStore(state => state.personal);
  const updatePersonal = useTemplateEditorStore(state => state.updatePersonal);
  const photo = normalizePhotoConfig(personal);

  function resetPhotoFrame() {
    updatePersonal("photoScale", 1);
    updatePersonal("photoPositionX", 50);
    updatePersonal("photoPositionY", 50);
  }

  return (
    <div className={styles.stack}>
      <button
        className={styles.photoUploadCard}
        onClick={() => photoRef.current?.click()}
        type="button"
      >
        <div className={styles.photoUploadAvatar}>
          <PhotoFrame
            frameStyle={{ width: "100%", height: "100%", borderRadius: "inherit" }}
            photo={photo}
            placeholder={
              <div className={styles["photoUploadAvatar--placeholder"]}>{copy.photo.placeholder}</div>
            }
          />
        </div>

        <div className={styles.photoUploadCopy}>
          <span className={styles.photoUploadTitle}>{copy.photo.title}</span>
          <span className={styles.photoUploadHint}>
            {copy.photo.hint}
          </span>
        </div>
      </button>

      <input
        accept="image/*"
        className={styles.visuallyHidden}
        onChange={onPhotoUpload}
        ref={photoRef}
        type="file"
      />

      {photo ? (
        <div className={styles.photoAdjustments}>
          <div className={styles.sectionHeading}>{copy.photo.adjust}</div>

          <FieldRange
            formatValue={value => `${value.toFixed(2)}x`}
            label={copy.zoom}
            max={3}
            min={1}
            onChange={value => updatePersonal("photoScale", value)}
            step={0.05}
            value={photo.scale}
          />

          <FieldRange
            formatValue={value => `${Math.round(value)}%`}
            label={copy.horizontal}
            max={100}
            min={0}
            onChange={value => updatePersonal("photoPositionX", value)}
            value={photo.positionX}
          />

          <FieldRange
            formatValue={value => `${Math.round(value)}%`}
            label={copy.vertical}
            max={100}
            min={0}
            onChange={value => updatePersonal("photoPositionY", value)}
            value={photo.positionY}
          />

          <button
            className={styles.secondaryButton}
            onClick={resetPhotoFrame}
            type="button"
          >
            {copy.photo.reset}
          </button>
        </div>
      ) : null}

      <FieldGrid>
        <FieldInput
          label={copy.firstName}
          onChange={value => updatePersonal("firstName", value)}
          value={personal.firstName}
        />
        <FieldInput
          label={copy.lastName}
          onChange={value => updatePersonal("lastName", value)}
          value={personal.lastName}
        />
      </FieldGrid>

      <FieldInput
        label={copy.professionalTitle}
        onChange={value => updatePersonal("title", value)}
        value={personal.title}
      />

      <FieldGrid>
        <FieldInput
          label={copy.email}
          onChange={value => updatePersonal("email", value)}
          value={personal.email}
        />
        <FieldInput
          label={copy.phone}
          onChange={value => updatePersonal("phone", value)}
          value={personal.phone}
        />
      </FieldGrid>

      <FieldInput
        label={copy.address}
        onChange={value => updatePersonal("address", value)}
        value={personal.address}
      />
      <FieldInput
        label={copy.website}
        onChange={value => updatePersonal("website", value)}
        value={personal.website}
      />
      <FieldTextarea
        label={copy.summary}
        onChange={value => updatePersonal("summary", value)}
        value={personal.summary}
      />
    </div>
  );
});

const EducationPanel = memo(function EducationPanel({ copy }) {
  const education = useTemplateEditorStore(state => state.education);
  const addSectionItem = useTemplateEditorStore(state => state.addSectionItem);
  const updateSectionItem = useTemplateEditorStore(state => state.updateSectionItem);
  const deleteSectionItem = useTemplateEditorStore(state => state.deleteSectionItem);

  return (
    <DynamicList
      items={education}
      addLabel={copy.addEntry}
      deleteLabel={copy.delete}
      entryLabel={copy.entry}
      onAdd={() =>
        addSectionItem("education", {
          institution: "",
          degree: "",
          start: "",
          end: "",
          grade: "",
          description: "",
        })
      }
      onDelete={id => deleteSectionItem("education", id)}
      renderItem={item => (
        <>
          <FieldInput
            label={copy.education.institution}
            onChange={value => updateSectionItem("education", item.id, "institution", value)}
            value={item.institution}
          />
          <FieldInput
            label={copy.education.degree}
            onChange={value => updateSectionItem("education", item.id, "degree", value)}
            value={item.degree}
          />
          <FieldGrid columns={3}>
            <FieldInput
              label={copy.from}
              onChange={value => updateSectionItem("education", item.id, "start", value)}
              value={item.start}
            />
            <FieldInput
              label={copy.until}
              onChange={value => updateSectionItem("education", item.id, "end", value)}
              value={item.end}
            />
            <FieldInput
              label={copy.education.grade}
              onChange={value => updateSectionItem("education", item.id, "grade", value)}
              value={item.grade}
            />
          </FieldGrid>
          <FieldTextarea
            label={copy.description}
            onChange={value => updateSectionItem("education", item.id, "description", value)}
            value={item.description}
          />
        </>
      )}
    />
  );
});

const ExperiencePanel = memo(function ExperiencePanel({ copy }) {
  const experience = useTemplateEditorStore(state => state.experience);
  const addSectionItem = useTemplateEditorStore(state => state.addSectionItem);
  const updateSectionItem = useTemplateEditorStore(state => state.updateSectionItem);
  const deleteSectionItem = useTemplateEditorStore(state => state.deleteSectionItem);

  return (
    <DynamicList
      items={experience}
      addLabel={copy.addEntry}
      deleteLabel={copy.delete}
      entryLabel={copy.entry}
      onAdd={() =>
        addSectionItem("experience", {
          company: "",
          role: "",
          start: "",
          end: "",
          description: "",
        })
      }
      onDelete={id => deleteSectionItem("experience", id)}
      renderItem={item => (
        <>
          <FieldInput
            label={copy.work.company}
            onChange={value => updateSectionItem("experience", item.id, "company", value)}
            value={item.company}
          />
          <FieldInput
            label={copy.work.role}
            onChange={value => updateSectionItem("experience", item.id, "role", value)}
            value={item.role}
          />
          <FieldGrid>
            <FieldInput
              label={copy.from}
              onChange={value => updateSectionItem("experience", item.id, "start", value)}
              value={item.start}
            />
            <FieldInput
              label={copy.until}
              onChange={value => updateSectionItem("experience", item.id, "end", value)}
              value={item.end}
            />
          </FieldGrid>
          <FieldTextarea
            label={copy.work.description}
            onChange={value => updateSectionItem("experience", item.id, "description", value)}
            rows={3}
            value={item.description}
          />
        </>
      )}
    />
  );
});

const SkillsPanel = memo(function SkillsPanel({ copy, languageCode }) {
  const skills = useTemplateEditorStore(state => state.skills);
  const addSectionItem = useTemplateEditorStore(state => state.addSectionItem);
  const updateSectionItem = useTemplateEditorStore(state => state.updateSectionItem);
  const deleteSectionItem = useTemplateEditorStore(state => state.deleteSectionItem);

  return (
    <DynamicList
      items={skills}
      addLabel={copy.addEntry}
      deleteLabel={copy.delete}
      entryLabel={copy.entry}
      onAdd={() => addSectionItem("skills", { name: "", level: "Fortgeschritten" })}
      onDelete={id => deleteSectionItem("skills", id)}
      renderItem={item => (
        <>
          <FieldInput
            label={copy.skillName}
            onChange={value => updateSectionItem("skills", item.id, "name", value)}
            value={item.name}
          />
          <FieldSelect
            label={copy.level}
            onChange={value => updateSectionItem("skills", item.id, "level", value)}
            options={SKILL_LEVELS.map(level => ({ label: SKILL_LEVEL_LABELS[level]?.[languageCode] ?? level, value: level }))}
            value={item.level}
          />
        </>
      )}
    />
  );
});

const LanguagesPanel = memo(function LanguagesPanel({ copy, languageCode }) {
  const languages = useTemplateEditorStore(state => state.languages);
  const addSectionItem = useTemplateEditorStore(state => state.addSectionItem);
  const updateSectionItem = useTemplateEditorStore(state => state.updateSectionItem);
  const deleteSectionItem = useTemplateEditorStore(state => state.deleteSectionItem);

  return (
    <DynamicList
      items={languages}
      addLabel={copy.addEntry}
      deleteLabel={copy.delete}
      entryLabel={copy.entry}
      onAdd={() => addSectionItem("languages", { name: "", level: "Mittelstufe (B1)" })}
      onDelete={id => deleteSectionItem("languages", id)}
      renderItem={item => (
        <>
          <FieldInput
            label={copy.language}
            onChange={value => updateSectionItem("languages", item.id, "name", value)}
            value={item.name}
          />
          <FieldSelect
            label={copy.level}
            onChange={value => updateSectionItem("languages", item.id, "level", value)}
            options={LANGUAGE_LEVELS.map(level => ({ label: LANGUAGE_LEVEL_LABELS[level]?.[languageCode] ?? level, value: level }))}
            value={item.level}
          />
        </>
      )}
    />
  );
});

const HobbiesPanel = memo(function HobbiesPanel({ copy }) {
  const hobbies = useTemplateEditorStore(state => state.hobbies);
  const setHobbiesFromInput = useTemplateEditorStore(state => state.setHobbiesFromInput);

  return (
    <div className={styles.stack}>
      <div className={styles.helpText}>{copy.hobbies.helpText}</div>
      <FieldTextarea
        label={copy.hobbies.label}
        onChange={value => setHobbiesFromInput(value)}
        rows={4}
        value={hobbies.join(", ")}
      />
    </div>
  );
});

const DesignPanel = memo(function DesignPanel({ copy, languageCode }) {
  const settings = useTemplateEditorStore(state => state.settings);
  const patchSettings = useTemplateEditorStore(state => state.patchSettings);

  return <DesignGallery copy={copy} languageCode={languageCode} patchSettings={patchSettings} settings={settings} />;
});

const PANEL_COMPONENTS = {
  design: DesignPanel,
  education: EducationPanel,
  experience: ExperiencePanel,
  hobbies: HobbiesPanel,
  languages: LanguagesPanel,
  personal: PersonalPanel,
  skills: SkillsPanel,
};

export function TemplateEditorPanel({ copy, languageCode, onPhotoUpload, photoRef, tab }) {
  const ActivePanel = PANEL_COMPONENTS[tab] ?? DesignPanel;

  return <ActivePanel copy={copy} languageCode={languageCode} onPhotoUpload={onPhotoUpload} photoRef={photoRef} />;
}
