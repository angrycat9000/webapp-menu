function itemShowcase(item) {
  return `
    <h2>Popup or Nested Menu</h2>
    <wam-popup static>
      ${item}
    </wam-popup>

    <h2>Toolbar</h2>
    <wam-toolbar>
      ${item}
    </wam-toolbar>`;
}

export default {
  title: 'Items',
}

export const item = (args) => {
  const item = `<wam-item label="${args.label} icon="${args.icon}"></wam-item>`;
  return itemShowcase(item);
}
item.storyName = 'Item';
item.component = 'wam-item';
item.args = {
  label: 'Item One',
  icon: 'alarm'
}

export const check = (args) => {
  const item = `
    <wam-check-item 
      label="${args.label}" 
      ${args.checked? 'checked' : ''}
    ></wam-check-item>`;
  return itemShowcase(item);
}
check.storyName = 'Check Item';
check.component = 'wam-check-item';
check.args = {
  label: 'Item One',
  checked: true
}


export const separator = (args) => {
  const item = `
    <wam-item label="Item A"></wam-item>
    <wam-separator></wam-separator>
    <wam-item label="Item B"></wam-item>`;
  return itemShowcase(item);
}
separator.storyName = 'Separator';
separator.component = 'wam-separator';