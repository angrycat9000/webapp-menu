import { setCustomElements } from '@storybook/web-components';

import '../dist/webapp-menu.js';
import customElements from '../dist/custom-elements.json';

setCustomElements(customElements);

export const parameters = {
  actions: {
    handles: [
      'wam-item-activate',
      'wam-menu-open',
      'wam-menu-close',
      'wam-submenu-open', 
      'wam-submenu-close'
    ]
  },
  docs: {disabled: true}
};