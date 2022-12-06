/**
 * @callback iconFactoryFunction
 * @param {string} name
 * @return {HTMLElement}
 */

/**
 * 
 */
export const IconFactory = {
  /**
   * Uses the icon name as an image source
   * @type {iconFactoryFunction}
   */
  imageSrc: function(name) {
    const img = document.createElement('img');
    img.src = name;
    return img;
  },

  /**
   * Creates a Google Material icon.  Caller is responsible for importing to the material
   * icons styles.
   * @type {iconFactoryFunction} 
   */
  materialIcon: function(name) {
    const icon = document.createElement('i');
    icon.className = 'material-icons';
    icon.innerHTML = name;
    return icon;
  }
};

var defaultIconFactory = IconFactory.imgSrc;
Object.defineProperty(IconFactory, 'defaultFactory', {
  get: function() {return defaultIconFactory},
  set: function(value) {defaultIconFactory = value}
});

Object.freeze(IconFactory);

export default IconFactory;