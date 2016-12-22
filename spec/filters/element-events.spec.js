import $ from 'jquery';

import { block } from '../../src';

import { fixture, clear } from '../fixture';


describe('filters', () => {
  describe('element events', () => {
    const blockName = 'elementEvents';
    const childrenRole = 'children';
    const firstChildrenRole = 'firstChildren';
    const secondChildrenRole = 'secondChildren';

    afterEach(clear);

    it('adds support for `<event> on <selector>` pattern', () => {
      fixture(`
        <div data-block="${blockName}">
          <div data-role="${childrenRole}"></div>
        </div>
      `);

      const eventSpy = jasmine.createSpy('event');

      block(`@@${blockName}`, {
        [`click on @${childrenRole}`]: eventSpy,
        [`custom-event on @${childrenRole}`]: eventSpy,
      });

      expect(eventSpy).not.toHaveBeenCalled();

      $(`@@${blockName} @${childrenRole}`).trigger('click');

      expect(eventSpy).toHaveBeenCalledTimes(1);

      $(`@@${blockName} @${childrenRole}`).trigger('custom-event');

      expect(eventSpy).toHaveBeenCalledTimes(2);
    });

    it('adds support for `<event>[ <event> ...] on <selector>` pattern', () => {
      fixture(`
        <div data-block="${blockName}">
          <div data-role="${childrenRole}"></div>
        </div>
      `);

      const eventSpy = jasmine.createSpy('event');

      block(`@@${blockName}`, {
        [`click custom-event on @${childrenRole}`]: eventSpy,
      });

      expect(eventSpy).not.toHaveBeenCalled();

      $(`@@${blockName} @${childrenRole}`).trigger('click');

      expect(eventSpy).toHaveBeenCalledTimes(1);

      $(`@@${blockName} @${childrenRole}`).trigger('custom-event');

      expect(eventSpy).toHaveBeenCalledTimes(2);
    });

    it('adds support for `<event> on <selector>[, <selector> ...]` pattern', () => {
      fixture(`
        <div data-block="${blockName}">
          <div data-role="${firstChildrenRole}"></div>
          <div data-role="${secondChildrenRole}"></div>
        </div>
      `);

      const eventSpy = jasmine.createSpy('event');

      block(`@@${blockName}`, {
        [`click on @${firstChildrenRole}, @${secondChildrenRole}`]: eventSpy,
      });

      expect(eventSpy).not.toHaveBeenCalled();

      $(`@@${blockName} @${firstChildrenRole}`).trigger('click');

      expect(eventSpy).toHaveBeenCalledTimes(1);

      $(`@@${blockName} @${secondChildrenRole}`).trigger('click');

      expect(eventSpy).toHaveBeenCalledTimes(2);
    });

    it('adds support for `<event>[ <event> ...] on <selector>[, <selector> ...]` pattern', () => {
      fixture(`
        <div data-block="${blockName}">
          <div data-role="${firstChildrenRole}"></div>
          <div data-role="${secondChildrenRole}"></div>
        </div>
      `);

      const eventSpy = jasmine.createSpy('event');

      block(`@@${blockName}`, {
        [`click custom-event on @${firstChildrenRole}, @${secondChildrenRole}`]: eventSpy,
      });

      expect(eventSpy).not.toHaveBeenCalled();

      $(`@@${blockName} @${firstChildrenRole}`).trigger('click');

      expect(eventSpy).toHaveBeenCalledTimes(1);

      $(`@@${blockName} @${firstChildrenRole}`).trigger('custom-event');

      expect(eventSpy).toHaveBeenCalledTimes(2);

      $(`@@${blockName} @${secondChildrenRole}`).trigger('click');

      expect(eventSpy).toHaveBeenCalledTimes(3);

      $(`@@${blockName} @${secondChildrenRole}`).trigger('custom-event');

      expect(eventSpy).toHaveBeenCalledTimes(4);
    });

    it('calls handler on a component instance', () => {
      fixture(`
        <div data-block="${blockName}">
          <div data-role="${childrenRole}"></div>
        </div>
      `);

      const eventSpy = jasmine.createSpy('event');

      let component;

      block(`@@${blockName}`, {
        init() {
          component = this;
        },

        [`click on @${childrenRole}`]: eventSpy,
      });

      expect(eventSpy).not.toHaveBeenCalled();
      expect(component).toBeTruthy();

      $(`@@${blockName} @${childrenRole}`).trigger('click');

      expect(eventSpy).toHaveBeenCalledTimes(1);
      expect(eventSpy.calls.all()[0].object).toBe(component);
    });

    it('passes an event to a handler', () => {
      fixture(`
        <div data-block="${blockName}">
          <div data-role="${childrenRole}"></div>
        </div>
      `);

      const eventSpy = jasmine.createSpy('event');

      block(`@@${blockName}`, {
        [`click on @${childrenRole}`]: eventSpy,
      });

      expect(eventSpy).not.toHaveBeenCalled();

      $(`@@${blockName} @${childrenRole}`).trigger('click');

      expect(eventSpy).toHaveBeenCalledTimes(1);
      expect(eventSpy.calls.argsFor(0)[0] instanceof $.Event).toBe(true);
    });

    it('binds element to an event', () => {
      fixture(`
        <div data-block="${blockName}">
          <div data-role="${childrenRole}"></div>
        </div>
      `);

      const eventSpy = jasmine.createSpy('event');

      block(`@@${blockName}`, {
        [`click on @${childrenRole}`]: eventSpy,
      });

      expect(eventSpy).not.toHaveBeenCalled();

      $(`@@${blockName} @${childrenRole}`).trigger('click');

      expect(eventSpy).toHaveBeenCalledTimes(1);

      const elements = eventSpy.calls.argsFor(0)[0].el;

      expect(elements.jquery).toBeTruthy();
      expect(elements.length).toEqual(1);
      expect(elements[0]).toEqual(
        document.querySelector(`[data-block~="${blockName}"] [data-role~="${childrenRole}"]`)
      );
    });

    it('passes an event data to a handler', () => {
      fixture(`
        <div data-block="${blockName}">
          <div data-role="${childrenRole}"></div>
        </div>
      `);

      const singleArg = { single: 'argument' };
      const multipleArgs = [{ multiple: 'arguments' }, 2];

      const eventSpy = jasmine.createSpy('event');

      block(`@@${blockName}`, {
        [`single on @${childrenRole}`]: eventSpy,
        [`multiple on @${childrenRole}`]: eventSpy,
      });

      expect(eventSpy).not.toHaveBeenCalled();

      $(`@@${blockName} @${childrenRole}`).trigger('single', singleArg);

      expect(eventSpy).toHaveBeenCalledTimes(1);
      expect(eventSpy.calls.argsFor(0).slice(1)).toEqual([singleArg]);

      $(`@@${blockName} @${childrenRole}`).trigger('multiple', multipleArgs);

      expect(eventSpy).toHaveBeenCalledTimes(2);
      expect(eventSpy.calls.argsFor(1).slice(1)).toEqual(multipleArgs);
    });
  });
});
