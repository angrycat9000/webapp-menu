/**
 * @param {HTMLElement} root
 * @param {Array<HTMLElement>} [items=[]]
 * @returns {Array<HTMLElement>}
 */
export default function getItemsFlatteningGroups(root, items) {
  items = items ?? [];
  for(const child of root.children) {
    const tag = child.tagName.toLowerCase();
    if("wam-group" === tag) {
      getItemsFlatteningGroups(child, items);
    } else if(!child.hasAttribute("slot")) {
      items.push(child);
    }
  }
  return items;
}