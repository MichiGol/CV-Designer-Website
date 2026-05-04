import { getElementTypeMeta } from "../../config/layoutConfig.js";

export function buildLayerNameMap(elements, languageCode = "DE") {
  const counts = {};
  const names = new Map();

  [...elements]
    .sort((a, b) => a.zIndex - b.zIndex)
    .forEach(element => {
      counts[element.type] = (counts[element.type] ?? 0) + 1;
      names.set(element.id, `${getElementTypeMeta(element.type, languageCode).label} ${counts[element.type]}`);
    });

  return names;
}
