# webapp-menu

Create accessible menu for performing on page actions in web apps.  Eg. context menu, file menu, edit menu, toolbar.  The library handles adding the appropriate ```aria-``` attributes and the keyboard and focus interaction.  

**Note:** These menus are not intended for navigation between different web pages.

[**Live Example**](https://codepen.io/markdane/pen/YzKQejQ)

## Setup

### Quick Start

Include the Javascript and CSS files in your HTML file.

```html
<script src="webapp-menu.js"></script>
<link rel="stylesheet" href="webapp-menu.css">
```

### NPM

Install the 1.0 version of webapp-menu.  Version 2.0 is planned to have breaking changes to move to the web component model
```
npm install --save webapp-menu@^1.0.0
```

In your Javascript file include:

```javascript
import Menu from 'webapp-menu'
```

In your CSS file:

```css
@import 'webapp-menu\dist\webapp-menu.css';
```

You can customize the style by building the SCSS

```scss
$menu-border:1px solid #808080;
$menu-background:#e0e0e0;
$menu-text:#202020;
$menu-transition-duration: 0.4s;
$menu-border-radius: 0.25rem;

@import 'webapp-menu\style\menu.scss'; 
```

## Usage

### Basic Menu

```javascript
function clicked(e) {
    alert('Clicked ' + e.item.label);
}

const items = [
    {label:'Action 1' action:clicked},
    {label:'Action 2' action:clicked},
    {label:'Action 3' action:clicked}
];

const menu = new WebAppMenu.ListContainer(items);
menu.show();
```

### Basic Toolbar
```javascript
const items = [{label:'Action 1'}, ...];

const toolbar = new WebAppMenu.Toolbar(items);
toolbar.show();
```

### Positioning

Menus are often placed near the location of an input.  To support this Menu has a positioning system which can take into account.  You can use the built in options or pass in your own function or object.


```javascript
// treat as a statically positioned element
menu.position = Position.Static;

/* position at 50,50 without regard to parent
    element bounds */
menu.position = Position.Absolute(50,50);

/* position 24px above or below 50,50 keeping
   the menu within the parent element */
menu.position = Position.Popup(50,50,24); 

/* Same as above but dock the menu to the side or
   bottom of the parent element */
menu.position = Position.ResponsivePopup(50,50,24); 
```

See the in code documentation for more information.

### Icon Factory

If you are using an icon library it is easier to just reference an icon by name instead of creating the Element for each one.

Menus can take an ```iconFactory``` option that will convert a string to an Element.  This allows icons to be referenced by name and have the Menu automatically convert them when they instead of having to manually convert them for every item.

```javascript
function myIconFactory(name) {
    ...
    return element;
}

const items = [
    {label:'Easy Icon By Name', icon:'add'}
    {label:'More Typing', icon:myIconFactory('delete')}
];

const toolbar = new WebAppMenu.Toolbar(items, {iconFactory:myIconFactory});
```