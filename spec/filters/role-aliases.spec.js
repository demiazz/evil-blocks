import { block } from '../../src';

import { fixture, clear } from '../fixture';


describe('filters', () => {
  describe('role aliases', () => {
    const blockName = 'roleAliases';

    afterEach(clear);

    it('adds `.<role>` property for each `[data-role~="<role>"]` element', () => {
      const singleRole = 'single';
      const multiRole = 'multi';
      const customRole = 'customRole';
      const yetAnotherRole = 'yet-another-role';

      fixture(`
        <div data-role="${singleRole}"></div>
        <div data-role="${multiRole}"></div>
        <div data-role="${customRole}"></div>
        <div data-role="${yetAnotherRole}"></div>
        <div data-block="${blockName}">
          <div data-role="${singleRole}"></div>
          <div data-role="${multiRole} other"></div>
          <div data-role="${multiRole}"></div>
          <div data-role="${customRole}"></div>
          <div data-role="${yetAnotherRole}"></div>
          <div>
            <div data-role="${singleRole}"></div>
            <div data-role="${multiRole} other"></div>
            <div data-role="${multiRole}"></div>
            <div data-role="${customRole}"></div>
            <div data-role="${yetAnotherRole}"></div>
          </div>
        </div>
      `);

      let component;

      block(`@@${blockName}`, {
        init() {
          component = this;
        },
      });

      expect(component[singleRole].length).toEqual(2);
      expect(component[singleRole].toArray())
        .toEqual(component.$(`@${singleRole}`).toArray());

      expect(component[multiRole].length).toEqual(4);
      expect(component[multiRole].toArray())
        .toEqual(component.$(`@${multiRole}`).toArray());

      expect(component[customRole].length).toEqual(2);
      expect(component[customRole].toArray())
        .toEqual(component.$(`@${customRole}`).toArray());

      expect(component[yetAnotherRole].length).toEqual(2);
      expect(component[yetAnotherRole].toArray())
        .toEqual(component.$(`@${yetAnotherRole}`).toArray());
    });

    it("doesn't override existing properties", () => {
      const roleName = 'exists';

      fixture(`
        <div data-block="${blockName}">
          <div data-role="${roleName}" />
        </div>
      `);

      let component;

      block(`@@${blockName}`, {
        [roleName]: 'string',

        init() {
          component = this;
        },
      });

      expect(component[roleName]).toEqual('string');
    });
  });
});
