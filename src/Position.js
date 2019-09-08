function getWindowBounds() {

    return {
        left: window.scrollX,
        right: window.innerWidth + window.scrollX,
        top:window.scrollY,
        bottom: window.innerHeight + window.scrollY,
        width: window.innerWidth,
        height: window.innerHeight,
    }
}


export function positionForButton(menu, button, padding = 8) {
    const container = getWindowBounds();
    const buttonRect = button.getBoundingClientRect();
    const offset = buttonRect.height / 2 + padding;
    const y = buttonRect.top + buttonRect.height / 2;
    const x = buttonRect.left;
    const menuRect = menu.getBoundingClientRect();

    return positionPopup(menuRect, container, x, y , offset);
}


function positionPopup(menu, containerRect, x, y, verticalPadding=16) {
    const yAbove = y - verticalPadding;
    const yBelow = y + verticalPadding;  

    const bounds = {
        min: {x:containerRect.left, y:containerRect.top},
        max: {x:containerRect.right, y:containerRect.bottom}
    };
    
    let margin = 8;
    bounds.min.x += margin;
    bounds.min.y += margin;
    bounds.max.x -= margin;
    bounds.max.y -= margin;
    
    let point = {x:x};
    
    if(point.x < bounds.min.x)
      point.x = bounds.min.x;
    if (point.x > bounds.max.x - menu.width)
      point.x = bounds.max.x - menu.width;
    
    let d2 = bounds.max.y - (yBelow + menu.height);
    let d1 = yAbove - (bounds.min.y + menu.height);
    
    if(d2 >= 0)
      point.y = yBelow;
    else if (d1 >= 0)
      point.y = yAbove - menu.height;
    else if( d1 > d2) 
      point.y = bounds.min.y;
    else
      point.y = bounds.max.y - menu.height;
  
    return {top: Math.round(point.y), left:Math.round(point.x), name:'popup'};
  }

function computeResponsivePosition(menu, container, left, top, verticalMargin, size, portrait, landscape) {
    const box = container.getBoundingClientRect();
    if(box.width > box.height && box.height < size) 
        return landscape;
    if(box.width <= box.height && box.width < size)
        return portrait;

    return positionPopup(menu, container, left, top, verticalMargin);
}

/**
 * @typedef ComputedPosition
 * @property {string} [name] used to generate a CSS class in the form of menu-position__name
 * @property {number|string} [left]
 * @property {number|string} [top]
 * @property {number|string} [right]
 * @property {number|string} [bottom]
 */


/**
 * Provides ability to defer computation of position until after the elementn has been added
 * to the DOM.  This allows accessing the size of the element;
 */
class Position {
    /**
     * @param {function|ComputedPosition} data An object with the position data or a function that will
     *                                         a ComputedPosition object.
     */
    constructor(data) {
        this.data = data;
    }

    static cssClassName(name) {
        return  name ? `menu-position__${name}` : '';
    }

    /**
     * 
     */
    equal(other, menu, container) {
        const myData = this.evaluate(menu, container);
        const otherData = other.evaluate(menu, container);
        return myData == otherData;
    }

    /**
     * @return {ComputedPosition}
     */
    evaluate(menu, container) {
       const data = 'function' === typeof this.data ? this.data(menu,container) : this.data;
        // Sometimes a function will want to return one of the instance values on Position
        // In that case, it needs to run again to get the computed position value.
        if(data instanceof Position)
            return data.evaluate(menu, container);
        
        return data;
    }

    /**
     * Apply this position to the menu element.
     * @param {HTMLElement} menu
     * @param {HTMLElement} container
     */
    apply(menu, container) {
        const data = this.evaluate(menu, container);

        const newCssClass = Position.cssClassName(data.name);
        for(let cssClass of menu.classList) {
            if(cssClass.startsWith('menu-position__') && cssClass != newCssClass)
                menu.classList.remove(cssClass);
        }
    
        for(let prop of ['top', 'bottom', 'left', 'right']) {
            let value = data[prop]
            if('undefined' === typeof value )
                value = '';
            else if('number' === typeof value) 
                value = value +'px';
            menu.style[prop] = value;
        }

        if(newCssClass)
            menu.classList.add(newCssClass);
    }
}

/**
 * @instance {Position} Static treat the menu as a static position and does not set the top, left, bottom, or right values on the element
 *                             Allow overriding the positioning by setting an id on the element and using CSS
 */
Position.Static = new Position({name:'static'});

/** 
 * @function Absolute
 * @param {number} left
 * @param {number} top
 * @return {Position}
*/
Position.Absolute = function(left, top) {
    return new Position({name:'absolute', left:left, top:top})
}

/** @instance {Position} DockedBottom keeps the menu locked to the bottom, left, and right sides of the screen*/
Position.DockedBottom = new Position({name:'dockedBottom'});

/** @instance {Position} DockedRight keeps the menu locked to the top, right, and bottom sides of the screen */
Position.DockedRight = new Position({name:'dockedRight'});

/** @instance {Position} DockedLeft keeps the menu locked to the top, left, and bottom sides of the screen */
Position.DockedLeft = new Position({name:'dockedLeft'});

/** 
 * @function DockablePopup shows the menu as a floating popup of if the container meets a minimum size.  Otherwise
 *                                    sets it as docked to the bottom or right
 * @param {number} left
 * @param {number} top
 * @param {number} verticalMargin amount of space between the point and the top or bottom of the menu.
 * @return {Position}
 */
Position.DockablePopup = function(left, top, verticalMargin=16, size=400, portrait=Position.DockedBottom, landscape=Position.DockedRight) {
    const f = (menu, container)=>computeResponsivePosition(menu, container, left, top, verticalMargin, size, portrait, landscape);
    return new Position(f);
}

/** 
 * @function DockablePopup Shows the menu as a floating popup within the container
 * @param {number} left
 * @param {number} top
 * @param {number} verticalMargin amount of space between the point and the top or bottom of the menu.
 * @return {Position}
 */
Position.Popup = function(left, top, verticalMargin = 16) {
    const f = (menu, container)=>positionPopup(menu, container, left, top, verticalMargin);
    return new Position(f);
}


export default Position;