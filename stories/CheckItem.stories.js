import itemShowcase from './itemShowcase';

export default {
  title: 'Components/Items/wam-check-item',
}

export const check = (args) => {
  const item = `
    <wam-check-item 
      label="${args.label}" 
      ${args.checked? 'checked' : ''}
      ${args.disabled ? 'disabled' : '' }
    ></wam-check-item>`;
  return itemShowcase(item);
}
check.storyName = 'HTML';
check.component = 'wam-check-item';
check.args = {
  label: 'Item One',
  checked: true,
  disabled: false
}

