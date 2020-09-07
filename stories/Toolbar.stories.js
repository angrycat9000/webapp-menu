import Menu from '../dist/webapp-menu';

export default {
   title: 'Toolbar',
   component: 'wam-toolbar'
}

export const htmlInit = () => 
    `<wam-toolbar>
        <wam-item label="Reply"><i class="material-icons" slot="icon">reply</i></wam-item>
        <wam-item label="Reply All"><i class="material-icons" slot="icon">reply_all</i></wam-item>
        <wam-item label="Forward"><i class="material-icons" slot="icon">forward</i></wam-item>
     </wam-toolbar>`;
htmlInit.storyName = 'HTML';


export const jsInit = (args) => {
   const toolbar = document.createElement(Menu.Toolbar.tagName);
   toolbar.items.set(args.items);
   return toolbar;
}
jsInit.storyName = "Javascript"
jsInit.args = {
   items: [
      {label: 'Item One'},
      {label: 'Item Two'}
   ]
}
jsInit.argTypes = {
   items: {control: 'object'}
}

export const LabelOne = () =>
   `<wam-toolbar>
        <wam-item label="Reply" show-label><i class="material-icons" slot="icon">reply</i></wam-item>
        <wam-item label="Reply All"><i class="material-icons" slot="icon">reply_all</i></wam-item>
        <wam-item label="Forward"><i class="material-icons" slot="icon">forward</i></wam-item>
     </wam-toolbar>`;
LabelOne.storyName = 'Show One Label';

export const LabelAll = () =>
   `<wam-toolbar show-label>
        <wam-item label="Reply"><i class="material-icons" slot="icon">reply</i></wam-item>
        <wam-item label="Reply All"><i class="material-icons" slot="icon">reply_all</i></wam-item>
        <wam-item label="Forward"><i class="material-icons" slot="icon">forward</i></wam-item>
     </wam-toolbar>`;
LabelAll.storyName = 'Show All Labels';

export const CheckboxInToolbar = () => 
   `<wam-toolbar>
         <wam-check-item label="Show"></wam-check-item>
         <wam-item label="Run"></wam-item>
   </wam-toolbar>`;
CheckboxInToolbar.storyName = 'Checkbox'