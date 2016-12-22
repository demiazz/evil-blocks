import $ from 'jquery';

import { block } from '../../src';

import { fixture, clear } from '../fixture';


describe('filters', () => {
  describe('find alias', () => {
    afterEach(clear);

    it('adds `this.$(<selector>)` alias for `this.block.find(<selector>)`', () => {
      const blockName = 'findAlias';
      const elementClass = 'element';
      const childrenRole = 'children';

      fixture(`
        <div class="${elementClass}">
        <div data-block="${blockName}">
          <div class="${elementClass}" data-role="${childrenRole}"/>
          <div>
            <div class="${elementClass}" data-role="${childrenRole}"/>
          </div>
        </div>
      `);

      let childrenElements;

      block(`@@${blockName}`, {
        init() {
          childrenElements = this.$(`.${elementClass}`);
        },
      });

      expect(childrenElements.length).toEqual(2);
      expect(childrenElements.toArray()).toEqual(
        $(`@${childrenRole}`).toArray()
      );
    });
  });
});
