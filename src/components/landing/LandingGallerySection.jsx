import TemplateShowcaseCarousel from "../TemplateShowcaseCarousel.jsx";
import { LANDING_GALLERY } from "../../config/landingConfig.js";
import styles from "./LandingSections.module.scss";

export function LandingGallerySection() {
  return (
    <section className={styles.galleryPanel}>
      <div className={styles.galleryHeader}>
        <div>
          <div className={styles.sectionOverline}>{LANDING_GALLERY.overline}</div>
          <h2 className={styles.galleryTitle}>{LANDING_GALLERY.title}</h2>
        </div>
        <span className={styles.galleryChip}>{LANDING_GALLERY.chip}</span>
      </div>

      <TemplateShowcaseCarousel />
    </section>
  );
}
