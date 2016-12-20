import $ from 'jquery';

import { block, vitalize } from '../../src';

import { fixture, clear } from '../fixture';


describe('filters', () => {
  describe('find', () => {
    afterEach(clear);

    it('adds `this.$(<selector>)` alias for `this.block.find(<selector>)`', (done) => {
      const blockClass = 'find-filter';
      const elementClass = 'element';
      const childrenClass = 'children';

      fixture(`
        <div class="${elementClass}">
        <div class="${blockClass}">
          <div class="${childrenClass} ${elementClass}" />
          <div>
            <div class="${childrenClass} ${elementClass}" />
          </div>
        </div>
      `);

      block(`.${blockClass}`, {
        init() {
          const actual = this.$(`.${elementClass}`);

          expect(actual.length).toEqual(2);
          expect(actual.toArray()).toEqual($(`.${childrenClass}`).toArray());

          done();
        },
      });

      vitalize();
    });
  });
});
