import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import SharedLayout from "./components/SharedLayout.jsx";
import { AppProviders } from "./providers/AppProviders.jsx";
import pageShellStyles from "./styles/PageShell.module.scss";

const CanvasPage = lazy(() => import("./pages/CanvasPage.jsx"));
const LandingPage = lazy(() => import("./pages/LandingPage.jsx"));
const TemplatePage = lazy(() => import("./pages/TemplatePage.jsx"));

function RouteFallback() {
  return <div className={pageShellStyles.loadingState}>Loading workspace...</div>;
}

export default function App() {
  return (
    <AppProviders>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          {/* Keep the shared shell mounted while the page content changes by route. */}
          <Route element={<SharedLayout />}>
            <Route index element={<LandingPage />} />
            <Route path="templates" element={<TemplatePage />} />
            <Route path="canvas" element={<CanvasPage />} />
            <Route path="*" element={<Navigate replace to="/" />} />
          </Route>
        </Routes>
      </Suspense>
    </AppProviders>
  );
}
