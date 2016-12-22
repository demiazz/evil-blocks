import $ from 'jquery';

import { block, vitalize } from '../../src';

import { fixture, clear } from '../fixture';


describe('filters', () => {
  describe('block events', () => {
    const blockName = 'blockEvents';
    const blockSelector = `@@${blockName}`;

    afterEach(clear);

    it('adds support for `on <event>` pattern`', () => {
      fixture(`
        <div data-block="${blockName}"></div>
      `);

      const eventSpy = jasmine.createSpy('event');

      block(blockSelector, {
        'on click': eventSpy,
        'on custom-event': eventSpy,
      });

      expect(eventSpy).not.toHaveBeenCalled();

      $(blockSelector).trigger('click');

      expect(eventSpy).toHaveBeenCalledTimes(1);

      $(blockSelector).trigger('custom-event');

      expect(eventSpy).toHaveBeenCalledTimes(2);
    });

    it('adds support for `on <event>[ <event> ...]` pattern`', () => {
      fixture(`
        <div data-block="${blockName}"></div>
      `);

      const eventSpy = jasmine.createSpy('event');

      block(blockSelector, {
        'on click custom-event': eventSpy,
      });

      expect(eventSpy).not.toHaveBeenCalled();

      $(blockSelector).trigger('click');

      expect(eventSpy).toHaveBeenCalledTimes(1);

      $(blockSelector).trigger('custom-event');

      expect(eventSpy).toHaveBeenCalledTimes(2);
    });

    it("calls handler only when a block is event's target", () => {
      const childrenRole = 'children';

      fixture(`
        <div data-block="${blockName}">
          <div data-role="${childrenRole}"></div>
        </div>
      `);

      const eventSpy = jasmine.createSpy('event');

      block(`${blockName}`, {
        'on click': eventSpy,
      });

      vitalize();

      $(`@${childrenRole}`).trigger('click');

      expect(eventSpy).not.toHaveBeenCalled();
    });

    it('calls handler on a component instance', () => {
      fixture(`
        <div data-block="${blockName}"></div>
      `);

      const eventSpy = jasmine.createSpy('event');

      let component;

      block(blockSelector, {
        init() {
          component = this;
        },

        'on click': eventSpy,
      });

      expect(eventSpy).not.toHaveBeenCalled();
      expect(component).toBeTruthy();

      $(blockSelector).trigger('click');

      expect(eventSpy).toHaveBeenCalledTimes(1);
      expect(eventSpy.calls.all()[0].object).toBe(component);
    });

    it('passes an event to a handler', () => {
      fixture(`
        <div data-block="${blockName}"></div>
      `);

      const eventSpy = jasmine.createSpy();

      block(blockSelector, {
        'on click': eventSpy,
      });

      expect(eventSpy).not.toHaveBeenCalled();

      $(blockSelector).trigger('click');

      expect(eventSpy).toHaveBeenCalledTimes(1);
      expect(eventSpy.calls.argsFor(0)[0] instanceof $.Event).toBe(true);
    });

    it('passes an event data to a handler', () => {
      fixture(`<div data-block="${blockName}"></div>`);

      const singleArg = { single: 'argument' };
      const multipleArgs = [{ multiple: 'arguments' }, 2];

      const eventSpy = jasmine.createSpy('event');

      block(blockSelector, {
        'on single': eventSpy,
        'on multiple': eventSpy,
      });

      expect(eventSpy).not.toHaveBeenCalled();

      $(blockSelector).trigger('single', singleArg);

      expect(eventSpy).toHaveBeenCalledTimes(1);
      expect(eventSpy.calls.argsFor(0).slice(1)).toEqual([singleArg]);

      $(blockSelector).trigger('multiple', multipleArgs);

      expect(eventSpy).toHaveBeenCalledTimes(2);
      expect(eventSpy.calls.argsFor(1).slice(1)).toEqual(multipleArgs);
    });
  });
});
