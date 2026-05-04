import cx from "clsx";
import { Link as RouterLink } from "react-router-dom";

import { LANDING_COPY } from "../../config/landingConfig.js";
import { useLanguage } from "../../context/LanguageContext.jsx";
import styles from "./LandingSections.module.scss";

export function LandingHeroSection() {
  const { languageCode } = useLanguage();
  const copy = LANDING_COPY[languageCode].hero;
  const highlights = LANDING_COPY[languageCode].highlights;

  return (
    <section className={styles.heroPanel}>
      <div aria-hidden="true" className={styles.heroGlow} />

      <span className={styles.badge}>{copy.badge}</span>

      <h1 className={styles.heroTitle}>{copy.title}</h1>

      <div className={styles.heroDescription}>{copy.description}</div>

      <div className={styles.buttonRow}>
        <RouterLink
          className={cx(styles.buttonLink, styles["buttonLink--primary"])}
          to={copy.primaryAction.to}
        >
          {copy.primaryAction.label}
        </RouterLink>
        <RouterLink
          className={cx(styles.buttonLink, styles["buttonLink--secondary"])}
          to={copy.secondaryAction.to}
        >
          {copy.secondaryAction.label}
        </RouterLink>
      </div>

      <div className={styles.highlightsGrid}>
        {highlights.map(card => (
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
