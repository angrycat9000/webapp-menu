import {expect} from '@open-wc/testing';

import Wam from '../dist/webapp-menu';

describe('IconFactory', () => {
  it('can set defaultFactory', () => {
      const iconFactory = function () { return document.createElement('span')}
      Wam.IconFactory.defaultFactory = iconFactory;
      expect(Wam.IconFactory.defaultFactory).to.equal(iconFactory);
  })

  it('defaults to null', () => {
      const el = document.createElement(Wam.Popup.tagName);
      Wam.IconFactory.defaultFactory = null;
      expect(el._iconFactory).to.be.null;
      expect(el.iconFactory).to.be.null;
  })

  it('use defaultFactory', async () => {
      const iconFactory = function () { return document.createElement('span')}
      const el = document.createElement(Wam.Popup.tagName);
      Wam.IconFactory.defaultFactory = iconFactory;
      expect(el.iconFactory).to.equal(iconFactory);
  })

  it('can override IconFactory.defaultFactory', async () => {
      const iconFactory = function () { return document.createElement('span')}
      const el = document.createElement(Wam.Popup.tagName);
      Wam.IconFactory.defaultFactory = null;
      el.iconFactory = iconFactory;
      expect(el.iconFactory).to.equal(iconFactory);
  })

  it('Image factory', () => {
    const icon = Wam.IconFactory.imageSrc('helloworld.png');
    expect(icon).dom.to.equal('<img src="helloworld.png">');
  })

  it('Material Icon factory', ()=> {
    const icon = Wam.IconFactory.materialIcon('add');
    expect(icon).dom.to.equal('<i class="material-icons">add</i>');
  })
})