export default {
  title: 'Components/wam-checkbox-item',
  component: 'wam-checkbox-item'
}


export const disabled = ()=> 
`<wam-menu open>
  <wam-checkbox-item>Check me</wam-checkbox-item>
  <wam-checkbox-item disabled>Can't check me</wam-checkbox-item>
</wam-menu>`

export const customIcons = ()=> 
`<wam-menu open>
  <wam-checkbox-item>
    <span class="material-symbols-outlined" slot="icon-on">done</span>
    <span slot="icon-off"></span>
    Task
  </wam-checkbox-item>
  <wam-checkbox-item>
    <span class="material-symbols-outlined" slot="icon-on" >thumb_up</span>
    <span class="material-symbols-outlined" slot="icon-off">thumb_down</span>
    Was it good?
  </wam-checkbox-item>
</wam-menu>`