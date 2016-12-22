import $ from 'jquery';

import { endsWith, includes, startsWith } from './utils';


function findAlias(component) {
  component.$ = function findInBlock(selector) {
    return component.block.find(selector);
  };
}

function roleAliases(component) {
  const nodes = component.$('[data-role]');

  nodes.toArray().forEach((node) => {
    const roleNames = node.attributes['data-role'].value.split(' ');

    roleNames.forEach((roleName) => {
      if (!component[roleName]) {
        component[roleName] = $();
      }

      if (component[roleName].jquery) {
        component[roleName].push(node);
      }
    });
  });
}

function blockEvents(component) {
  Object.keys(component).forEach((property) => {
    if (!startsWith(property, 'on ')) {
      return;
    }

    const events = property.substr(3);
    const listener = component[property];

    component.block.on(events, (e, ...data) => {
      if (e.currentTarget !== e.target) {
        return;
      }

      listener.call(component, e, ...data);
    });
  });
}

let loadEvent;

$(window).on('load', (e) => {
  loadEvent = e;
});

function loadEvents(component) {
  Object.keys(component).forEach((property) => {
    if (property !== 'load on window') {
      return;
    }

    const listener = component[property];

    if (!listener) {
      return;
    }

    if (loadEvent) {
      setTimeout(() => listener.call(component, loadEvent), 1);
    } else {
      $(window).on('load', e => listener.call(component, e));
    }
  });
}

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


export default [
  findAlias, roleAliases, blockEvents, loadEvents, globalEvents, elementEvents,
];
