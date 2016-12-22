import $ from 'jquery';

import { endsWith } from '../utils';


function globalEvents(component) {
  Object.keys(component).forEach((property) => {
    let listenerElement;

    if (endsWith(property, 'on body')) {
      listenerElement = $('body');
    } else if (endsWith(property, 'on window')) {
      listenerElement = $(window);
    } else {
      return;
    }

    const events = property.split(' on ')[0];
    const listener = component[property];

    listenerElement.on(events, (...args) => {
      listener.call(component, ...args);
    });
  });
}


export default globalEvents;
