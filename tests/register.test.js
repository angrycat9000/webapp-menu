import { fixture, expect } from '@open-wc/testing';

import {ItemElement, MenuElement, MenubarElement} from '../dist/webapp-menu';

describe('Register Custom Elements', () => {  
  for(let classElement of  [MenuElement, MenubarElement, ItemElement]) {
      it(`Register <${classElement.tagName}>`, async () => {
        const el = (await fixture(`<${classElement.tagName}></${classElement.tagName}>`));
        expect(el).to.be.an.instanceof(classElement);
      });
  }
});