import $ from 'jquery';

import { block, vitalize } from '../../src';

import { fixture, clear } from '../fixture';


describe('filters', () => {
  describe('element events', () => {
    afterEach(clear);

    it('adds support for `<event> on <selector>` pattern', () => {
      const blockClass = 'element-events';
      const childrenClass = 'inside';

      fixture(`
        <div class="${blockClass}">
          <div class="${childrenClass}"></div>
        </div>
      `);

      const eventSpy = jasmine.createSpy('event');

      block(`.${blockClass}`, {
        [`click on .${childrenClass}`]: eventSpy,
        [`custom-event on .${childrenClass}`]: eventSpy,
      });

      vitalize();

      expect(eventSpy).not.toHaveBeenCalled();

      $(`.${blockClass} .${childrenClass}`).trigger('click');

      expect(eventSpy).toHaveBeenCalledTimes(1);

      $(`.${blockClass} .${childrenClass}`).trigger('custom-event');

      expect(eventSpy).toHaveBeenCalledTimes(2);
    });

    it('adds support for `<event>[ <event> ...] on <selector>` pattern', () => {
      const blockClass = 'element-events';
      const childrenClass = 'inside';

      fixture(`
        <div class="${blockClass}">
          <div class="${childrenClass}"></div>
        </div>
      `);

      const eventSpy = jasmine.createSpy('event');

      block(`.${blockClass}`, {
        [`click custom-event on .${childrenClass}`]: eventSpy,
      });

      vitalize();

      expect(eventSpy).not.toHaveBeenCalled();

      $(`.${blockClass} .${childrenClass}`).trigger('click');

      expect(eventSpy).toHaveBeenCalledTimes(1);

      $(`.${blockClass} .${childrenClass}`).trigger('custom-event');

      expect(eventSpy).toHaveBeenCalledTimes(2);
    });

    it('adds support for `<event> on <selector>[, <selector> ...]` pattern', () => {
      const blockClass = 'element-events';
      const firstChildrenClass = 'first';
      const secondChildrenClass = 'second';

      fixture(`
        <div class="${blockClass}">
          <div class="${firstChildrenClass}"></div>
          <div class="${secondChildrenClass}"></div>
        </div>
      `);

      const eventSpy = jasmine.createSpy('event');

      block(`.${blockClass}`, {
        [`click on .${firstChildrenClass}, .${secondChildrenClass}`]: eventSpy,
      });

      vitalize();

      expect(eventSpy).not.toHaveBeenCalled();

      $(`.${blockClass} .${firstChildrenClass}`).trigger('click');

      expect(eventSpy).toHaveBeenCalledTimes(1);

      $(`.${blockClass} .${secondChildrenClass}`).trigger('click');

      expect(eventSpy).toHaveBeenCalledTimes(2);
    });

    it('adds support for `<event>[ <event> ...] on <selector>[, <selector> ...]` pattern', () => {
      const blockClass = 'element-events';
      const firstChildrenClass = 'first';
      const secondChildrenClass = 'second';

      fixture(`
        <div class="${blockClass}">
          <div class="${firstChildrenClass}"></div>
          <div class="${secondChildrenClass}"></div>
        </div>
      `);

      const eventSpy = jasmine.createSpy('event');

      block(`.${blockClass}`, {
        [`click custom-event on .${firstChildrenClass}, .${secondChildrenClass}`]: eventSpy,
      });

      vitalize();

      expect(eventSpy).not.toHaveBeenCalled();

      $(`.${blockClass} .${firstChildrenClass}`).trigger('click');

      expect(eventSpy).toHaveBeenCalledTimes(1);

      $(`.${blockClass} .${firstChildrenClass}`).trigger('custom-event');

      expect(eventSpy).toHaveBeenCalledTimes(2);

      $(`.${blockClass} .${secondChildrenClass}`).trigger('click');

      expect(eventSpy).toHaveBeenCalledTimes(3);

      $(`.${blockClass} .${secondChildrenClass}`).trigger('custom-event');

      expect(eventSpy).toHaveBeenCalledTimes(4);
    });

    it('calls handler on a component instance', () => {
      const blockClass = 'element-events';
      const childrenClass = 'inside';

      fixture(`
        <div class="${blockClass}">
          <div class="${childrenClass}"></div>
        </div>
      `);

      const eventSpy = jasmine.createSpy('event');

      let component;

      block(`.${blockClass}`, {
        init() {
          component = this;
        },

        [`click on .${childrenClass}`]: eventSpy,
      });

      vitalize();

      expect(eventSpy).not.toHaveBeenCalled();
      expect(component).toBeTruthy();

      $(`.${blockClass} .${childrenClass}`).trigger('click');

      expect(eventSpy).toHaveBeenCalledTimes(1);
      expect(eventSpy.calls.all()[0].object).toBe(component);
    });

    it('passes an event to a handler', () => {
      const blockClass = 'element-events';
      const childrenClass = 'inside';

      fixture(`
        <div class="${blockClass}">
          <div class="${childrenClass}"></div>
        </div>
      `);

      const eventSpy = jasmine.createSpy('event');

      block(`.${blockClass}`, {
        [`click on .${childrenClass}`]: eventSpy,
      });

      vitalize();

      expect(eventSpy).not.toHaveBeenCalled();

      $(`.${blockClass} .${childrenClass}`).trigger('click');

      expect(eventSpy).toHaveBeenCalledTimes(1);
      expect(eventSpy.calls.argsFor(0)[0] instanceof $.Event).toBe(true);
    });

    it('binds element to an event', () => {
      const blockClass = 'element-events';
      const childrenClass = 'inside';

      fixture(`
        <div class="${blockClass}">
          <div class="${childrenClass}"></div>
        </div>
      `);

      const eventSpy = jasmine.createSpy('event');

      block(`.${blockClass}`, {
        [`click on .${childrenClass}`]: eventSpy,
      });

      vitalize();

      expect(eventSpy).not.toHaveBeenCalled();

      $(`.${blockClass} .${childrenClass}`).trigger('click');

      expect(eventSpy).toHaveBeenCalledTimes(1);

      const elements = eventSpy.calls.argsFor(0)[0].el;

      expect(elements.jquery).toBeTruthy();
      expect(elements.length).toEqual(1);
      expect(elements[0]).toEqual(
        document.querySelector(`.${blockClass} .${childrenClass}`)
      );
    });

    it('passes an event data to a handler', () => {
      const blockClass = 'element-events';
      const childrenClass = 'inside';

      fixture(`
        <div class="${blockClass}">
          <div class="${childrenClass}"></div>
        </div>
      `);

      const singleArg = { single: 'argument' };
      const multipleArgs = [{ multiple: 'arguments' }, 2];

      const eventSpy = jasmine.createSpy('event');

      block(`.${blockClass}`, {
        [`single on .${childrenClass}`]: eventSpy,
        [`multiple on .${childrenClass}`]: eventSpy,
      });

      vitalize();

      expect(eventSpy).not.toHaveBeenCalled();

      $(`.${blockClass} .${childrenClass}`).trigger('single', singleArg);

      expect(eventSpy).toHaveBeenCalledTimes(1);
      expect(eventSpy.calls.argsFor(0).slice(1)).toEqual([singleArg]);

      $(`.${blockClass} .${childrenClass}`).trigger('multiple', multipleArgs);

      expect(eventSpy).toHaveBeenCalledTimes(2);
      expect(eventSpy.calls.argsFor(1).slice(1)).toEqual(multipleArgs);
    });
  });
});
