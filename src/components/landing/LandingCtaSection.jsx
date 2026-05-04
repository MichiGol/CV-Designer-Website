import cx from "clsx";
import { Link as RouterLink } from "react-router-dom";

import { LANDING_COPY } from "../../config/landingConfig.js";
import { useLanguage } from "../../context/LanguageContext.jsx";
import styles from "./LandingSections.module.scss";

function CtaActionCard({ action, copy, emphasis = "secondary" }) {
  const isPrimary = emphasis === "primary";

  return (
    <RouterLink
      className={cx(styles.ctaActionCard, {
        [styles["ctaActionCard--primary"]]: isPrimary,
        [styles["ctaActionCard--secondary"]]: !isPrimary,
      })}
      to={action.to}
    >
      <div className={styles.ctaActionContent}>
        <div className={styles.ctaActionTagRow}>
          <span
            className={cx(styles.ctaActionTag, {
              [styles["ctaActionTag--primary"]]: isPrimary,
              [styles["ctaActionTag--secondary"]]: !isPrimary,
            })}
          >
            {isPrimary ? copy.recommended : copy.alternative}
          </span>
          <span className={styles.ctaActionArrow}>{"->"}</span>
        </div>

        <div>
          <h3 className={styles.ctaActionTitle}>{action.label}</h3>
          <div
            className={cx(styles.ctaActionHint, {
              [styles["ctaActionHint--primary"]]: isPrimary,
              [styles["ctaActionHint--secondary"]]: !isPrimary,
            })}
          >
            {action.hint}
          </div>
        </div>
      </div>
    </RouterLink>
  );
}

export function LandingCtaSection() {
  const { languageCode } = useLanguage();
  const copy = LANDING_COPY[languageCode].cta;

  return (
    <section className={styles.ctaPanel}>
      <div aria-hidden="true" className={styles.ctaGlow} />

      <div className={styles.ctaHeader}>
        <div className={styles.ctaCopy}>
          <div className={styles.sectionOverline}>{copy.overline}</div>
          <h2 className={styles.ctaTitle}>{copy.title}</h2>
          <div className={styles.ctaDescription}>{copy.description}</div>
        </div>

        <div className={styles.ctaActions}>
          <span className={styles.ctaActionsLabel}>{copy.actionOverline}</span>

          <div className={styles.ctaActionsGrid}>
            <CtaActionCard action={copy.primaryAction} copy={copy} emphasis="primary" />
            <CtaActionCard action={copy.secondaryAction} copy={copy} />
          </div>
        </div>
      </div>
    </section>
  );
}
