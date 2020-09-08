import {expect} from '@open-wc/testing';
import Wam from '../dist/webapp-menu';
import {Popup} from '../dist/webapp-menu';
import * as everything from '../dist/webapp-menu';

describe('exports', () => {
  it('exports all members of Wam individually', () => {
    for(const [name, obj] of Object.entries(everything)) {
      if('default' !== name)
        expect(obj, name).to.equal(Wam[name]);
    }
  })

  it('all individual exports are in Wam', () => {
    for(const [name, obj] of Object.entries(Wam)) {
        expect(obj, name).to.equal(everything[name]);
    }
  })

  it('import {Popup}', ()=> {
    expect(Popup).to.not.be.undefined;
    expect(Popup).to.equal(Wam.Popup);
  });
})