export default {
  title: 'Item'
}


export const item = (args) => {
  return `
    <wam-popup static>
      <wam-item label="${args.label}"></wam-item>
    </wam-popup>
    
    <wam-toolbar>
      <wam-item label="${args.label}"></wam-item>
    </wam-toolbar>`
}
item.args = {
  label: 'Item One'
}