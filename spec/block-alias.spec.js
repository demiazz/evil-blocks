import $ from 'jquery';

import { block } from '../src';

import { fixture, clear } from './fixture';


describe('block alias', () => {
  afterEach(clear);

  it('adds `this.block` alias for `$(node)`', () => {
    const blockName = 'blockAlias';

    fixture(`
      <div data-block="${blockName}"></div>
    `);

    let blockElement;

    block(`@@${blockName}`, {
      init() {
        blockElement = this.block;
      },
    });

    expect(blockElement.length).toEqual(1);
    expect(blockElement[0]).toEqual($(`@@${blockName}`)[0]);
  });
});
