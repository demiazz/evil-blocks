import $ from 'jquery';

import { block } from '../../src';

import { fixture, clear } from '../fixture';


describe('filters', () => {
  describe('load events', () => {
    const blockName = 'loadEvents';

    afterEach(clear);

    it('adds support for `load on window` pattern', (done) => {
      fixture(`
        <div data-block="${blockName}"></div>
      `);

      const eventSpy = jasmine.createSpy('event');

      block(`@@${blockName}`, {
        'load on window': eventSpy,
      });

      expect(eventSpy).not.toHaveBeenCalled();

      setTimeout(() => {
        expect(eventSpy).toHaveBeenCalledTimes(1);

        done();
      }, 10);
    });

    it('calls handler on a component instance', (done) => {
      fixture(`
        <div data-block="${blockName}"></div>
      `);

      const eventSpy = jasmine.createSpy('event');

      let component;

      block(`@@${blockName}`, {
        init() {
          component = this;
        },

        'load on window': eventSpy,
      });

      expect(eventSpy).not.toHaveBeenCalled();
      expect(component).toBeTruthy();

      setTimeout(() => {
        expect(eventSpy).toHaveBeenCalledTimes(1);
        expect(eventSpy.calls.argsFor(0)[0] instanceof $.Event).toBe(true);

        done();
      }, 10);
    });

    it('passes an event to a handler', (done) => {
      fixture(`
        <div data-block="${blockName}"></div>
      `);

      const eventSpy = jasmine.createSpy('event');

      block(`@@${blockName}`, {
        'load on window': eventSpy,
      });

      expect(eventSpy).not.toHaveBeenCalled();

      setTimeout(() => {
        expect(eventSpy).toHaveBeenCalledTimes(1);
        expect(eventSpy.calls.argsFor(0)[0] instanceof $.Event).toBe(true);

        done();
      }, 10);
    });
  });
});
