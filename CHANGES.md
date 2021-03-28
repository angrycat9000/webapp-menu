# Changes

## 3.0.0

- Added IconFactory
  - Added `IconFactory.imageSrc` and `IconFactory.materialIcon` as icon factory methods
  - Changed `Menu.defaultFactory` to `IconFactory.defaultFactory`
  - Changed default icon factory from `null` to  `IconFactory.image`

- Default to static toolbars and nested menus.
  - Added `static` attribute to treate menus as static elements intead of pop ups.
  - Removed `open` attribute. Use `open()` or `close()` in JavaScript to control popup menus.
  - Made `isOpen` property read only.

- Remove `CloseTriggerFlags` / `closeOn`.  Callers should listen to the `wam-menu-close` event and call event.prevent default to block closing on certian causes.

- Item labels
  - Remove `Item.setLabel`.  Use `Item.label` instead.
  - Change default `label` to undefined if neither the atribute or slot has been provided
  - Change `showToolbarLabel` to `showLabel` property and `show-label` attribute

- Hyphenated attribute names
  - `controlled-by`
  - `show-label`

- Changed CSS variable prefix from `--menu-` to `--wam-`

### Internal
- Renamed `Direction` enum to `Orientation` to align with `aria-orientation`


## 2.2.4 
- Work around for [#9 ?!Missing Label!? ](https://github.com/angrycat9000/webapp-menu/issues/9)

## 2.2.3
- Prevent hidden menus from blocking pointer events.
