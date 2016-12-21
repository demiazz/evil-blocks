import { startsWith } from '../utils';


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


export default blockEvents;
