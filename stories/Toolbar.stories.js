import { document, console } from 'global';
import { storiesOf } from '@storybook/html';
import Menu from '../dist/webapp-menu';

storiesOf('Toolbar', module)
  .add('HTML Initalization', () => 
    `<wam-toolbar open closeon="none">
        <wam-item label="Reply"><i class="material-icons" slot="icon">reply</i></wam-item>
        <wam-item label="Reply All"><i class="material-icons" slot="icon">reply_all</i></wam-item>
        <wam-item label="Forward"><i class="material-icons" slot="icon">forward</i></wam-item>
     </wam-toolbar>`)
  .add('JavaScript Initialization', () => {
    const bar = document.createElement('wam-toolbar');
    bar.iconFactory = (name)=> {
      const i = document.createElement('i');
      i.setAttribute('class', 'material-icons');
      i.innerHTML = name;
      return i;
    };
    bar.items.set([
      {label:'Reply', icon:'reply'},
      {label:'Reply All', icon:'reply_all'},
      {label:'Forward', icon:'forward'}
    ]);
    bar.isOpen = true;
    bar.closeOn.none();
    return bar;
  })
  .add('Label in Toolbar', ()=>{
   return `<wam-toolbar open closeon="none">
        <wam-item label="Reply" showtoolbarlabel><i class="material-icons" slot="icon">reply</i></wam-item>
        <wam-item label="Reply All"><i class="material-icons" slot="icon">reply_all</i></wam-item>
        <wam-item label="Forward"><i class="material-icons" slot="icon">forward</i></wam-item>
     </wam-toolbar>`;
  })