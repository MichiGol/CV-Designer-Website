import { Box, Button, Chip, Paper, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { TEMPLATE_LAYOUTS } from "../config/layoutConfig.js";
import { LayoutMiniPreview } from "./LayoutMiniPreview.jsx";

const accents = ["#3b82f6", "#0ea5e9", "#38bdf8", "#22c55e", "#f97316", "#f59e0b"];
const groupLabels = {
  featured: "Neue Kollektion",
  header: "Kopfbereich",
  column: "Spaltenlayout",
  special: "Speziallayout",
};

function wrapIndex(index) {
  return (index + TEMPLATE_LAYOUTS.length) % TEMPLATE_LAYOUTS.length;
}

function PreviewCard({ accent, current = false, layout, onClick, tone }) {
  const interactive = typeof onClick === "function";

  return (
    <Paper
      component={interactive ? "button" : "div"}
      onClick={onClick}
      sx={{
        appearance: "none",
        background: `linear-gradient(180deg, ${alpha(accent, current ? 0.18 : 0.1)} 0%, rgba(8, 17, 31, 0.92) 72%)`,
        border: `1px solid ${alpha(accent, current ? 0.32 : 0.16)}`,
        cursor: interactive ? "pointer" : "default",
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
        minHeight: current ? 252 : 216,
        overflow: "hidden",
        p: current ? 2.5 : 2,
        position: "relative",
        textAlign: "left",
        transition: "transform 160ms ease, border-color 160ms ease, box-shadow 160ms ease",
        width: "100%",
        "&:hover": interactive
          ? {
              borderColor: alpha(accent, 0.3),
              boxShadow: `0 18px 42px ${alpha(accent, 0.14)}`,
              transform: "translateY(-2px)",
            }
          : undefined,
      }}
      type={interactive ? "button" : undefined}
    >
      <Stack alignItems="center" direction="row" justifyContent="space-between" spacing={1}>
        <Typography color="text.secondary" sx={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>
          {tone}
        </Typography>
        <Chip
          label={groupLabels[layout.group] ?? layout.group}
          size="small"
          sx={{
            backgroundColor: alpha(accent, 0.12),
            color: "#e6edf3",
          }}
        />
      </Stack>

      <Box
        sx={{
          backgroundColor: alpha("#ffffff", 0.04),
          border: `1px solid ${alpha("#e6edf3", 0.08)}`,
          borderRadius: 3,
          p: current ? 1.5 : 1,
        }}
      >
        <LayoutMiniPreview accent={accent} id={layout.id} />
      </Box>

      <Box sx={{ display: "grid", gap: 0.75 }}>
        <Typography sx={{ fontSize: current ? "1.5rem" : "1.1rem", fontWeight: current ? 700 : 600 }}>
          {layout.label}
        </Typography>
        <Typography color="text.secondary" sx={{ lineHeight: 1.65 }}>
          {layout.desc}
        </Typography>
      </Box>
    </Paper>
  );
}

export default function TemplateShowcaseCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeLayout = TEMPLATE_LAYOUTS[activeIndex];
  const previousIndex = wrapIndex(activeIndex - 1);
  const nextIndex = wrapIndex(activeIndex + 1);
  const activeAccent = accents[activeIndex % accents.length];
  const previousAccent = accents[previousIndex % accents.length];
  const nextAccent = accents[nextIndex % accents.length];

  const showPrevious = () => {
    setActiveIndex(current => wrapIndex(current - 1));
  };

  const showNext = () => {
    setActiveIndex(current => wrapIndex(current + 1));
  };

  return (
    <Box
      sx={{
        display: "grid",
        gap: 3,
        gridTemplateColumns: { xs: "1fr", xl: "330px minmax(0, 1fr)" },
      }}
    >
      <Paper
        sx={{
          background: "linear-gradient(180deg, rgba(5, 13, 24, 0.96), rgba(8, 17, 31, 0.82))",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          p: { xs: 2.5, md: 3 },
        }}
      >
        <Stack alignItems="center" direction="row" justifyContent="space-between" spacing={1}>
          <Typography color="text.secondary" sx={{ letterSpacing: "0.16em", textTransform: "uppercase" }} variant="overline">
            Kuratiertes Layout
          </Typography>
          <Chip label={`${String(activeIndex + 1).padStart(2, "0")} / ${TEMPLATE_LAYOUTS.length}`} size="small" />
        </Stack>

        <Box aria-live="polite">
          <Typography sx={{ fontSize: { xs: "2rem", md: "2.4rem" }, mb: 1 }} variant="h2">
            {activeLayout.label}
          </Typography>
          <Typography color="text.secondary" sx={{ lineHeight: 1.75 }}>
            {activeLayout.desc}. Öffnen Sie den Vorlagen-Editor direkt mit dieser Vorauswahl und wechseln
            Sie bei Bedarf anschließend in den Freiform-Editor für freie Feinarbeit.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", rowGap: 1 }}>
          <Chip
            label={`${groupLabels[activeLayout.group] ?? activeLayout.group}-Kollektion`}
            size="small"
            sx={{ backgroundColor: alpha(activeAccent, 0.14), color: "#e6edf3" }}
          />
          <Chip label={`${TEMPLATE_LAYOUTS.length} sofort nutzbare Layouts`} size="small" variant="outlined" />
        </Stack>

        <Stack direction={{ xs: "column", sm: "row", xl: "column" }} spacing={1.25}>
          <Button onClick={showPrevious} variant="outlined">
            Vorheriges Layout
          </Button>
          <Button onClick={showNext} variant="outlined">
            Nächstes Layout
          </Button>
        </Stack>

        <Button component={RouterLink} size="large" to={`/templates?layout=${activeLayout.id}`} variant="contained">
          Dieses Layout bearbeiten
        </Button>

        <Typography color="text.secondary" sx={{ fontSize: 13, lineHeight: 1.7 }}>
          Als Nächstes: <Box component="span" sx={{ color: "text.primary" }}>{TEMPLATE_LAYOUTS[nextIndex].label}</Box>
        </Typography>
      </Paper>

      <Box sx={{ display: "grid", gap: 2 }}>
        <Box
          sx={{
            alignItems: "stretch",
            display: "grid",
            gap: 2,
            gridTemplateColumns: { xs: "1fr", md: "minmax(0, 0.82fr) minmax(0, 1.2fr) minmax(0, 0.82fr)" },
          }}
        >
          <PreviewCard
            accent={previousAccent}
            layout={TEMPLATE_LAYOUTS[previousIndex]}
            onClick={() => setActiveIndex(previousIndex)}
            tone="Vorher"
          />
          <PreviewCard
            accent={activeAccent}
            current
            layout={activeLayout}
            tone="Ausgewählt"
          />
          <PreviewCard
            accent={nextAccent}
            layout={TEMPLATE_LAYOUTS[nextIndex]}
            onClick={() => setActiveIndex(nextIndex)}
            tone="Weiter"
          />
        </Box>

        <Paper
          sx={{
            backgroundColor: "rgba(8, 17, 31, 0.7)",
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            justifyContent: "center",
            p: 1.5,
          }}
        >
          {TEMPLATE_LAYOUTS.map((layout, index) => {
            const selected = index === activeIndex;

            return (
              <Button
                key={layout.id}
                onClick={() => setActiveIndex(index)}
                sx={{
                  backgroundColor: selected ? alpha(accents[index % accents.length], 0.16) : "transparent",
                  borderColor: selected ? alpha(accents[index % accents.length], 0.28) : alpha("#94a3b8", 0.12),
                  color: selected ? "text.primary" : "text.secondary",
                }}
                variant="outlined"
              >
                {layout.label}
              </Button>
            );
          })}
        </Paper>
      </Box>
    </Box>
  );
}
