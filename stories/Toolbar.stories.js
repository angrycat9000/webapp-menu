import { document, console } from 'global';
import { storiesOf } from '@storybook/html';
import Menu from '../dist/webapp-menu';

storiesOf('Toolbar', module)
  .add('simple', () => 
    `<wam-toolbar open>
        <wam-item label="Add"><span slot="icon">X</span></wam-item>
     </wam-toolbar>`)
  .add('button', () => {
    const button = document.createElement('button');
    button.type = 'button';
    button.innerText = 'Hello Button';
    button.addEventListener('click', e => console.log(e));
    return button;
  });