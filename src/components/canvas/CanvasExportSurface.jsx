import { memo } from "react";

import { CanvasElement } from "../CanvasElement.jsx";
import styles from "../CanvasEditor.module.scss";

export const CanvasExportSurface = memo(function CanvasExportSurface({ elements, exportPageRef }) {
  return (
    <div aria-hidden="true" className={styles.exportTarget}>
      <div ref={exportPageRef} className={styles.exportPage}>
        {elements.map(el => (
          <CanvasElement key={el.id} el={el} interactive={false} />
        ))}
      </div>
    </div>
  );
});
