import itemShowcase from './itemShowcase'

export default {
  title: 'Components/Items/wam-separator',
  component: 'wam-separator'
}

export const separator = (args) => {
  const item = `<wam-separator></wam-separator>`;
  return itemShowcase(item);
}
separator.storyName = 'HTML';