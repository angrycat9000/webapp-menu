import { configure, addDecorator } from '@storybook/html';

import wamlogger from '../stories/actionDecorator'
import { withA11y } from '@storybook/addon-a11y';


// automatically import all files ending in *.stories.js
const req = require.context('../stories', true, /\.stories\.js$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}




configure(loadStories, module);

addDecorator(wamlogger);
addDecorator(withA11y);