import $ from 'jquery';

import { block, vitalize } from '../../src';

import { fixture, clear } from '../fixture';


describe('filters', () => {
  describe('load events', () => {
    afterEach(clear);

    it('adds support for `load on window` pattern', (done) => {
      const blockClass = 'load-events';

      fixture(`
        <div class="${blockClass}"></div>
      `);

      const eventSpy = jasmine.createSpy('event');

      block(`.${blockClass}`, {
        'load on window': eventSpy,
      });

      vitalize();

      expect(eventSpy).not.toHaveBeenCalled();

      setTimeout(() => {
        expect(eventSpy).toHaveBeenCalledTimes(1);

        done();
      }, 10);
    });

    it('calls handler on a component instance', (done) => {
      const blockClass = 'load-events';

      fixture(`
        <div class="${blockClass}"></div>
      `);

      const eventSpy = jasmine.createSpy('event');

      let component;

      block(`.${blockClass}`, {
        init() {
          component = this;
        },

        'load on window': eventSpy,
      });

      vitalize();

      expect(eventSpy).not.toHaveBeenCalled();
      expect(component).toBeTruthy();

      setTimeout(() => {
        expect(eventSpy).toHaveBeenCalledTimes(1);
        expect(eventSpy.calls.argsFor(0)[0] instanceof $.Event).toBe(true);

        done();
      }, 10);
    });

    it('passes an event to a handler', (done) => {
      const blockClass = 'load-events';

      fixture(`
        <div class="${blockClass}"></div>
      `);

      const eventSpy = jasmine.createSpy('event');

      block(`.${blockClass}`, {
        'load on window': eventSpy,
      });

      vitalize();

      expect(eventSpy).not.toHaveBeenCalled();

      setTimeout(() => {
        expect(eventSpy).toHaveBeenCalledTimes(1);
        expect(eventSpy.calls.argsFor(0)[0] instanceof $.Event).toBe(true);

        done();
      }, 10);
    });
  });
});
