import $ from 'jquery';

import { block, vitalize } from '../src';

import { fixture, clear } from './fixture';


describe('block alias', () => {
  afterEach(clear);

  it('adds `this.block` alias for `$(node)`', (done) => {
    const elementClass = 'block-alias';

    fixture(`<div class="${elementClass}"></div>`);

    block('.block-alias', {
      init() {
        expect(this.block.length).toEqual(1);
        expect(this.block[0]).toEqual($(`.${elementClass}`)[0]);

        done();
      },
    });

    vitalize();
  });
});
