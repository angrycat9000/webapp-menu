export default {
  title: "Components/wam-separator",
  component: "wam-separator",
};


export const inMenu = () => `<wam-menu name="File" open>
    <wam-item>Open</wam-item>
    <wam-item>New</wam-item>
    <wam-item>Save</wam-item>
    <wam-item>Close</wam-item>
    <wam-separator></wam-separator>
    <wam-item>Exit</wam-item>
  </wam-menu>`;

  export const inMenubar = () => `<wam-menubar>
  <wam-menu name="File">
    <wam-item>Open</wam-item>
    <wam-item>Save</wam-item>
    <wam-item>Close</wam-item>
  </wam-menu>
  <wam-menu name="Edit">
    <wam-item>Cut</wam-item>
    <wam-item name="Copy"></wam-item>
    <wam-item>Paste</wam-item>
  </wam-menu>
  <wam-separator></wam-separator>
  <wam-menu name="Help">
    <wam-item>Support</wam-item>
    <wam-item>About</wam-item>
  </wam-menu>
</wam-menu-bar>`