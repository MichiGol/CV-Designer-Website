import { LANDING_WORKFLOW, WORKFLOW_CARDS } from "../../config/landingConfig.js";
import styles from "./LandingSections.module.scss";

export function LandingWorkflowSection() {
  return (
    <section className={styles.workflowPanel}>
      <div className={styles.sectionOverline}>{LANDING_WORKFLOW.overline}</div>

      {WORKFLOW_CARDS.map(card => (
        <article key={card.title} className={styles.workflowCard}>
          <div className={styles.workflowEyebrow}>{card.eyebrow}</div>
          <h2 className={styles.workflowTitle}>{card.title}</h2>
          <div className={styles.workflowDescription}>{card.description}</div>
        </article>
      ))}
    </section>
  );
}
