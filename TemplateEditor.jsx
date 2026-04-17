import { Suspense, lazy, memo, useMemo, useRef, useState } from "react";
import { Button, MenuItem, Tab, Tabs, TextField, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useShallow } from "zustand/react/shallow";
import { DEFAULT_TEMPLATE_SETTINGS } from "../config/defaults.js";
import {
  FIXED_SKILL_DISPLAY_LAYOUT_IDS,
  FONT_PAIRS,
  HEADER_LAYOUT_IDS,
  LANGUAGE_LEVELS,
  LAYOUT_GROUPS,
  SKILL_DISPLAY_OPTIONS,
  SKILL_LEVELS,
  TEMPLATE_LAYOUTS,
} from "../config/layoutConfig.js";
import { useDebouncedPreviewSync } from "../hooks/useDebouncedPreviewSync.js";
import {
  buildResumeSnapshot,
  selectEditorSections,
  useTemplateEditorStore,
} from "../store/templateEditorStore.js";
import {
  COLOR,
  editorCard,
  FONT_EDITOR,
  inputBase,
  labelBase,
  muiFilledFieldProps,
  muiFilledFieldSx,
  muiToggleButtonSx,
} from "../styles/tokens.js";
import { transferTemplateToCanvas } from "../utils/templateToCanvas.js";
import { LayoutMiniPreview } from "./LayoutMiniPreview.jsx";
import { buildTemplateData } from "./templates/shared.jsx";

const A4_W = 794;
const A4_H = 1123;
const CSS_PIXELS_PER_INCH = 96;
const PDF_TARGET_DPI = 300;
const PDF_EXPORT_SCALE = PDF_TARGET_DPI / CSS_PIXELS_PER_INCH;

const EDITOR_TABS = [
  { id: "personal", label: "Persoenlich" },
  { id: "education", label: "Ausbildung" },
  { id: "experience", label: "Erfahrung" },
  { id: "skills", label: "Kenntnisse" },
  { id: "languages", label: "Sprachen" },
  { id: "hobbies", label: "Hobbys" },
  { id: "design", label: "Design" },
];

const footerBtnStyle = {
  padding: "9px 0",
  background: COLOR.bgSurface,
  border: `1px solid ${COLOR.borderMid}`,
  borderRadius: 8,
  color: COLOR.textSecondary,
  cursor: "pointer",
  fontSize: 11,
  fontWeight: 600,
  fontFamily: FONT_EDITOR,
};

const TEMPLATE_IMPORTERS = {
  card: () => import("./templates/CardCV.jsx"),
  darkdashboard: () => import("./templates/DarkDashboardCV.jsx"),
  darkmode: () => import("./templates/DarkModeCV.jsx"),
  editorial: () => import("./templates/EditorialCV.jsx"),
  editorialpurist: () => import("./templates/EditorialPuristCV.jsx"),
  executive: () => import("./templates/ExecutiveCV.jsx"),
  header: () => import("./templates/HeaderCV.jsx"),
  modernflow: () => import("./templates/ModernFlowCV.jsx"),
  notionstyle: () => import("./templates/NotionStyleCV.jsx"),
  split: () => import("./templates/SplitCV.jsx"),
  splittone: () => import("./templates/SplitToneCV.jsx"),
  terminal: () => import("./templates/TerminalCV.jsx"),
};

const lazyNamedTemplate = (templateKey, exportName) =>
  lazy(() => TEMPLATE_IMPORTERS[templateKey]().then(module => ({ default: module[exportName] })));

const CardCV = lazyNamedTemplate("card", "CardCV");
const DarkDashboardCV = lazyNamedTemplate("darkdashboard", "DarkDashboardCV");
const DarkModeCV = lazyNamedTemplate("darkmode", "DarkModeCV");
const EditorialCV = lazyNamedTemplate("editorial", "EditorialCV");
const EditorialPuristCV = lazyNamedTemplate("editorialpurist", "EditorialPuristCV");
const ExecutiveCV = lazyNamedTemplate("executive", "ExecutiveCV");
const HeaderCV = lazyNamedTemplate("header", "HeaderCV");
const ModernFlowCV = lazyNamedTemplate("modernflow", "ModernFlowCV");
const NotionStyleCV = lazyNamedTemplate("notionstyle", "NotionStyleCV");
const SplitCV = lazyNamedTemplate("split", "SplitCV");
const SplitToneCV = lazyNamedTemplate("splittone", "SplitToneCV");
const TerminalCV = lazyNamedTemplate("terminal", "TerminalCV");

const waitForPaint = () =>
  new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));

function getExportRenderScale() {
  const devicePixelRatio = Math.max(1, window.devicePixelRatio || 1);
  const targetWidth = Math.ceil((A4_W * PDF_EXPORT_SCALE) / devicePixelRatio) * devicePixelRatio;
  const targetHeight = Math.ceil((A4_H * PDF_EXPORT_SCALE) / devicePixelRatio) * devicePixelRatio;

  return Math.max(targetWidth / A4_W, targetHeight / A4_H);
}

function buildPdfImageCanvas(sourceCanvas) {
  const outputCanvas = document.createElement("canvas");
  outputCanvas.width = sourceCanvas.width;
  outputCanvas.height = sourceCanvas.height;

  const context = outputCanvas.getContext("2d", { alpha: false });

  if (!context) {
    return sourceCanvas;
  }

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, outputCanvas.width, outputCanvas.height);
  context.imageSmoothingEnabled = false;

  if ("imageSmoothingQuality" in context) {
    context.imageSmoothingQuality = "high";
  }

  context.drawImage(sourceCanvas, 0, 0);
  return outputCanvas;
}

function getPageBackground(layoutId) {
  const isCard = layoutId === "card";
  const isDark =
    layoutId === "darkmode" || layoutId === "darkdashboard" || layoutId === "terminal";

  if (isCard) {
    return "#f0f4f8";
  }

  if (isDark) {
    return "#020617";
  }

  return "#ffffff";
}

function getResumeFileName(snapshot) {
  return (
    [snapshot.cv.personal.firstName, snapshot.cv.personal.lastName]
      .filter(Boolean)
      .join("_")
      .replace(/\s+/g, "_") || "lebenslauf"
  );
}

async function ensureTemplateLoaded(layoutId) {
  if (HEADER_LAYOUT_IDS.has(layoutId)) {
    await TEMPLATE_IMPORTERS.header();
    return;
  }

  const importTemplate = TEMPLATE_IMPORTERS[layoutId];

  if (importTemplate) {
    await importTemplate();
  }
}

async function exportPreviewSurfaceAsPdf({ exportContent, exportPage, fileName }) {
  const previousTransform = exportContent.style.transform;
  const previousOrigin = exportContent.style.transformOrigin;

  try {
    const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
      import("html2canvas"),
      import("jspdf"),
    ]);

    if (document.fonts?.ready) {
      await document.fonts.ready;
    }

    exportContent.style.transform = "none";
    exportContent.style.transformOrigin = "top left";
    await waitForPaint();

    const fitScale = Math.min(
      1,
      A4_W / exportContent.scrollWidth,
      A4_H / exportContent.scrollHeight,
    );

    exportContent.style.transform = `scale(${fitScale})`;
    await waitForPaint();

    const renderScale = getExportRenderScale();
    const canvas = await html2canvas(exportPage, {
      backgroundColor: window.getComputedStyle(exportPage).backgroundColor || "#ffffff",
      height: A4_H,
      logging: false,
      scale: renderScale,
      useCORS: true,
      width: A4_W,
      windowHeight: A4_H,
      windowWidth: A4_W,
    });

    const pdfImageCanvas = buildPdfImageCanvas(canvas);
    const pdf = new jsPDF("p", "pt", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imageData = pdfImageCanvas.toDataURL("image/png", 1.0);

    pdf.addImage(imageData, "PNG", 0, 0, pageWidth, pageHeight, undefined, "NONE");
    pdf.save(`${fileName}.pdf`);
  } catch (error) {
    console.error("PDF export failed:", error);
    window.print();
  } finally {
    exportContent.style.transform = previousTransform;
    exportContent.style.transformOrigin = previousOrigin;
  }
}

const FieldInput = memo(function FieldInput({ label, onChange, value }) {
  return (
    <TextField
      {...muiFilledFieldProps}
      fullWidth
      label={label}
      onChange={event => onChange(event.target.value)}
      value={value}
    />
  );
});

const FieldTextarea = memo(function FieldTextarea({ label, onChange, rows = 2, value }) {
  return (
    <TextField
      {...muiFilledFieldProps}
      fullWidth
      label={label}
      minRows={rows}
      multiline
      onChange={event => onChange(event.target.value)}
      value={value}
    />
  );
});

function Grid2({ children }) {
  return <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>{children}</div>;
}

function Grid3({ children }) {
  return <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>{children}</div>;
}

const DynList = memo(function DynList({ items, onAdd, onDelete, renderItem }) {
  return (
    <div>
      {items.map((item, index) => (
        <div key={item.id} style={editorCard}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ ...labelBase, margin: 0 }}>Eintrag {index + 1}</span>
            <Button color="error" onClick={() => onDelete(item.id)} size="small" sx={{ minWidth: 0, p: 0.5 }}>
              x
            </Button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>{renderItem(item)}</div>
        </div>
      ))}

      <Button
        fullWidth
        onClick={onAdd}
        sx={{
          borderColor: COLOR.borderMid,
          borderStyle: "dashed",
          color: COLOR.textSecondary,
          fontFamily: FONT_EDITOR,
          fontSize: 12,
          py: 1,
          textTransform: "none",
          "&:hover": { borderColor: COLOR.blue, color: COLOR.blue },
        }}
        variant="outlined"
      >
        + Eintrag hinzufuegen
      </Button>
    </div>
  );
});

const DesignGallery = memo(function DesignGallery({ patchSettings, settings }) {
  const activeFontIndex = Number.isFinite(settings.fontIdx)
    ? settings.fontIdx
    : DEFAULT_TEMPLATE_SETTINGS.fontIdx;
  const skillDisplayLocked = FIXED_SKILL_DISPLAY_LAYOUT_IDS.has(settings.layout);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {LAYOUT_GROUPS.map(group => (
        <div key={group.key}>
          <div
            style={{
              color: COLOR.textMuted,
              fontFamily: FONT_EDITOR,
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.12em",
              marginBottom: 8,
              textTransform: "uppercase",
            }}
          >
            {group.label}
          </div>

          <div style={{ display: "grid", gap: 8, gridTemplateColumns: "1fr 1fr 1fr" }}>
            {TEMPLATE_LAYOUTS.filter(option => option.group === group.key).map(option => {
              const active = settings.layout === option.id;

              return (
                <button
                  key={option.id}
                  onClick={() => patchSettings({ layout: option.id })}
                  style={{
                    background: "transparent",
                    border: `${active ? "2px" : "1.5px"} solid ${
                      active ? settings.accent : COLOR.borderMid
                    }`,
                    borderRadius: 8,
                    cursor: "pointer",
                    outline: "none",
                    overflow: "hidden",
                    padding: 0,
                    transition: "border-color .15s",
                  }}
                  type="button"
                >
                  <div style={{ padding: 4 }}>
                    <LayoutMiniPreview accent={settings.accent} id={option.id} />
                  </div>
                  <div
                    style={{
                      background: active ? `${settings.accent}18` : "transparent",
                      borderTop: `1px solid ${
                        active ? `${settings.accent}40` : COLOR.border
                      }`,
                      padding: "5px 4px 7px",
                    }}
                  >
                    <div
                      style={{
                        color: active ? COLOR.textPrimary : COLOR.textSecondary,
                        fontFamily: FONT_EDITOR,
                        fontSize: 10,
                        fontWeight: 700,
                        textAlign: "center",
                      }}
                    >
                      {option.label}
                    </div>
                    <div
                      style={{
                        color: active ? settings.accent : COLOR.textMuted,
                        fontFamily: FONT_EDITOR,
                        fontSize: 9,
                        marginTop: 1,
                        textAlign: "center",
                      }}
                    >
                      {option.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {HEADER_LAYOUT_IDS.has(settings.layout) ? (
        <div>
          <div
            style={{
              color: COLOR.textMuted,
              fontFamily: FONT_EDITOR,
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.12em",
              marginBottom: 8,
              textTransform: "uppercase",
            }}
          >
            Position der Seitenleiste
          </div>
          <ToggleButtonGroup
            exclusive
            fullWidth
            onChange={(_, value) => value && patchSettings({ sidebarSide: value })}
            value={settings.sidebarSide}
          >
            <ToggleButton sx={{ ...muiToggleButtonSx, flex: 1 }} value="left">
              Links
            </ToggleButton>
            <ToggleButton sx={{ ...muiToggleButtonSx, flex: 1 }} value="right">
              Rechts
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
      ) : null}

      <div>
        <div
          style={{
            color: COLOR.textMuted,
            fontFamily: FONT_EDITOR,
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: "0.12em",
            marginBottom: 8,
            textTransform: "uppercase",
          }}
        >
          Faehigkeiten-Darstellung
        </div>
        <ToggleButtonGroup
          disabled={skillDisplayLocked}
          exclusive
          fullWidth
          onChange={(_, value) => value && patchSettings({ skillDisplay: value })}
          value={settings.skillDisplay}
        >
          {SKILL_DISPLAY_OPTIONS.map(option => (
            <ToggleButton key={option.id} sx={{ ...muiToggleButtonSx, flex: 1 }} value={option.id}>
              {option.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
        {skillDisplayLocked ? (
          <div
            style={{
              color: COLOR.textMuted,
              fontFamily: FONT_EDITOR,
              fontSize: 10,
              lineHeight: 1.5,
              marginTop: 8,
            }}
          >
            Dieses Layout nutzt eine feste Skill-Darstellung, damit das Design konsistent
            bleibt.
          </div>
        ) : null}
      </div>

      <TextField
        {...muiFilledFieldProps}
        fullWidth
        label="Schriftpaar"
        onChange={event => patchSettings({ fontIdx: Number(event.target.value) })}
        select
        value={activeFontIndex}
      >
        {FONT_PAIRS.map((font, index) => (
          <MenuItem key={font.label} value={index}>
            {font.label}
          </MenuItem>
        ))}
      </TextField>

      <div style={{ alignItems: "center", display: "grid", gap: 10, gridTemplateColumns: "1fr auto" }}>
        <TextField
          {...muiFilledFieldProps}
          label="Schriftgr."
          onChange={event =>
            patchSettings({
              size: Number(event.target.value) || DEFAULT_TEMPLATE_SETTINGS.size,
            })
          }
          sx={{ ...muiFilledFieldSx, maxWidth: 120 }}
          type="number"
          value={settings.size}
        />
        <div style={{ alignItems: "center", display: "flex", gap: 7 }}>
          <span style={{ color: COLOR.textSecondary, fontFamily: FONT_EDITOR, fontSize: 10 }}>
            Farbe
          </span>
          <input
            onChange={event => patchSettings({ accent: event.target.value })}
            style={{
              background: "none",
              border: `2px solid ${COLOR.border}`,
              borderRadius: 7,
              cursor: "pointer",
              height: 34,
              padding: 2,
              width: 34,
            }}
            type="color"
            value={settings.accent}
          />
        </div>
      </div>
    </div>
  );
});

const PersonalPanel = memo(function PersonalPanel({ onPhotoUpload, photoRef }) {
  const personal = useTemplateEditorStore(state => state.personal);
  const updatePersonal = useTemplateEditorStore(state => state.updatePersonal);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div
        onClick={() => photoRef.current?.click()}
        style={{
          ...editorCard,
          alignItems: "center",
          border: `1px dashed ${COLOR.borderMid}`,
          cursor: "pointer",
          display: "flex",
          gap: 14,
        }}
      >
        {personal.photo ? (
          <img
            alt="Profilfoto"
            src={personal.photo}
            style={{ width: 56, height: 56, borderRadius: "50%", objectFit: "cover" }}
          />
        ) : (
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: COLOR.border,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
            }}
          >
            Img
          </div>
        )}
        <div>
          <p style={{ color: COLOR.textPrimary, fontSize: 12, fontWeight: 600, margin: 0 }}>
            Foto hochladen
          </p>
          <p style={{ color: COLOR.textSecondary, fontSize: 10, margin: "2px 0 0" }}>
            JPG · PNG · grosszuegig in IndexedDB gespeichert
          </p>
        </div>
      </div>
      <input accept="image/*" onChange={onPhotoUpload} ref={photoRef} style={{ display: "none" }} type="file" />

      <Grid2>
        <FieldInput label="Vorname" onChange={value => updatePersonal("firstName", value)} value={personal.firstName} />
        <FieldInput label="Nachname" onChange={value => updatePersonal("lastName", value)} value={personal.lastName} />
      </Grid2>

      <FieldInput label="Berufsbezeichnung" onChange={value => updatePersonal("title", value)} value={personal.title} />

      <Grid2>
        <FieldInput label="E-Mail" onChange={value => updatePersonal("email", value)} value={personal.email} />
        <FieldInput label="Telefon" onChange={value => updatePersonal("phone", value)} value={personal.phone} />
      </Grid2>

      <FieldInput label="Adresse" onChange={value => updatePersonal("address", value)} value={personal.address} />
      <FieldInput label="Website / LinkedIn" onChange={value => updatePersonal("website", value)} value={personal.website} />
      <FieldTextarea label="Kurzprofil" onChange={value => updatePersonal("summary", value)} rows={4} value={personal.summary} />
    </div>
  );
});

const EducationPanel = memo(function EducationPanel() {
  const education = useTemplateEditorStore(state => state.education);
  const addSectionItem = useTemplateEditorStore(state => state.addSectionItem);
  const updateSectionItem = useTemplateEditorStore(state => state.updateSectionItem);
  const deleteSectionItem = useTemplateEditorStore(state => state.deleteSectionItem);

  return (
    <DynList
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
          <Grid3>
            <FieldInput label="Von" onChange={value => updateSectionItem("education", item.id, "start", value)} value={item.start} />
            <FieldInput label="Bis" onChange={value => updateSectionItem("education", item.id, "end", value)} value={item.end} />
            <FieldInput label="Note" onChange={value => updateSectionItem("education", item.id, "grade", value)} value={item.grade} />
          </Grid3>
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
    <DynList
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
          <Grid2>
            <FieldInput label="Von" onChange={value => updateSectionItem("experience", item.id, "start", value)} value={item.start} />
            <FieldInput label="Bis" onChange={value => updateSectionItem("experience", item.id, "end", value)} value={item.end} />
          </Grid2>
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
    <DynList
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
          <div>
            <label style={labelBase}>Niveau</label>
            <select
              onChange={event => updateSectionItem("skills", item.id, "level", event.target.value)}
              style={inputBase}
              value={item.level}
            >
              {SKILL_LEVELS.map(level => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
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
    <DynList
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
          <div>
            <label style={labelBase}>Niveau</label>
            <select
              onChange={event => updateSectionItem("languages", item.id, "level", event.target.value)}
              style={inputBase}
              value={item.level}
            >
              {LANGUAGE_LEVELS.map(level => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
        </>
      )}
    />
  );
});

const HobbiesPanel = memo(function HobbiesPanel() {
  const hobbies = useTemplateEditorStore(state => state.hobbies);
  const setHobbiesFromInput = useTemplateEditorStore(state => state.setHobbiesFromInput);

  return (
    <div>
      <p style={{ color: COLOR.textSecondary, fontSize: 11, marginBottom: 10 }}>
        Kommagetrennt eingeben:
      </p>
      <textarea
        onChange={event => setHobbiesFromInput(event.target.value)}
        placeholder="z.B. Klettern, Jazz, 3D-Druck"
        rows={4}
        style={{ ...inputBase, resize: "vertical" }}
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

function TemplateSurfaceFallback() {
  return (
    <div
      style={{
        alignItems: "center",
        color: COLOR.textMuted,
        display: "flex",
        fontFamily: FONT_EDITOR,
        fontSize: 12,
        justifyContent: "center",
        minHeight: 280,
      }}
    >
      Loading template...
    </div>
  );
}

const ResumeTemplateDocument = memo(function ResumeTemplateDocument({ pageMode = "preview", snapshot }) {
  const { cv, settings } = snapshot;
  const templateData = useMemo(() => buildTemplateData(cv), [cv]);
  const displayFont = FONT_PAIRS[settings.fontIdx] ?? FONT_PAIRS[0];
  const isHeader = HEADER_LAYOUT_IDS.has(settings.layout);

  if (settings.layout === "modernflow") {
    return (
      <Suspense fallback={<TemplateSurfaceFallback />}>
        <ModernFlowCV
          accent={settings.accent}
          bodyFont={displayFont.body}
          data={templateData}
          displayFont={displayFont.display}
          pageMode={pageMode}
          size={settings.size}
          skillDisplay={settings.skillDisplay}
        />
      </Suspense>
    );
  }

  if (settings.layout === "darkdashboard") {
    return (
      <Suspense fallback={<TemplateSurfaceFallback />}>
        <DarkDashboardCV
          accent={settings.accent}
          bodyFont={displayFont.body}
          data={templateData}
          displayFont={displayFont.display}
          pageMode={pageMode}
          size={settings.size}
          skillDisplay={settings.skillDisplay}
        />
      </Suspense>
    );
  }

  if (settings.layout === "editorialpurist") {
    return (
      <Suspense fallback={<TemplateSurfaceFallback />}>
        <EditorialPuristCV
          accent={settings.accent}
          bodyFont={displayFont.body}
          data={templateData}
          displayFont={displayFont.display}
          pageMode={pageMode}
          size={settings.size}
          skillDisplay={settings.skillDisplay}
        />
      </Suspense>
    );
  }

  if (settings.layout === "terminal") {
    return (
      <Suspense fallback={<TemplateSurfaceFallback />}>
        <TerminalCV
          accent={settings.accent}
          bodyFont={displayFont.body}
          data={templateData}
          displayFont={displayFont.display}
          pageMode={pageMode}
          size={settings.size}
          skillDisplay={settings.skillDisplay}
        />
      </Suspense>
    );
  }

  if (settings.layout === "splittone") {
    return (
      <Suspense fallback={<TemplateSurfaceFallback />}>
        <SplitToneCV
          accent={settings.accent}
          bodyFont={displayFont.body}
          data={templateData}
          displayFont={displayFont.display}
          pageMode={pageMode}
          size={settings.size}
          skillDisplay={settings.skillDisplay}
        />
      </Suspense>
    );
  }

  if (settings.layout === "notionstyle") {
    return (
      <Suspense fallback={<TemplateSurfaceFallback />}>
        <NotionStyleCV
          accent={settings.accent}
          bodyFont={displayFont.body}
          data={templateData}
          displayFont={displayFont.display}
          pageMode={pageMode}
          size={settings.size}
          skillDisplay={settings.skillDisplay}
        />
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<TemplateSurfaceFallback />}>
      <>
        {isHeader ? (
          <HeaderCV
            bodyFont={displayFont.body}
            cv={cv}
            displayFont={displayFont.display}
            pageMode={pageMode}
            st={settings}
          />
        ) : null}
        {settings.layout === "split" ? (
          <SplitCV
            bodyFont={displayFont.body}
            cv={cv}
            displayFont={displayFont.display}
            pageMode={pageMode}
            st={settings}
          />
        ) : null}
        {settings.layout === "executive" ? (
          <ExecutiveCV
            bodyFont={displayFont.body}
            cv={cv}
            displayFont={displayFont.display}
            pageMode={pageMode}
            st={settings}
          />
        ) : null}
        {settings.layout === "card" ? (
          <CardCV
            bodyFont={displayFont.body}
            cv={cv}
            displayFont={displayFont.display}
            pageMode={pageMode}
            st={settings}
          />
        ) : null}
        {settings.layout === "darkmode" ? (
          <DarkModeCV
            bodyFont={displayFont.body}
            cv={cv}
            displayFont={displayFont.display}
            pageMode={pageMode}
            st={settings}
          />
        ) : null}
        {settings.layout === "editorial" ? (
          <EditorialCV
            bodyFont={displayFont.body}
            cv={cv}
            displayFont={displayFont.display}
            pageMode={pageMode}
            st={settings}
          />
        ) : null}
      </>
    </Suspense>
  );
});

const ResumePreviewPane = memo(function ResumePreviewPane() {
  const liveSections = useTemplateEditorStore(useShallow(selectEditorSections));
  const liveSnapshot = useMemo(() => buildResumeSnapshot(liveSections), [liveSections]);
  const { isPreviewPending, previewValue } = useDebouncedPreviewSync(liveSnapshot, 300);
  const pageBackground = getPageBackground(previewValue.settings.layout);

  return (
    <div
      className="cv-preview-panel cv-scroll"
      style={{
        flex: 1,
        overflowY: "auto",
        background: COLOR.bgCanvas,
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "28px 20px",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          right: 24,
          top: 14,
          padding: "6px 10px",
          borderRadius: 999,
          background: isPreviewPending ? `${previewValue.settings.accent}18` : "rgba(15,23,42,0.55)",
          border: `1px solid ${
            isPreviewPending ? `${previewValue.settings.accent}35` : "rgba(148,163,184,0.2)"
          }`,
          color: isPreviewPending ? previewValue.settings.accent : "#cbd5e1",
          fontFamily: FONT_EDITOR,
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          zIndex: 2,
        }}
      >
        {isPreviewPending ? "Preview syncing..." : "Preview ready"}
      </div>

      <div
        className="cv-preview-sheet"
        style={{
          width: "100%",
          maxWidth: 760,
          background: pageBackground,
          borderRadius: 8,
          boxShadow:
            pageBackground === "#020617"
              ? "0 32px 80px rgba(0,0,0,0.8),0 0 0 1px #21262d"
              : "0 32px 80px rgba(0,0,0,0.55)",
          overflow: "hidden",
        }}
      >
        <ResumeTemplateDocument pageMode="preview" snapshot={previewValue} />
      </div>
    </div>
  );
});

const DetachedRenderSurface = memo(function DetachedRenderSurface({
  exportContentRef,
  exportPageRef,
  snapshot,
}) {
  if (!snapshot) {
    return null;
  }

  const pageBackground = getPageBackground(snapshot.settings.layout);

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        left: -10000,
        top: 0,
        width: A4_W,
        height: A4_H,
        pointerEvents: "none",
        zIndex: -1,
      }}
    >
      <div ref={exportPageRef} style={{ width: A4_W, height: A4_H, background: pageBackground, overflow: "hidden" }}>
        <div ref={exportContentRef} style={{ width: A4_W, minHeight: A4_H, transformOrigin: "top left" }}>
          <ResumeTemplateDocument pageMode="export" snapshot={snapshot} />
        </div>
      </div>
    </div>
  );
});

function renderTabPanel(tab, photoRef, onPhotoUpload) {
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

export function TemplateEditor() {
  const [tab, setTab] = useState("personal");
  const [isTransferring, setIsTransferring] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [detachedSnapshot, setDetachedSnapshot] = useState(null);
  const navigate = useNavigate();
  const accent = useTemplateEditorStore(state => state.settings.accent);
  const importResumeJson = useTemplateEditorStore(state => state.importResumeJson);

  const photoRef = useRef(null);
  const jsonRef = useRef(null);
  const exportPageRef = useRef(null);
  const exportContentRef = useRef(null);
  const isBusy = isExporting || isTransferring;

  const mountDetachedSurface = async () => {
    const snapshot = buildResumeSnapshot(selectEditorSections(useTemplateEditorStore.getState()));
    await ensureTemplateLoaded(snapshot.settings.layout);
    setDetachedSnapshot(snapshot);
    await waitForPaint();
    return snapshot;
  };

  const unmountDetachedSurface = () => {
    setDetachedSnapshot(null);
  };

  const handlePhotoUpload = event => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = loadEvent => {
      useTemplateEditorStore.getState().updatePersonal("photo", loadEvent.target?.result ?? null);
    };
    reader.readAsDataURL(file);
  };

  const handleJSONImport = event => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = loadEvent => {
      try {
        importResumeJson(JSON.parse(loadEvent.target?.result ?? "{}"));
      } catch (error) {
        console.warn("Unable to import resume JSON.", error);
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  const handleExportPdf = async () => {
    if (isBusy) {
      return;
    }

    setIsExporting(true);

    try {
      const snapshot = await mountDetachedSurface();

      if (!exportPageRef.current || !exportContentRef.current) {
        return;
      }

      await exportPreviewSurfaceAsPdf({
        exportContent: exportContentRef.current,
        exportPage: exportPageRef.current,
        fileName: getResumeFileName(snapshot),
      });
    } finally {
      unmountDetachedSurface();
      setIsExporting(false);
    }
  };

  const handleTransferToCanvas = async () => {
    if (isBusy) {
      return;
    }

    setIsTransferring(true);

    try {
      await mountDetachedSurface();

      if (!exportPageRef.current) {
        return;
      }

      await transferTemplateToCanvas(exportPageRef.current);
      navigate("/canvas");
    } catch (error) {
      console.error("Unable to transfer template into the canvas editor.", error);
    } finally {
      unmountDetachedSurface();
      setIsTransferring(false);
    }
  };

  return (
    <div
      className="cv-builder"
      style={{ display: "flex", height: "100%", fontFamily: FONT_EDITOR, overflow: "hidden" }}
    >
      <div
        className="cv-editor-panel"
        style={{
          width: 390,
          display: "flex",
          flexDirection: "column",
          background: COLOR.bgPanel,
          borderRight: `1px solid ${COLOR.border}`,
          flexShrink: 0,
        }}
      >
        <div style={{ padding: "6px 10px 0", background: COLOR.bgApp }}>
          <Tabs
            allowScrollButtonsMobile
            onChange={(_, value) => setTab(value)}
            scrollButtons="auto"
            sx={{
              "& .MuiTab-root": {
                color: COLOR.textSecondary,
                fontFamily: FONT_EDITOR,
                fontSize: 10,
                fontWeight: 700,
                minHeight: 40,
                minWidth: "auto",
                textTransform: "none",
              },
              "& .MuiTabs-indicator": { backgroundColor: accent },
            }}
            value={tab}
            variant="scrollable"
          >
            {EDITOR_TABS.map(tabOption => (
              <Tab
                key={tabOption.id}
                label={tabOption.label}
                sx={{
                  "&.Mui-selected": {
                    color: tabOption.id === "design" ? accent : COLOR.textPrimary,
                  },
                }}
                value={tabOption.id}
              />
            ))}
          </Tabs>
        </div>

        <div className="cv-scroll" style={{ flex: 1, overflowY: "auto", padding: "16px 18px" }}>
          {renderTabPanel(tab, photoRef, handlePhotoUpload)}
        </div>

        <div style={{ padding: "12px 18px 16px", background: COLOR.bgApp, borderTop: `1px solid ${COLOR.border}` }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <button onClick={() => jsonRef.current?.click()} style={footerBtnStyle} type="button">
              Import
            </button>
            <button
              disabled={isExporting}
              onClick={handleExportPdf}
              style={{
                ...footerBtnStyle,
                opacity: isExporting ? 0.75 : 1,
                cursor: isExporting ? "progress" : "pointer",
              }}
              type="button"
            >
              {isExporting ? "Export..." : "Export"}
            </button>
            <button
              disabled={isTransferring}
              onClick={handleTransferToCanvas}
              style={{
                ...footerBtnStyle,
                background: accent,
                border: "none",
                color: "white",
                fontWeight: 700,
                letterSpacing: "0.05em",
                boxShadow: `0 4px 14px ${accent}50`,
                opacity: isTransferring ? 0.78 : 1,
                cursor: isTransferring ? "progress" : "pointer",
              }}
              type="button"
            >
              {isTransferring ? "Transfer..." : "In Freiform oeffnen"}
            </button>
            <button onClick={() => window.print()} style={footerBtnStyle} type="button">
              PDF / Drucken
            </button>
          </div>
          <input accept=".json" onChange={handleJSONImport} ref={jsonRef} style={{ display: "none" }} type="file" />
        </div>
      </div>

      <ResumePreviewPane />
      <DetachedRenderSurface exportContentRef={exportContentRef} exportPageRef={exportPageRef} snapshot={detachedSnapshot} />
    </div>
  );
}
