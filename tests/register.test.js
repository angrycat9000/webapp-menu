import { fixture, expect } from '@open-wc/testing';

import {CheckboxItemElement, ItemElement, MenuElement, MenubarElement} from '../dist/webapp-menu';

describe('Register Custom Elements', () => {  
  for(let classElement of  [MenuElement, MenubarElement, ItemElement, CheckboxItemElement]) {
      it(`Register <${classElement.tagName}>`, async () => {
        const el = (await fixture(`<${classElement.tagName}></${classElement.tagName}>`));
        expect(el).to.be.an.instanceof(classElement);
      });
  }
});