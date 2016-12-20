import $ from 'jquery';

import { block, vitalize } from '../src';

import { fixture, clear } from './fixture';


describe('find alias', () => {
  afterEach(clear);

  it('adds `this.$(<selector>)` alias for `this.block.find(<selector>)`', (done) => {
    const parentClass = 'find-alias';
    const elementClass = 'element';
    const childrenClass = 'children';

    fixture(`
      <div class="${elementClass}">
      <div class="${parentClass}">
        <div class="${childrenClass} ${elementClass}" />
        <div>
          <div class="${childrenClass} ${elementClass}" />
        </div>
      </div>
    `);

    block(`.${parentClass}`, {
      init() {
        const actual = this.$(`.${elementClass}`);

        expect(actual.length).toEqual(2);

        actual.each((idx, element) => {
          const childrens = $(`.${childrenClass}`).toArray();

          expect(childrens).toContain(element);
        });

        done();
      },
    });

    vitalize();
  });
});
