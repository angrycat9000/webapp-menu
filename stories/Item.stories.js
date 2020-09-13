import itemShowcase from './itemShowcase';

export default {
  title: 'Components/Items/wam-item',
}

export const item = (args) => {
  const item = `
    <wam-item
      label="${args.label}"
      icon="${args.icon}"
      ${args.showLabel ? 'show-label' : ''}
      ${args.disabled ? 'disabled' : '' }
    >
    </wam-item>`;
  return itemShowcase(item);
}
item.storyName = 'HTML';
item.component = 'wam-item';
item.args = {
  label: 'Item One',
  icon: 'alarm',
  showLabel: false,
  disabled: false
}

export const slottedLabel = (args) => {
  const item = 
    `<wam-item
      icon="${args.icon}"
      ${args.showLabel ? 'show-label' : ''}
      ${args.disabled ? 'disabled' : '' }
    >
    <div slot="label">
        <div>Custom Label</div>
        <div style="opacity:0.8;font-size:0.8rem">With sub label</div>
    </div>
  </wam-item>`;
  return itemShowcase(item);
}
slottedLabel.storyName = "Slotted Label";
slottedLabel.args = {
  icon: 'alarm',
  showLabel: false,
  disabled: false
};

