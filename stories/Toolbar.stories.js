import Menu from '../dist/webapp-menu';

export default {
   title: 'Components/wam-toolbar',
   component: 'wam-toolbar'
}

export const htmlInit = () => 
    `<wam-toolbar static>
        <wam-item label="Reply"><i class="material-icons" slot="icon">reply</i></wam-item>
        <wam-item label="Reply All"><i class="material-icons" slot="icon">reply_all</i></wam-item>
        <wam-item label="Forward"><i class="material-icons" slot="icon">forward</i></wam-item>
     </wam-toolbar>`;
htmlInit.storyName = 'HTML';


export const jsInit = (args) => {
   const toolbar = document.createElement(Menu.Toolbar.tagName);
   toolbar.isStatic = true;
   toolbar.items.set(args.items);
   return toolbar;
}
jsInit.storyName = "Javascript"
jsInit.args = {
   items: [
      {label: 'Reply', icon:'reply'},
      {label: 'Reply All', icon:'reply_all'},
      {label: 'Forward', icon:'forward'}
   ]
}

export const LabelOne = () =>
   `<wam-toolbar static>
        <wam-item label="Reply" show-label><i class="material-icons" slot="icon">reply</i></wam-item>
        <wam-item label="Reply All"><i class="material-icons" slot="icon">reply_all</i></wam-item>
        <wam-item label="Forward"><i class="material-icons" slot="icon">forward</i></wam-item>
     </wam-toolbar>`;
LabelOne.storyName = 'Show One Label';

export const LabelAll = () =>
   `<wam-toolbar show-label static>
        <wam-item label="Reply"><i class="material-icons" slot="icon">reply</i></wam-item>
        <wam-item label="Reply All"><i class="material-icons" slot="icon">reply_all</i></wam-item>
        <wam-item label="Forward"><i class="material-icons" slot="icon">forward</i></wam-item>
     </wam-toolbar>`;
LabelAll.storyName = 'Show All Labels';

export const CheckboxItemWithLabel = () => 
   `<wam-toolbar static>
         <wam-check-item label="Bold"></wam-check-item>
         <wam-check-item label="Italics"></wam-check-item>
         <wam-check-item label="Underline"></wam-check-item>
   </wam-toolbar>`;

export const CheckboxItemWithIcon = () => 
   `<wam-toolbar static>
      <wam-check-item label="Bold" icon="format_bold"></wam-check-item>
      <wam-check-item label="Italics" icon="format_italic"></wam-check-item>
      <wam-check-item label="Underline" icon="format_underline"></wam-check-item>
   </wam-toolbar>`;
