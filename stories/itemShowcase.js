export function itemShowcase(item) {
  return `
    <h2>Popup or Nested Menu</h2>
    <wam-popup static>
      <wam-item label="Item Before"></wam-item>
      ${item}
      <wam-item label="Item After"></wam-item>
    </wam-popup>

    <h2>Toolbar</h2>
    <wam-toolbar static>
      <wam-item label="Item Before" icon="skip_previous"></wam-item>
      ${item}
      <wam-item label="Item After" icon="skip_next"></wam-item>
    </wam-toolbar>`;
}

export default itemShowcase;