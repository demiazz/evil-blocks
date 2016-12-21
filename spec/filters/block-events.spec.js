import $ from 'jquery';

import { block, vitalize } from '../../src';

import { fixture, clear } from '../fixture';


describe('filters', () => {
  describe('block events', () => {
    afterEach(clear);

    it('adds support for `on <event>` pattern`', () => {
      const blockClass = 'block-events';

      fixture(`
        <div class="${blockClass}"></div>
      `);

      const eventSpy = jasmine.createSpy('event');

      block(`.${blockClass}`, {
        'on click': eventSpy,
        'on custom-event': eventSpy,
      });

      vitalize();

      expect(eventSpy).not.toHaveBeenCalled();

      $(`.${blockClass}`).trigger('click');

      expect(eventSpy).toHaveBeenCalledTimes(1);

      $(`.${blockClass}`).trigger('custom-event');

      expect(eventSpy).toHaveBeenCalledTimes(2);
    });

    it('adds support for `on <event>[ <event> ...]` pattern`', () => {
      const blockClass = 'block-events';

      fixture(`
        <div class="${blockClass}"></div>
      `);

      const eventSpy = jasmine.createSpy('event');

      block(`.${blockClass}`, {
        'on click custom-event': eventSpy,
      });

      vitalize();

      expect(eventSpy).not.toHaveBeenCalled();

      $(`.${blockClass}`).trigger('click');

      expect(eventSpy).toHaveBeenCalledTimes(1);

      $(`.${blockClass}`).trigger('custom-event');

      expect(eventSpy).toHaveBeenCalledTimes(2);
    });

    it("calls handler only when a block is event's target", () => {
      const blockClass = 'block-events';
      const childrenRole = 'children';

      fixture(`
        <div class="${blockClass}">
          <div data-role="${childrenRole}"></div>
        </div>
      `);

      const eventSpy = jasmine.createSpy('event');

      block(`${blockClass}`, {
        'on click': eventSpy,
      });

      vitalize();

      $(`@${childrenRole}`).trigger('click');

      expect(eventSpy).not.toHaveBeenCalled();
    });

    it('calls handler on a component instance', () => {
      const blockClass = 'block-events';

      fixture(`
        <div class="${blockClass}"></div>
      `);

      const eventSpy = jasmine.createSpy('event');

      let component;

      block(`.${blockClass}`, {
        init() {
          component = this;
        },

        'on click': eventSpy,
      });

      vitalize();

      expect(eventSpy).not.toHaveBeenCalled();
      expect(component).toBeTruthy();

      $(`.${blockClass}`).trigger('click');

      expect(eventSpy).toHaveBeenCalledTimes(1);
      expect(eventSpy.calls.all()[0].object).toBe(component);
    });

    it('passes an event to a handler', () => {
      const blockClass = 'block-events';

      fixture(`
        <div class="${blockClass}"></div>
      `);

      const eventSpy = jasmine.createSpy();

      block(`.${blockClass}`, {
        'on click': eventSpy,
      });

      vitalize();

      expect(eventSpy).not.toHaveBeenCalled();

      $(`.${blockClass}`).trigger('click');

      expect(eventSpy).toHaveBeenCalledTimes(1);
      expect(eventSpy.calls.argsFor(0)[0] instanceof $.Event).toBe(true);
    });

    it('passes an event data to a handler', () => {
      const blockClass = 'block-events';

      fixture(`<div class="${blockClass}"></div>`);

      const singleArg = { single: 'argument' };
      const multipleArgs = [{ multiple: 'arguments' }, 2];

      const eventSpy = jasmine.createSpy('event');

      block(`.${blockClass}`, {
        'on single': eventSpy,
        'on multiple': eventSpy,
      });

      vitalize();

      expect(eventSpy).not.toHaveBeenCalled();

      $(`.${blockClass}`).trigger('single', singleArg);

      expect(eventSpy).toHaveBeenCalledTimes(1);
      expect(eventSpy.calls.argsFor(0).slice(1)).toEqual([singleArg]);

      $(`.${blockClass}`).trigger('multiple', multipleArgs);

      expect(eventSpy).toHaveBeenCalledTimes(2);
      expect(eventSpy.calls.argsFor(1).slice(1)).toEqual(multipleArgs);
    });
  });
});
