# CV Designer

## Description

CV Designer is a browser-only resume builder built with React, Vite, and Zustand. It supports two editing workflows:

1. **Template editor**  
   A guided form with polished resume templates, live preview, PDF export, JSON import, and transfer into the freeform editor.
2. **Freeform canvas editor**  
   An A4 workspace where text, shapes, and images can be positioned manually.

The app has no backend. Data is stored locally in the browser through IndexedDB via Dexie. Older `localStorage` data is migrated when possible.

The UI supports German and English. The selected language is stored locally and drives the shell, landing page, template editor, canvas editor, template labels, skill levels, and language levels. Resume content entered by the user is treated as document data and is not automatically translated.

## Technologies Used

- React
- Vite
- Zustand
- Dexie / IndexedDB
- Sass CSS Modules
- Material UI
- Lucide React
- Recharts
- Swiper
- html2pdf.js / jsPDF / html2canvas

## Installation

### Requirements

- Node.js
- npm

### Commands

```bash
npm install
npm run dev
npm run build
npm run preview
```

After `npm run dev`, open the local Vite URL printed in the terminal.

## Route Map

- `/`  
  Landing page and entry into the two editing workflows.
- `/templates`  
  Structured resume editor with sections, design controls, preview, export, and transfer to canvas.
- `/canvas`  
  Freeform editor with layers, selection, resizing, keyboard shortcuts, and PDF export.

## Best Files To Read First

If someone is new to the codebase, this is the fastest reading order:

1. `src/main.jsx`  
   React bootstrap.
2. `src/App.jsx`  
   Route tree and page-level composition.
3. `src/providers/AppProviders.jsx`  
   Global providers: MUI theme, language context, and autosave context.
4. `src/components/SharedLayout.jsx`  
   Shared shell, top navigation, and autosave snackbar.
5. `src/pages/TemplatePage.jsx`  
   Entry point for the structured editor.
6. `src/store/templateEditorStore.js`  
   Main state model for the template editor.
7. `src/components/TemplateEditor.jsx`  
   Main template editor shell and workflow actions.
8. `src/pages/CanvasPage.jsx`  
   Entry point for the freeform editor.
9. `src/hooks/useCanvasEditor.js`  
   Main interaction logic for the canvas editor.
10. `src/components/CanvasEditor.jsx`  
    Main freeform editor UI.

## How The App Is Structured

At a high level:

- `App.jsx` defines the routes.
- `SharedLayout.jsx` wraps every route in the same shell.
- `TemplatePage.jsx` mounts the template workflow.
- `CanvasPage.jsx` mounts the freeform workflow.

There are two main state architectures:

### 1. Template Editor

- Uses Zustand store state from `src/store/templateEditorStore.js`.
- Persists draft data through `src/hooks/useTemplateDraftPersistence.js`.
- Stores resume drafts in IndexedDB using `src/storage/appDatabase.js`.

### 2. Canvas Editor

- Uses local component state plus helper logic in `src/hooks/useCanvasEditor.js`.
- Persists values through `src/hooks/usePersistentState.js`.
- Also stores data in IndexedDB through `src/storage/appDatabase.js`.

## Project Map

### `src/`

- `main.jsx`  
  App bootstrap.
- `App.jsx`  
  Main route configuration.
- `styles.css`  
  Global CSS variables and app-wide base styling.
- `theme.js`  
  Material UI theme configuration.

### `src/providers/`

- `AppProviders.jsx`  
  Wraps the app with `ThemeProvider`, `CssBaseline`, `LanguageProvider`, and `AutosaveProvider`.

### `src/context/`

- `AutosaveContext.jsx`  
  Global autosave toast state and helpers.
- `LanguageContext.jsx`  
  Global DE/EN language state, persisted language selection, and document language updates.

### `src/pages/`

- `LandingPage.jsx`  
  Landing route composition.
- `TemplatePage.jsx`  
  Hydrates the template editor, attaches template draft persistence, and reads `?layout=...`.
- `CanvasPage.jsx`  
  Hydrates canvas state from persistence and passes it into `CanvasEditor`.

### `src/components/`

- `SharedLayout.jsx`  
  Top-level shell for all routes.
- `TemplateEditor.jsx`  
  Main structured editor shell. Handles photo upload, JSON import, PDF export, and transfer to canvas.
- `CanvasEditor.jsx`  
  Main freeform editor shell. Owns toolbar, export surface, layers panel, canvas surface, and properties panel.
- `CanvasElement.jsx`  
  Rendering for individual canvas elements.
- `LayersAndContextBar.jsx`  
  Layer list and floating quick actions for selected canvas elements.
- `PropertiesPanel.jsx`  
  Editable properties for the currently selected canvas element.
- `PropControls.jsx`  
  Small shared controls used by the properties panel.
- `LayoutMiniPreview.jsx`  
  Small visual previews for template options.
- `TemplateShowcaseCarousel.jsx`  
  Landing-page carousel for template previews.

### `src/components/templateEditor/`

- `TemplateEditorPanels.jsx`  
  Left-side form panels for personal data, education, skills, languages, hobbies, and design.
- `TemplateEditorPreview.jsx`  
  Live preview and off-screen detached render surface used for export and transfer.
- `templateEditor.constants.js`  
  Editor tabs and template import registry.
- `templateEditor.utils.js`  
  Template export helpers, page background selection, and lazy-loading support.
- `TemplateEditor.module.scss`  
  Styling for the template editor shell and panels.

### `src/components/templates/`

- `shared.jsx`  
  Common template helpers like `buildTemplateData`, photo rendering, section helpers, and shared presentational primitives.
- Individual template files  
  Each file renders one resume template only.

Current template files:

- `HeaderCV.jsx`
- `SplitCV.jsx`
- `ExecutiveCV.jsx`
- `CardCV.jsx`
- `DarkModeCV.jsx`
- `EditorialCV.jsx`
- `ModernFlowCV.jsx`
- `NotionStyleCV.jsx`
- `SplitToneCV.jsx`
- `DarkDashboardCV.jsx`
- `EditorialPuristCV.jsx`
- `TerminalCV.jsx`
- `SignatureCVs.jsx`

Current selectable templates:

- Modern Flow
- Dark Dashboard
- Editorial Purist
- Terminal Hacker
- Split Tone Agency
- Notion Style
- Noir Parisian
- Swiss Signal
- Bauhaus Blocks
- Aurora Dusk
- Print Guild
- Obsidian Edge
- Wave
- Diagonal
- Arch
- Split
- Classic
- Card Grid
- Dark
- Magazine

### `src/components/landing/`

- `LandingHeroSection.jsx`
- `LandingGallerySection.jsx`
- `LandingWorkflowSection.jsx`
- `LandingCtaSection.jsx`
- `LandingSections.module.scss`

This folder contains the landing page sections and their styling.

### `src/config/`

- `appShellConfig.js`  
  Navigation labels, language options, and shared shell copy.
- `canvasCopy.js`  
  Canvas editor copy for German and English UI labels.
- `defaults.js`  
  Default CV data and default template settings.
- `landingConfig.js`  
  Landing page content for German and English.
- `layoutConfig.js`  
  Template registry, layout groups, skill/language level labels, skill display options, font pairs, and canvas element metadata.
- `pageSizes.js`  
  Shared A4 page dimensions.
- `storageKeys.js`  
  Keys used for persisted values.

### `src/hooks/`

- `useTemplateDraftPersistence.js`  
  Watches the template store and saves drafts with debounce.
- `usePersistentState.js`  
  Generic IndexedDB-backed state hook used by the canvas page.
- `useCanvasEditor.js`  
  Selection, dragging, resizing, duplication, z-order, keyboard shortcuts, and base canvas element creation.
- `useDebouncedPreviewSync.js`  
  Keeps template preview updates responsive by delaying the preview branch slightly.
- `useCVEditor.js`  
  Older structured-editor hook. It is not the active route path anymore. The current template editor uses `templateEditorStore.js` instead.

### `src/store/`

- `templateEditorStore.js`  
  Central state for the template editor. If you need to change structured editor data flow, this is usually the first file to inspect.

### `src/storage/`

- `appDatabase.js`  
  Dexie database setup, storage helpers, resume draft helpers, and legacy `localStorage` migration.

### `src/utils/`

- `templateToCanvas.js`  
  Converts the rendered template DOM into freeform canvas elements. This is the bridge between the structured editor and the canvas editor.

### `src/styles/`

- `PageShell.module.scss`  
  Shared page-level shell layout.
- `tokens.js`  
  Shared typography and style tokens used in templates.

## Template Editor Mental Model

The template editor works like this:

1. `TemplatePage.jsx` initializes the Zustand store.
2. `useTemplateDraftPersistence.js` subscribes to the store and saves draft changes.
3. `TemplateEditor.jsx` renders the two-column editor shell.
4. `TemplateEditorPanels.jsx` edits the structured CV data.
5. `TemplateEditorPreview.jsx` renders the live preview.
6. A template component from `src/components/templates/` renders the actual resume.

Important related files:

- State shape: `src/store/templateEditorStore.js`
- Default data: `src/config/defaults.js`
- Template registry: `src/config/layoutConfig.js`
- Shared template helpers: `src/components/templates/shared.jsx`
- Export logic: `src/components/templateEditor/templateEditor.utils.js`
- Template-to-canvas handoff: `src/utils/templateToCanvas.js`

## Canvas Editor Mental Model

The canvas editor works like this:

1. `CanvasPage.jsx` loads persisted canvas state.
2. `CanvasEditor.jsx` renders the workspace.
3. `useCanvasEditor.js` manages selection and mouse/keyboard interactions.
4. `CanvasElement.jsx` renders text, shapes, and images.
5. `PropertiesPanel.jsx` edits the selected element.

Important related files:

- Canvas state and interactions: `src/hooks/useCanvasEditor.js`
- UI shell: `src/components/CanvasEditor.jsx`
- Element rendering: `src/components/CanvasElement.jsx`
- Property editing: `src/components/PropertiesPanel.jsx`
- Layer and quick-action UI: `src/components/LayersAndContextBar.jsx`

## Persistence Model

The project does not use a server.

Everything is saved locally in IndexedDB through Dexie:

- Generic key/value persistence  
  Used for canvas elements, zoom level, snap setting, and template seed.
- Resume draft persistence  
  Used for the structured template editor.
- Language preference  
  Stored in `localStorage` because it is small shell-level app state.

Main persistence files:

- `src/storage/appDatabase.js`
- `src/hooks/usePersistentState.js`
- `src/hooks/useTemplateDraftPersistence.js`
- `src/config/storageKeys.js`

Notes:

- Legacy `localStorage` values are migrated when found.
- Autosave is debounced to avoid save loops and heavy write frequency.
- The top-level autosave UI is driven through `AutosaveContext.jsx`.

## Language Model

The app currently supports `DE` and `EN`.

Important files:

- `src/context/LanguageContext.jsx`
- `src/config/appShellConfig.js`
- `src/config/landingConfig.js`
- `src/config/canvasCopy.js`
- `src/components/templateEditor/templateEditor.constants.js`
- `src/components/templates/shared.jsx`

When adding visible UI copy, prefer adding it to the relevant config or copy object instead of hardcoding text in components. Template section labels should use `useResumeTemplateCopy()` from `src/components/templates/shared.jsx` so PDF previews and exports stay aligned with the selected language.

## Where To Change Things

If you want to add a new resume field:

1. Add it to `src/config/defaults.js`.
2. Merge or persist it through `src/store/templateEditorStore.js` if needed.
3. Add form controls in `src/components/templateEditor/TemplateEditorPanels.jsx`.
4. Render it in the relevant template files inside `src/components/templates/`.
5. If it should transfer to the canvas editor, update `src/utils/templateToCanvas.js`.

If you want to add a new template:

1. Create the new template component in `src/components/templates/`.
2. Register it in `src/config/layoutConfig.js`.
3. Add its importer in `src/components/templateEditor/templateEditor.constants.js`.
4. Wire its preview rendering path through `src/components/templateEditor/TemplateEditorPreview.jsx` if needed.
5. Add or update the mini preview in `src/components/LayoutMiniPreview.jsx`.
6. Add German and English labels/descriptions where the template exposes visible UI text.

If multiple related templates share helpers or visual primitives, group them in a shared file like `src/components/templates/SignatureCVs.jsx`.

If you want to add or change UI text:

1. Find the nearest copy/config object.
2. Add both German and English strings.
3. Read the active language with `useLanguage()` where needed.
4. Avoid translating user-entered resume content automatically.

If you want to change the template editor layout or controls:

- Start in `src/components/TemplateEditor.jsx`
- Then move into `src/components/templateEditor/`

If you want to change freeform canvas behavior:

- Start in `src/hooks/useCanvasEditor.js`
- Then check `src/components/CanvasEditor.jsx`
- Then check `src/components/CanvasElement.jsx` and `src/components/PropertiesPanel.jsx`

If you want to change autosave behavior:

- Template editor: `src/hooks/useTemplateDraftPersistence.js`
- Canvas and generic persisted values: `src/hooks/usePersistentState.js`
- IndexedDB storage layer: `src/storage/appDatabase.js`
- Autosave toast UI: `src/context/AutosaveContext.jsx`

If you want to change export behavior:

- Template editor export: `src/components/templateEditor/templateEditor.utils.js`
- Canvas export: `src/components/CanvasEditor.jsx`

If you want to change the shell, navigation, or page framing:

- `src/components/SharedLayout.jsx`
- `src/components/SharedLayout.module.scss`
- `src/config/appShellConfig.js`
- `src/styles/PageShell.module.scss`

## Template Families

There are two practical template rendering styles in the codebase:

1. **Classic templates**  
   These receive raw CV data and settings more directly.
2. **Data-driven templates**  
   These usually consume the normalized object built by `buildTemplateData()` in `src/components/templates/shared.jsx`.

If a template already uses shared helpers, follow that pattern instead of adding more one-off transformation logic.

## Generated And Non-Source Folders

- `dist/`  
  Production build output.
- `node_modules/`  
  Installed dependencies.
- `CV-Designer-Sicherung/`  
  Backup or older copy in the workspace. The active source code for the app described in this README lives under `src/`.

## Short Version

If you only remember a few things:

- `src/App.jsx` shows the route-level app structure.
- `src/store/templateEditorStore.js` is the main state entry for the template workflow.
- `src/hooks/useCanvasEditor.js` is the main logic entry for the freeform workflow.
- `src/storage/appDatabase.js` is the persistence foundation.
- `src/utils/templateToCanvas.js` is the bridge between the two editors.
