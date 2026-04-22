import cx from "clsx";
import { Link as RouterLink } from "react-router-dom";

import { LANDING_CTA } from "../../config/landingConfig.js";
import styles from "./LandingSections.module.scss";

function CtaActionCard({ action, emphasis = "secondary" }) {
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
            {isPrimary ? "Empfohlen" : "Alternative"}
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
  return (
    <section className={styles.ctaPanel}>
      <div aria-hidden="true" className={styles.ctaGlow} />

      <div className={styles.ctaHeader}>
        <div className={styles.ctaCopy}>
          <div className={styles.sectionOverline}>{LANDING_CTA.overline}</div>
          <h2 className={styles.ctaTitle}>{LANDING_CTA.title}</h2>
          <div className={styles.ctaDescription}>{LANDING_CTA.description}</div>
        </div>

        <div className={styles.ctaActions}>
          <span className={styles.ctaActionsLabel}>{LANDING_CTA.actionOverline}</span>

          <div className={styles.ctaActionsGrid}>
            <CtaActionCard action={LANDING_CTA.primaryAction} emphasis="primary" />
            <CtaActionCard action={LANDING_CTA.secondaryAction} />
          </div>
        </div>
      </div>
    </section>
  );
}
