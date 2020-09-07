## 3.0.0

- Added IconFactory
  - Added `IconFactory.image` and `IconFactory.materialIcon` as icon factory methods
  - Changed `Menu.defaultFactory` to `IconFactory.defaultFactory`
  - Changed default icon factory from `null` to  `IconFactory.image`

- Default to  static elements instead of popups
  - Added `popup` attribute.  Use this to enable popup behavior on a menu
  - Removed `open` attribute. Use `open()` or `close()` in JavaScript to control popup menus.
  - Made `isOpen` property read only.

- Remove `CloseTriggerFlags` / `closeOn`.  Callers should listen to the `wam-menu-close` event and call event.prevent default to block closing on certian causes.

- Changed CSS variable prefix from `--menu-` to `--wam-`

### Internal
- Renamed `Direction` enum to `Orientation` to align with `aria-orientation`
* 