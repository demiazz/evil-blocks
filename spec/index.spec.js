import { block, vitalize } from '../src';


describe('exports', () => {
  it('exports `block` function', () => {
    expect(block instanceof Function).toBe(true);
  });

  it('exports `vitalize` function', () => {
    expect(vitalize instanceof Function).toBe(true);
  });
});
