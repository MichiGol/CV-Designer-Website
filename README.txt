CV Designer
===========

What this project is
--------------------
This is a React + Vite app for building CVs in two different ways:

1. A structured template editor for people who want a guided form and a polished layout.
2. A freeform canvas editor for people who want to place text and shapes by hand.

There is no backend here. Everything is stored locally in the browser, so the app feels fast and simple but it also means the saved data lives on the current machine only.


How the app is organized
------------------------
The app is split into three routes:

- `/` shows the landing page and explains the workflow.
- `/templates` opens the structured CV editor.
- `/canvas` opens the freeform editor.

The shared shell for those routes lives in `src/components/SharedLayout.jsx`. That file is worth reading early because it owns the top navigation and the autosave toast that both editors use.


Good entry points
-----------------
If a human (or another AI) needs to understand the project quickly, these are the best files to read first:

- `src/main.jsx`
  Bootstraps React, the router, and the global stylesheet.

- `src/App.jsx`
  Declares the route tree and shows which page lives at which URL.

- `src/components/SharedLayout.jsx`
  Wraps every page with the app shell and exposes `notifyAutosave` through router outlet context.

- `src/pages/TemplatePage.jsx`
  Wires the template editor to persistent state and reads `?layout=` from the URL.

- `src/hooks/useCVEditor.js`
  The main state and action layer for the structured CV editor. This is where row updates, imports, photo uploads, and PDF export are handled.

- `src/components/TemplateEditor.jsx`
  The actual structured editor UI plus the live preview.

- `src/pages/CanvasPage.jsx`
  Wires the freeform editor to persistent state.

- `src/hooks/useCanvasEditor.js`
  The logic-heavy part of the canvas mode: selection, dragging, resizing, keyboard shortcuts, and z-order changes.

- `src/components/CanvasEditor.jsx`
  The freeform editor UI, including the layer list, the canvas surface, and the properties panel.


Mental model
------------
Structured editor:

- CV content starts from `DEFAULT_CV` in `src/config/defaults.js`.
- Visual settings start from `DEFAULT_TEMPLATE_SETTINGS`.
- `useCVEditor()` exposes small focused helpers like `updatePersonal`, `addRow`, and `updateRow`.
- `TemplateEditor` renders the form on the left and a live template preview on the right.
- The selected layout decides which template component is rendered.

Freeform editor:

- Canvas elements are plain objects with coordinates, size, z-index, and type-specific properties.
- The starter design comes from `SPLIT_TEMPLATE()` in `src/hooks/useCanvasEditor.js`.
- `useCanvasEditor()` keeps interaction state separate from the persisted element list.
- `CanvasEditor` renders a scaled A4 viewport, but element coordinates always live in real A4 space.

Persistence:

- `usePersistentState()` is the local storage bridge used by both editors.
- The hook reads once on startup and writes back whenever the value changes.
- The optional callback is used to trigger the small "autosaved" toast in the shared layout.

Export:

- The template editor uses `html2canvas` + `jsPDF`.
- The export path renders a hidden off-screen A4 surface so the PDF capture is based on a stable layout rather than the visible responsive preview.
- If the PDF export fails, the code falls back to `window.print()`.


Project map
-----------
`src/config`

- `defaults.js`: starter CV data and default template settings.
- `layoutConfig.js`: template registry, font pairs, skill display modes, and canvas element metadata.
- `landingConfig.js`: content for the landing page.
- `storageKeys.js`: localStorage keys used across the app.

`src/hooks`

- `usePersistentState.js`: localStorage-backed state hook.
- `useCVEditor.js`: structured editor logic.
- `useCanvasEditor.js`: freeform editor logic.

`src/components`

- `SharedLayout.jsx`: top-level shell and autosave notifications.
- `TemplateEditor.jsx`: form-based editor plus live template preview.
- `CanvasEditor.jsx`: canvas workspace with layers and property editing.
- `LayoutMiniPreview.jsx` and `TemplateShowcaseCarousel.jsx`: layout browsing UI.

`src/components/templates`

- Shared presentational helpers live in `shared.jsx`.
- Each layout component (`HeaderCV`, `SplitCV`, `ExecutiveCV`, etc.) focuses on rendering only.
- Template selection itself happens higher up in `TemplateEditor.jsx`.


Where to change things
----------------------
If you want to add a new template:

1. Create a new component in `src/components/templates/`.
2. Register it in `src/config/layoutConfig.js`.
3. Add the rendering branch inside `TemplateEditor.jsx`.
4. If needed, add a mini preview in `LayoutMiniPreview.jsx`.

If you want to add a new CV field:

1. Add the field to `DEFAULT_CV`.
2. Update the editor form in `TemplateEditor.jsx`.
3. Render the field in the template components that should show it.

If you want to change canvas behavior:

1. Start in `useCanvasEditor.js`.
2. Only move to `CanvasEditor.jsx` once you know whether the change is state logic or just UI.

If you want to change storage behavior:

1. Read `usePersistentState.js`.
2. Check `storageKeys.js`.
3. Remember that both editor pages rely on the same persistence pattern.


Things that may look unusual at first
-------------------------------------
- A lot of UI styling is inline. That is intentional in the editor-heavy parts, where the layout and visual rules are tightly tied to the rendered component.
- The structured editor supports both controlled and uncontrolled usage. In practice, the route page passes persistent state down, but the hook can also manage its own state when used in isolation.
- The canvas uses refs for some live values so mouse handlers do not get trapped with stale state during drag and resize interactions.
- There is a `CV-Designer-Sicherung` folder in the workspace that looks like an older backup. The active app code lives under `src/`.


Suggested reading order for a new contributor
---------------------------------------------
1. `src/App.jsx`
2. `src/components/SharedLayout.jsx`
3. `src/pages/TemplatePage.jsx`
4. `src/hooks/usePersistentState.js`
5. `src/hooks/useCVEditor.js`
6. `src/components/TemplateEditor.jsx`
7. `src/pages/CanvasPage.jsx`
8. `src/hooks/useCanvasEditor.js`
9. `src/components/CanvasEditor.jsx`


Short version
-------------
If you only remember four things, make it these:

- The app has two editors: guided templates and freeform canvas.
- Both editors save to localStorage automatically.
- Template rendering branches in `TemplateEditor.jsx`.
- Canvas behavior mostly lives in `useCanvasEditor.js`.
