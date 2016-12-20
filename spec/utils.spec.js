import { transformSelector } from '../src/utils';


describe('utils', () => {
  describe('transform-selector', () => {
    it('transforms `@pattern` to `[data-role~="pattern"]`', () => {
      const examples = [
        ['@component', '[data-role~="component"]'],
        ['@awesomeComponent', '[data-role~="awesomeComponent"]'],
        ['@awesome-component', '[data-role~="awesome-component"]'],
        ['@awesome@component', '[data-role~="awesome"][data-role~="component"]'],
        ['@awesome, @component', '[data-role~="awesome"], [data-role~="component"]'],
        ['.awesome@component', '.awesome[data-role~="component"]'],
        ['@component.awesome', '[data-role~="component"].awesome'],
      ];

      examples.forEach(([source, expected]) => {
        expect(transformSelector(source)).toEqual(expected);
      });
    });

    it('transforms `@@pattern` to `[data-block~="pattern"]`', () => {
      const examples = [
        ['@@component', '[data-block~="component"]'],
        ['@@awesomeComponent', '[data-block~="awesomeComponent"]'],
        ['@@awesome-component', '[data-block~="awesome-component"]'],
        ['@@awesome@@component', '[data-block~="awesome"][data-block~="component"]'],
        ['@@awesome, @@component', '[data-block~="awesome"], [data-block~="component"]'],
        ['.awesome@@component', '.awesome[data-block~="component"]'],
        ['@@component.awesome', '[data-block~="component"].awesome'],
      ];

      examples.forEach(([source, expected]) => {
        expect(transformSelector(source)).toEqual(expected);
      });
    });

    it('transform mixed `@` and `@@`', () => {
      const examples = [
        ['@@parent@child', '[data-block~="parent"][data-role~="child"]'],
        ['@child@@parent', '[data-role~="child"][data-block~="parent"]'],
        ['@@parent, @child', '[data-block~="parent"], [data-role~="child"]'],
        ['@@parent @child', '[data-block~="parent"] [data-role~="child"]'],
        ['.awesome@@parent@child', '.awesome[data-block~="parent"][data-role~="child"]'],
      ];

      examples.forEach(([source, expected]) => {
        expect(transformSelector(source)).toEqual(expected);
      });
    });
  });
});
