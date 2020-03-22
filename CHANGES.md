# 3.0.0

- Default to  static elements instead of popups
  - Added `popup` attribute.  Use this to enable popup behavior on a menu
  - Removed `open` attribute. Use `open()` or `close()` in JavaScript to control popup menus.
  - Made `isOpen` property read only.

- Changed CSS variable prefix from `--menu-` to `--wam-`

## Internal
- Renamed `Direction` enum to `Orientation` to align with `aria-orientation`
* 