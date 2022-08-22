export default {
  title: 'Components/wam-menubar',
  component: 'wam-menubar'
}

export const basic = () => `<wam-menubar>
  <wam-menu name="File">
    <wam-item>Open</wam-item>
    <wam-item>New</wam-item>
    <wam-item>Save</wam-item>
    <wam-item>Close</wam-item>
  </wam-menu>
  <wam-menu name="Edit">
    <wam-item>Cut</wam-item>
    <wam-item>Copy</wam-item>
    <wam-item>Delete</wam-item>
  </wam-menu>
</wam-menu-bar>`



export const multipleLevels = () => `<wam-menubar>
  <wam-menu name="File">
    <wam-item>Open</wam-item>
    <wam-menu name="New">
      <wam-item>From Template</wam-item>
      <wam-item>Blank</wam-item>
    </wam-menu>
    <wam-item>Save</wam-item>
    <wam-item>Close</wam-item>
  </wam-menu>
  <wam-menu name="Edit">
    <wam-item>Cut</wam-item>
    <wam-menu name="Copy">
      <wam-item>As Text</wam-item>
      <wam-item>As HTML</wam-item>
      <wam-menu name="As Image">
        <wam-item>PNG</wam-item>
        <wam-item>JPG</wam-item>
        <wam-item>GIF</wam-item>
        <wam-item>WEBP</wam-item>
      </wam-menu>
    </wam-menu>
    <wam-item>Delete</wam-item>
  </wam-menu>
</wam-menu-bar>`

export const vertical =  ()=> `<wam-menubar orientation="vertical">
<wam-menu name="File">
  <wam-item>Open</wam-item>
  <wam-item>New</wam-item>
  <wam-item>Save</wam-item>
  <wam-item>Close</wam-item>
</wam-menu>
<wam-menu name="Edit">
  <wam-item>Cut</wam-item>
  <wam-item>Copy</wam-item>
  <wam-item>Delete</wam-item>
</wam-menu>
</wam-menu-bar>`
