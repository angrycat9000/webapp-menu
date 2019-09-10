/**
 * @return {DOMRect}
 */
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

function positionAtPoint(menu, x, y, verticalMargin=16) {
    return positionPopup(menu, getWindowBounds(), x, y, verticalMargin, 'center');
}


function positionForButton(menu, button, padding = 8) {
    const container = getWindowBounds();
    const buttonRect = button.getBoundingClientRect();
    const offset = buttonRect.height / 2 + padding;
    const y = buttonRect.top + buttonRect.height / 2;
    const x = buttonRect.left;
    const menuRect = menu.getBoundingClientRect();

    return positionPopup(menuRect, container, x, y , offset, 'left');
}

/**
 * @return {PositionValue}
 */
function positionPopup(menuRect, containerRect, x, y, verticalPadding, align='left') {
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
    
    let point = {
        x: ('center' == align) ? x - menuRect.width / 2 : x
    };

    
    if(point.x < bounds.min.x)
      point.x = bounds.min.x;
    if (point.x > bounds.max.x - menuRect.width)
      point.x = bounds.max.x - menuRect.width;
    
    let d2 = bounds.max.y - (yBelow + menuRect.height);
    let d1 = yAbove - (bounds.min.y + menuRect.height);
    
    if(d2 >= 0)
      point.y = yBelow;
    else if (d1 >= 0)
      point.y = yAbove - menuRect.height;
    else if( d1 > d2) 
      point.y = bounds.min.y;
    else
      point.y = bounds.max.y - menuRect.height;
  
    return {top: Math.round(point.y), left:Math.round(point.x), position:'absolute'};
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
 * @typedef PositionValue
 * @property {string} [name]
 * @property {number|string} [left]
 * @property {number|string} [top]
 * @property {number|string} [right]
 * @property {number|string} [bottom]
 */

 /**
  * Compute a position for a the provided element.
  * @typedef PositionFunction
  * @param {HTMLElement} element
  * @return {PositionValue}
  */


/**
 * Provides ability to defer computation of position until after the element has been added
 * to the DOM.  This allows accessing the size of the element;
 */
class Position {
    /**
     * @param {PositionValue|PositionFunction} data 
     */
    constructor(data) {
        this.data = data;
    }

    /**
     *
     */
    equal(other) {
        if( this.data == other.data)
            return true;
        return false;
    }

    /**
     * @return {ComputedPosition}
     */
    evaluate(menu) {
       return ('function' === typeof this.data) ? this.data(menu) : this.data;
    }

    /**
     * Apply this position to the menu element.
     * @param {HTMLElement} menu
     */
    apply(menu) {
        const data = this.evaluate(menu);

        /*const newCssClass = Position.cssClassName(data.name);
        for(let cssClass of menu.classList) {
            if(cssClass.startsWith('menu-position__') && cssClass != newCssClass)
                menu.classList.remove(cssClass);
        }*/
    
        for(let prop of ['top', 'bottom', 'left', 'right']) {
            let value = data[prop]
            if('undefined' === typeof value )
                value = '';
            else if('number' === typeof value) 
                value = value +'px';
            menu.style[prop] = value;
        }

        menu.style.position = ('undefined' === typeof this.position) ? '' : this.position;


        /*if(newCssClass)
            menu.classList.add(newCssClass);
            */
    }

    static from(object) {
        if(object instanceof Position)
            return object;
        return new Position(object);
    }

    /** 
     * Shows the menu left aligned to the given button above or below it.
     * @param {HTMLElement} button
     * @return {Position}
     */
    static WithElement(button) {
        return new Position((menu)=>positionForButton(menu, button))
    }

    /** 
     * @param {number} left
     * @param {number} top
     * @return {PositionValue}
    */
    static Absolute(left, top) {
        return new Position({name:'absolute', position:'absolute', left:left, top:top});
    }
    
    /** 
     * Shows the menu centered above or below the point given by top and left
     * @param {number} left
     * @param {number} top
     * @return {Position}
     */
    static AtPoint(left, top, verticalMargin = 16) {
        return newPosition((menu)=>positionAtPoint(menu, left, top, verticalMargin))
    }
    
}

/** @instance {Position} None Does not set any inline style values on the element */
Position.None = new Position({name:'none'});

/** @instance {PositionValue} DockedBottom keeps the menu locked to the bottom, left, and right sides of the screen*/
Position.DockedBottom =  new Position({bottom:0, left:0, right:0,position:'fixed', name:'dockedBottom'});

/** @instance {PositionValue} DockedRight keeps the menu locked to the top, right, and bottom sides of the screen */
Position.DockedRight = new Position({bottom:0, top:0, right:0,position:'fixed', name:'dockedRight'})

/** @instance {PositionValue} DockedLeft keeps the menu locked to the top, left, and bottom sides of the screen */
Position.DockedLeft =  new Position({bottom:0, top:0, left:0,position:'fixed', name:'dockedLeft'})

/** @instance {PositionValue} DockedLeft keeps the menu locked to the top, left, and bottom sides of the screen */
Position.DockedTop = new Position({bottom:0, top:0, left:0, position:'fixed', name:'dockedTop'})


export default Position;