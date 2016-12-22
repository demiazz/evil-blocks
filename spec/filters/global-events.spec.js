import $ from 'jquery';

import { block, vitalize } from '../../src';

import { fixture, clear } from '../fixture';


describe('filters', () => {
  describe('global events', () => {
    afterEach(clear);

    ['body', 'window'].forEach((selector) => {
      const element = selector === 'body' ? $(selector) : $(window);

      describe(`when events triggered on ${selector}`, () => {
        it(`adds support for \`<event> on ${selector}\` pattern`, () => {
          const blockClass = `${selector}-events`;

          fixture(`
            <div class="${blockClass}"></div>
          `);

          const eventSpy = jasmine.createSpy('event');

          block(`.${blockClass}`, {
            [`click on ${selector}`]: eventSpy,
            [`custom-event on ${selector}`]: eventSpy,
          });

          vitalize();

          expect(eventSpy).not.toHaveBeenCalled();

          element.trigger('click');

          expect(eventSpy).toHaveBeenCalledTimes(1);

          element.trigger('custom-event');

          expect(eventSpy).toHaveBeenCalledTimes(2);
        });

        it(`adds support for \`<event>[ <event> ...] on ${selector}\` pattern`, () => {
          const blockClass = `${selector}-events`;

          fixture(`
            <div class="${blockClass}"></div>
          `);

          const eventSpy = jasmine.createSpy('event');

          block(`.${blockClass}`, {
            [`click custom-event on ${selector}`]: eventSpy,
          });

          vitalize();

          expect(eventSpy).not.toHaveBeenCalled();

          element.trigger('click');

          expect(eventSpy).toHaveBeenCalledTimes(1);

          element.trigger('custom-event');

          expect(eventSpy).toHaveBeenCalledTimes(2);
        });

        it('calls handler on a component instance', () => {
          const blockClass = `${selector}-events`;

          fixture(`
            <div class="${blockClass}"></div>
          `);

          const eventSpy = jasmine.createSpy('event');

          let component;

          block(`.${blockClass}`, {
            init() {
              component = this;
            },

            [`click on ${selector}`]: eventSpy,
          });

          vitalize();

          expect(eventSpy).not.toHaveBeenCalled();
          expect(component).toBeTruthy();

          element.trigger('click');

          expect(eventSpy).toHaveBeenCalledTimes(1);
          expect(eventSpy.calls.all()[0].object).toBe(component);
        });

        it('passes an event to a handler', () => {
          const blockClass = `${selector}-events`;

          fixture(`
            <div class="${blockClass}"></div>
          `);

          const eventSpy = jasmine.createSpy('event');

          block(`.${blockClass}`, {
            [`click on ${selector}`]: eventSpy,
          });

          vitalize();

          expect(eventSpy).not.toHaveBeenCalled();

          element.trigger('click');

          expect(eventSpy).toHaveBeenCalledTimes(1);
          expect(eventSpy.calls.argsFor(0)[0] instanceof $.Event).toBe(true);
        });

        it('passes an event data to a handler', () => {
          const blockClass = `${selector}-events`;

          fixture(`
            <div class="${blockClass}"></div>
          `);

          const singleArg = { single: 'argument' };
          const multipleArgs = [{ multiple: 'arguments' }, 2];

          const eventSpy = jasmine.createSpy('event');

          block(`.${blockClass}`, {
            [`single on ${selector}`]: eventSpy,
            [`multiple on ${selector}`]: eventSpy,
          });

          vitalize();

          expect(eventSpy).not.toHaveBeenCalled();

          element.trigger('single', singleArg);

          expect(eventSpy).toHaveBeenCalledTimes(1);
          expect(eventSpy.calls.argsFor(0).slice(1)).toEqual([singleArg]);

          element.trigger('multiple', multipleArgs);

          expect(eventSpy).toHaveBeenCalledTimes(2);
          expect(eventSpy.calls.argsFor(1).slice(1)).toEqual(multipleArgs);
        });
      });
    });
  });
});
