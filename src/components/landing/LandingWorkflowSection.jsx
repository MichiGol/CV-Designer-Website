import { LANDING_COPY } from "../../config/landingConfig.js";
import { useLanguage } from "../../context/LanguageContext.jsx";
import styles from "./LandingSections.module.scss";

export function LandingWorkflowSection() {
  const { languageCode } = useLanguage();
  const copy = LANDING_COPY[languageCode].workflow;

  return (
    <section className={styles.workflowPanel}>
      <div className={styles.sectionOverline}>{copy.overline}</div>

      {copy.cards.map(card => (
        <article key={card.title} className={styles.workflowCard}>
          <div className={styles.workflowEyebrow}>{card.eyebrow}</div>
          <h2 className={styles.workflowTitle}>{card.title}</h2>
          <div className={styles.workflowDescription}>{card.description}</div>
        </article>
      ))}
    </section>
  );
}
