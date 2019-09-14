import { document, console } from 'global';
import { storiesOf } from '@storybook/html';

storiesOf('Component Specific|NestedMenu', module)
  .add('HTML Initalization', () => 
  `<wam-nestedmenu open closeon="none" useanimation="false" >
    <wam-item label="Rock"></wam-item>
    <wam-submenu><span slot="label">Animal</span>
          <wam-item label="Cat"></wam-item>
          <wam-item><span slot="label">Dog</span></wam-item>
          <wam-item label="Reptile"></wam-item>
          <wam-item label="Top Hat Wearing Monkey"></wam-item>
    </wam-submenu>
    
    <wam-submenu label="Plant">
      <wam-item label="Brocolli"></wam-item>
      <wam-item label="Daisy"></wam-item>
      <wam-item label="Maple Tree"></wam-item>
      <wam-item label="Apple Tree"></wam-item>
      <wam-item label="Marigold"></wam-item>
      <wam-item label="Ivy"></wam-item>
      <wam-item label="Morning Glory"></wam-item>
    </wam-submenu>
    </wam-nestedmenu>`)