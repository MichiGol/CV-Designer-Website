import { memo } from "react";
import cx from "clsx";

import { DEFAULT_TEMPLATE_SETTINGS } from "../../config/defaults.js";
import {
  FIXED_SKILL_DISPLAY_LAYOUT_IDS,
  FONT_PAIRS,
  HEADER_LAYOUT_IDS,
  LANGUAGE_LEVELS,
  LAYOUT_GROUPS,
  SKILL_DISPLAY_OPTIONS,
  SKILL_LEVELS,
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

const DynamicList = memo(function DynamicList({ items, onAdd, onDelete, renderItem }) {
  return (
    <div className={styles.cardList}>
      {items.map((item, index) => (
        <div key={item.id} className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Eintrag {index + 1}</span>
            <button
              className={styles.cardDelete}
              onClick={() => onDelete(item.id)}
              type="button"
            >
              Loeschen
            </button>
          </div>
          <div className={styles.cardBody}>{renderItem(item)}</div>
        </div>
      ))}

      <button className={styles.addButton} onClick={onAdd} type="button">
        + Eintrag hinzufuegen
      </button>
    </div>
  );
});

const DesignGallery = memo(function DesignGallery({ patchSettings, settings }) {
  const activeFontIndex = Number.isFinite(settings.fontIdx)
    ? settings.fontIdx
    : DEFAULT_TEMPLATE_SETTINGS.fontIdx;
  const skillDisplayLocked = FIXED_SKILL_DISPLAY_LAYOUT_IDS.has(settings.layout);

  return (
    <div className={styles.designGallery}>
      {LAYOUT_GROUPS.map(group => (
        <section key={group.key} className={styles.designGroup}>
          <div className={styles.sectionHeading}>{group.label}</div>

          <div className={styles.layoutGrid}>
            {TEMPLATE_LAYOUTS.filter(option => option.group === group.key).map(option => {
              const active = settings.layout === option.id;

              return (
                <button
                  key={option.id}
                  className={cx(styles.layoutButton, {
                    [styles["layoutButton--active"]]: active,
                  })}
                  onClick={() => patchSettings({ layout: option.id })}
                  style={getLayoutAccentVars(settings.accent)}
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
                    <div className={styles.layoutTitle}>{option.label}</div>
                    <div className={styles.layoutDescription}>{option.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      ))}

      {HEADER_LAYOUT_IDS.has(settings.layout) ? (
        <section className={styles.designGroup}>
          <div className={styles.sectionHeading}>Position der Seitenleiste</div>
          <ToggleGroup
            onChange={value => patchSettings({ sidebarSide: value })}
            options={[
              { label: "Links", value: "left" },
              { label: "Rechts", value: "right" },
            ]}
            value={settings.sidebarSide}
          />
        </section>
      ) : null}

      <section className={styles.designGroup}>
        <div className={styles.sectionHeading}>Faehigkeiten-Darstellung</div>
        <ToggleGroup
          disabled={skillDisplayLocked}
          onChange={value => patchSettings({ skillDisplay: value })}
          options={SKILL_DISPLAY_OPTIONS.map(option => ({
            label: option.label,
            value: option.id,
          }))}
          triple
          value={settings.skillDisplay}
        />
        {skillDisplayLocked ? (
          <div className={styles.designNote}>
            Dieses Layout nutzt eine feste Skill-Darstellung, damit das Design konsistent
            bleibt.
          </div>
        ) : null}
      </section>

      <FieldSelect
        label="Schriftpaar"
        onChange={value => patchSettings({ fontIdx: Number(value) })}
        options={FONT_PAIRS.map((font, index) => ({
          label: font.label,
          value: String(index),
        }))}
        value={String(activeFontIndex)}
      />

      <div className={styles.fontControls}>
        <FieldInput
          label="Schriftgr."
          onChange={value =>
            patchSettings({
              size: Number(value) || DEFAULT_TEMPLATE_SETTINGS.size,
            })
          }
          type="number"
          value={settings.size}
        />

        <label className={styles.accentControl}>
          <span className={styles.accentLabel}>Farbe</span>
          <input
            className={styles.colorInput}
            onChange={event => patchSettings({ accent: event.target.value })}
            type="color"
            value={settings.accent}
          />
        </label>
      </div>
    </div>
  );
});

const PersonalPanel = memo(function PersonalPanel({ onPhotoUpload, photoRef }) {
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
              <div className={styles["photoUploadAvatar--placeholder"]}>Img</div>
            }
          />
        </div>

        <div className={styles.photoUploadCopy}>
          <span className={styles.photoUploadTitle}>Foto hochladen</span>
          <span className={styles.photoUploadHint}>
            JPG / PNG / grosszuegig in IndexedDB gespeichert
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
          <div className={styles.sectionHeading}>Bildausschnitt</div>

          <FieldRange
            formatValue={value => `${value.toFixed(2)}x`}
            label="Zoom"
            max={3}
            min={1}
            onChange={value => updatePersonal("photoScale", value)}
            step={0.05}
            value={photo.scale}
          />

          <FieldRange
            formatValue={value => `${Math.round(value)}%`}
            label="Horizontal"
            max={100}
            min={0}
            onChange={value => updatePersonal("photoPositionX", value)}
            value={photo.positionX}
          />

          <FieldRange
            formatValue={value => `${Math.round(value)}%`}
            label="Vertikal"
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
            Bildausschnitt zuruecksetzen
          </button>
        </div>
      ) : null}

      <FieldGrid>
        <FieldInput
          label="Vorname"
          onChange={value => updatePersonal("firstName", value)}
          value={personal.firstName}
        />
        <FieldInput
          label="Nachname"
          onChange={value => updatePersonal("lastName", value)}
          value={personal.lastName}
        />
      </FieldGrid>

      <FieldInput
        label="Berufsbezeichnung"
        onChange={value => updatePersonal("title", value)}
        value={personal.title}
      />

      <FieldGrid>
        <FieldInput
          label="E-Mail"
          onChange={value => updatePersonal("email", value)}
          value={personal.email}
        />
        <FieldInput
          label="Telefon"
          onChange={value => updatePersonal("phone", value)}
          value={personal.phone}
        />
      </FieldGrid>

      <FieldInput
        label="Adresse"
        onChange={value => updatePersonal("address", value)}
        value={personal.address}
      />
      <FieldInput
        label="Website / LinkedIn"
        onChange={value => updatePersonal("website", value)}
        value={personal.website}
      />
      <FieldTextarea
        label="Kurzprofil"
        onChange={value => updatePersonal("summary", value)}
        value={personal.summary}
      />
    </div>
  );
});

const EducationPanel = memo(function EducationPanel() {
  const education = useTemplateEditorStore(state => state.education);
  const addSectionItem = useTemplateEditorStore(state => state.addSectionItem);
  const updateSectionItem = useTemplateEditorStore(state => state.updateSectionItem);
  const deleteSectionItem = useTemplateEditorStore(state => state.deleteSectionItem);

  return (
    <DynamicList
      items={education}
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
            label="Einrichtung"
            onChange={value => updateSectionItem("education", item.id, "institution", value)}
            value={item.institution}
          />
          <FieldInput
            label="Abschluss / Studiengang"
            onChange={value => updateSectionItem("education", item.id, "degree", value)}
            value={item.degree}
          />
          <FieldGrid columns={3}>
            <FieldInput
              label="Von"
              onChange={value => updateSectionItem("education", item.id, "start", value)}
              value={item.start}
            />
            <FieldInput
              label="Bis"
              onChange={value => updateSectionItem("education", item.id, "end", value)}
              value={item.end}
            />
            <FieldInput
              label="Note"
              onChange={value => updateSectionItem("education", item.id, "grade", value)}
              value={item.grade}
            />
          </FieldGrid>
          <FieldTextarea
            label="Beschreibung"
            onChange={value => updateSectionItem("education", item.id, "description", value)}
            value={item.description}
          />
        </>
      )}
    />
  );
});

const ExperiencePanel = memo(function ExperiencePanel() {
  const experience = useTemplateEditorStore(state => state.experience);
  const addSectionItem = useTemplateEditorStore(state => state.addSectionItem);
  const updateSectionItem = useTemplateEditorStore(state => state.updateSectionItem);
  const deleteSectionItem = useTemplateEditorStore(state => state.deleteSectionItem);

  return (
    <DynamicList
      items={experience}
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
            label="Unternehmen"
            onChange={value => updateSectionItem("experience", item.id, "company", value)}
            value={item.company}
          />
          <FieldInput
            label="Position / Rolle"
            onChange={value => updateSectionItem("experience", item.id, "role", value)}
            value={item.role}
          />
          <FieldGrid>
            <FieldInput
              label="Von"
              onChange={value => updateSectionItem("experience", item.id, "start", value)}
              value={item.start}
            />
            <FieldInput
              label="Bis"
              onChange={value => updateSectionItem("experience", item.id, "end", value)}
              value={item.end}
            />
          </FieldGrid>
          <FieldTextarea
            label="Taetigkeitsbeschreibung"
            onChange={value => updateSectionItem("experience", item.id, "description", value)}
            rows={3}
            value={item.description}
          />
        </>
      )}
    />
  );
});

const SkillsPanel = memo(function SkillsPanel() {
  const skills = useTemplateEditorStore(state => state.skills);
  const addSectionItem = useTemplateEditorStore(state => state.addSectionItem);
  const updateSectionItem = useTemplateEditorStore(state => state.updateSectionItem);
  const deleteSectionItem = useTemplateEditorStore(state => state.deleteSectionItem);

  return (
    <DynamicList
      items={skills}
      onAdd={() => addSectionItem("skills", { name: "", level: "Fortgeschritten" })}
      onDelete={id => deleteSectionItem("skills", id)}
      renderItem={item => (
        <>
          <FieldInput
            label="Kenntnisbereich"
            onChange={value => updateSectionItem("skills", item.id, "name", value)}
            value={item.name}
          />
          <FieldSelect
            label="Niveau"
            onChange={value => updateSectionItem("skills", item.id, "level", value)}
            options={SKILL_LEVELS.map(level => ({ label: level, value: level }))}
            value={item.level}
          />
        </>
      )}
    />
  );
});

const LanguagesPanel = memo(function LanguagesPanel() {
  const languages = useTemplateEditorStore(state => state.languages);
  const addSectionItem = useTemplateEditorStore(state => state.addSectionItem);
  const updateSectionItem = useTemplateEditorStore(state => state.updateSectionItem);
  const deleteSectionItem = useTemplateEditorStore(state => state.deleteSectionItem);

  return (
    <DynamicList
      items={languages}
      onAdd={() => addSectionItem("languages", { name: "", level: "Mittelstufe (B1)" })}
      onDelete={id => deleteSectionItem("languages", id)}
      renderItem={item => (
        <>
          <FieldInput
            label="Sprache"
            onChange={value => updateSectionItem("languages", item.id, "name", value)}
            value={item.name}
          />
          <FieldSelect
            label="Niveau"
            onChange={value => updateSectionItem("languages", item.id, "level", value)}
            options={LANGUAGE_LEVELS.map(level => ({ label: level, value: level }))}
            value={item.level}
          />
        </>
      )}
    />
  );
});

const HobbiesPanel = memo(function HobbiesPanel() {
  const hobbies = useTemplateEditorStore(state => state.hobbies);
  const setHobbiesFromInput = useTemplateEditorStore(state => state.setHobbiesFromInput);

  return (
    <div className={styles.stack}>
      <div className={styles.helpText}>Kommagetrennt eingeben:</div>
      <FieldTextarea
        label="Hobbys"
        onChange={value => setHobbiesFromInput(value)}
        rows={4}
        value={hobbies.join(", ")}
      />
    </div>
  );
});

const DesignPanel = memo(function DesignPanel() {
  const settings = useTemplateEditorStore(state => state.settings);
  const patchSettings = useTemplateEditorStore(state => state.patchSettings);

  return <DesignGallery patchSettings={patchSettings} settings={settings} />;
});

export function TemplateEditorPanel({ onPhotoUpload, photoRef, tab }) {
  if (tab === "personal") {
    return <PersonalPanel onPhotoUpload={onPhotoUpload} photoRef={photoRef} />;
  }

  if (tab === "education") {
    return <EducationPanel />;
  }

  if (tab === "experience") {
    return <ExperiencePanel />;
  }

  if (tab === "skills") {
    return <SkillsPanel />;
  }

  if (tab === "languages") {
    return <LanguagesPanel />;
  }

  if (tab === "hobbies") {
    return <HobbiesPanel />;
  }

  return <DesignPanel />;
}
