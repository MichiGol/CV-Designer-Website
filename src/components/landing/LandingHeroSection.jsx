import cx from "clsx";
import { Link as RouterLink } from "react-router-dom";

import { LANDING_HERO, STUDIO_HIGHLIGHTS } from "../../config/landingConfig.js";
import styles from "./LandingSections.module.scss";

export function LandingHeroSection() {
  return (
    <section className={styles.heroPanel}>
      <div aria-hidden="true" className={styles.heroGlow} />

      <span className={styles.badge}>{LANDING_HERO.badge}</span>

      <h1 className={styles.heroTitle}>{LANDING_HERO.title}</h1>

      <div className={styles.heroDescription}>{LANDING_HERO.description}</div>

      <div className={styles.buttonRow}>
        <RouterLink
          className={cx(styles.buttonLink, styles["buttonLink--primary"])}
          to={LANDING_HERO.primaryAction.to}
        >
          {LANDING_HERO.primaryAction.label}
        </RouterLink>
        <RouterLink
          className={cx(styles.buttonLink, styles["buttonLink--secondary"])}
          to={LANDING_HERO.secondaryAction.to}
        >
          {LANDING_HERO.secondaryAction.label}
        </RouterLink>
      </div>

      <div className={styles.highlightsGrid}>
        {STUDIO_HIGHLIGHTS.map(card => (
          <article key={card.title} className={styles.highlightCard}>
            <div className={styles.highlightMetric}>{card.metric}</div>
            <h2 className={styles.highlightTitle}>{card.title}</h2>
            <div className={styles.highlightDescription}>{card.description}</div>
          </article>
        ))}
      </div>
    </section>
  );
}
