import { LandingCtaSection } from "../components/landing/LandingCtaSection.jsx";
import { LandingGallerySection } from "../components/landing/LandingGallerySection.jsx";
import { LandingHeroSection } from "../components/landing/LandingHeroSection.jsx";
import { LandingWorkflowSection } from "../components/landing/LandingWorkflowSection.jsx";
import styles from "../components/landing/LandingSections.module.scss";

export default function LandingPage() {
  return (
    <div className={styles.page}>
      <div aria-hidden="true" className={styles.pageGlowLeft} />
      <div aria-hidden="true" className={styles.pageGlowRight} />

      <div className={styles.container}>
        <div className={styles.topGrid}>
          <LandingHeroSection />
          <LandingWorkflowSection />
        </div>

        <LandingGallerySection />
        <LandingCtaSection />
      </div>
    </div>
  );
}
