import { document, console } from 'global';
import { storiesOf } from '@storybook/html';
import Menu from '../dist/webapp-menu';
import materialIcon from './materialIcon';

storiesOf('Component Specific|Toolbar', module)
  .add('HTML Initalization', () => 
    `<wam-toolbar open closeon="none">
        <wam-item label="Reply"><i class="material-icons" slot="icon">reply</i></wam-item>
        <wam-item label="Reply All"><i class="material-icons" slot="icon">reply_all</i></wam-item>
        <wam-item label="Forward"><i class="material-icons" slot="icon">forward</i></wam-item>
     </wam-toolbar>`)
  .add('Label in Toolbar', ()=>{
   return `<wam-toolbar open closeon="none" useanimation="false">
        <wam-item label="Reply" showtoolbarlabel><i class="material-icons" slot="icon">reply</i></wam-item>
        <wam-item label="Reply All"><i class="material-icons" slot="icon">reply_all</i></wam-item>
        <wam-item label="Forward"><i class="material-icons" slot="icon">forward</i></wam-item>
     </wam-toolbar>`;
  })
  .add('Checkbox in Toolbar', ()=>{
      return `<wam-toolbar open closeon="none" useanimation="false">
         <wam-check-item label="Show"></wam-check-item>
         <wam-item label="Run"></wam-item>
      </wam-toolbar>`
  })