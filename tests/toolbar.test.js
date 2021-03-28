import { fixture, expect } from '@open-wc/testing';

describe('Toolbar', () => {  
    describe('Labels', ()=> {
        it('Hide by default', async()=>{
            const el = (await fixture(`<wam-toolbar><wam-item label="l"><span slot="icon"></span></wam-item></wam-toolbar`));
            const item = el.firstElementChild;
            expect(item.shadowItem.getAttribute('data-label')).to.equal('false');
        });
        it('Show if show-label', async()=>{
            const el = (await fixture(`<wam-toolbar><wam-item label="l" show-label></wam-item></wam-toolbar`));
            const item = el.firstElementChild;
            expect(item.shadowItem.getAttribute('data-label')).to.equal('true');
        });
        it('Show if no icon', async()=>{
            const el = (await fixture(`<wam-toolbar><wam-item label="l"></wam-item></wam-toolbar`));
            const item = el.firstElementChild;
            expect(item.shadowItem.getAttribute('data-label')).to.equal('true');
        });
        it('Show for wam-check-item', async()=>{
            const el = (await fixture(`<wam-toolbar><wam-check-item label="alarm"></wam-check-item></wam-toolbar`));
            const item = el.firstElementChild;
            expect(item.shadowItem.getAttribute('data-label')).to.equal('true');
        });
        it('Show if toolbar sets show-label', async() => {
            const el = await fixture(`<wam-toolbar show-label><wam-item label="alarm" icon="alarm"></wam-item></wam-toolbar`);
            const item = el.firstElementChild;
            expect(item.shadowItem.getAttribute('data-label')).to.equal('true');
        })
    });
});