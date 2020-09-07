function itemShowcase(item) {
  return `
    <h2>Popup or Nested Menu</h2>
    <wam-popup static>
      <wam-item label="Item Before"></wam-item>
      ${item}
      <wam-item label="Item After"></wam-item>
    </wam-popup>

    <h2>Toolbar</h2>
    <wam-toolbar>
      <wam-item label="Item Before" icon="skip_previous"></wam-item>
      ${item}
      <wam-item label="Item After" icon="skip_next"></wam-item>
    </wam-toolbar>`;
}

export default {
  title: 'Items',
}

export const item = (args) => {
  const item = `
    <wam-item
      label="${args.label}"
      icon="${args.icon}"
      ${args.showToolbarLabel ? 'showtoolbarlabel' : ''}
    >
    </wam-item>`;
  return itemShowcase(item);
}
item.storyName = 'Item';
item.component = 'wam-item';
item.args = {
  label: 'Item One',
  icon: 'alarm',
  showToolbarLabel: false
}

export const slottedLabel = (args) => {
  const item = 
    `<wam-item icon="${args.icon}">
    <div slot="label">
        <div>Custom Label</div>
        <div style="opacity:0.8;font-size:0.8rem">With sub label</div>
    </div>
  </wam-item>`;
  return itemShowcase(item);
}
slottedLabel.storyName = "Slotted Label";
slottedLabel.args = {
  icon: 'alarm'
};

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
  const item = `<wam-separator></wam-separator>`;
  return itemShowcase(item);
}
separator.storyName = 'Separator';
separator.component = 'wam-separator';