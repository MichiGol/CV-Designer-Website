import TemplateShowcaseCarousel from "../TemplateShowcaseCarousel.jsx";
import { LANDING_COPY } from "../../config/landingConfig.js";
import { useLanguage } from "../../context/LanguageContext.jsx";
import styles from "./LandingSections.module.scss";

export function LandingGallerySection() {
  const { languageCode } = useLanguage();
  const copy = LANDING_COPY[languageCode].gallery;

  return (
    <section className={styles.galleryPanel}>
      <div className={styles.galleryHeader}>
        <div>
          <div className={styles.sectionOverline}>{copy.overline}</div>
          <h2 className={styles.galleryTitle}>{copy.title}</h2>
        </div>
        <span className={styles.galleryChip}>{copy.chip}</span>
      </div>

      <TemplateShowcaseCarousel />
    </section>
  );
}
