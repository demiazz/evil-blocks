import $ from 'jquery';

import { block, vitalize } from '../src';

import { fixture, clear } from './fixture';


describe('block alias', () => {
  afterEach(clear);

  it('adds `this.block` alias for `$(node)`', (done) => {
    const blockClass = 'block-alias';

    fixture(`<div class="${blockClass}"></div>`);

    block(`.${blockClass}`, {
      init() {
        expect(this.block.length).toEqual(1);
        expect(this.block[0]).toEqual($(`.${blockClass}`)[0]);

        done();
      },
    });

    vitalize();
  });
});
