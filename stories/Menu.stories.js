export default {
  title: "Components/wam-menu",
  component: "wam-menubar",
};

export const basic = () => `<wam-menu name="File" open>
    <wam-item>Open</wam-item>
    <wam-item>New</wam-item>
    <wam-item>Save</wam-item>
    <wam-item>Close</wam-item>
  </wam-menu>`;

export const multipleLevels = () => `<wam-menu name="Edit" open>
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
  <wam-item>Paste</wam-item>
  <wam-item>Save</wam-item>
  <wam-item>Close</wam-item>
</wam-menu>`;

export const horizontal = () => `<wam-menu name="Edit" open orientation="horizontal">
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
<wam-item>Paste</wam-item>
<wam-item>Save</wam-item>
<wam-item>Close</wam-item>
</wam-menu>`