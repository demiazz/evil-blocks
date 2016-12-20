import { block, vitalize } from '../../src';

import { fixture, clear } from '../fixture';


describe('filters', () => {
  describe('role aliases', () => {
    afterEach(clear);

    it('adds `.<role>` property for each `[data-role~="<role>"]` element', (done) => {
      const blockClass = 'role-filter';
      const singleRole = 'single';
      const multiRole = 'multi';
      const customRole = 'customRole';
      const yetAnotherRole = 'yet-another-role';

      fixture(`
        <div data-role="${singleRole}"></div>
        <div data-role="${multiRole}"></div>
        <div data-role="${customRole}"></div>
        <div data-role="${yetAnotherRole}"></div>
        <div class="${blockClass}">
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

      block(`.${blockClass}`, {
        init() {
          expect(this[singleRole].length).toEqual(2);
          expect(this[singleRole].toArray())
            .toEqual(this.$(`@${singleRole}`).toArray());

          expect(this[multiRole].length).toEqual(4);
          expect(this[multiRole].toArray())
            .toEqual(this.$(`@${multiRole}`).toArray());

          expect(this[customRole].length).toEqual(2);
          expect(this[customRole].toArray())
            .toEqual(this.$(`@${customRole}`).toArray());

          expect(this[yetAnotherRole].length).toEqual(2);
          expect(this[yetAnotherRole].toArray())
            .toEqual(this.$(`@${yetAnotherRole}`).toArray());

          done();
        },
      });

      vitalize();
    });

    it("doesn't override existing properties", (done) => {
      const blockClass = 'role-filter';
      const roleName = 'exists';

      fixture(`
        <div class="${blockClass}">
          <div data-role="${roleName}" />
        </div>
      `);

      block(`.${blockClass}`, {
        [roleName]: 'string',

        init() {
          expect(this[roleName]).toEqual('string');

          done();
        },
      });

      vitalize();
    });
  });
});
