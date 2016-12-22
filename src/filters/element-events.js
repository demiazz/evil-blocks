import $ from 'jquery';

import { includes } from '../utils';


function elementEvents(component) {
  Object.keys(component).forEach((property) => {
    if (!includes(property, ' on ')) {
      return;
    }

    const [events, selectors] = property.split(' on ');

    if (!(events && selectors)) {
      return;
    }

    const listener = component[property];

    component.block.on(events, selectors, function handleEvent(...args) {
      const [event] = args;

      event.el = $(this);

      listener.call(component, ...args);
    });
  });
}


export default elementEvents;
