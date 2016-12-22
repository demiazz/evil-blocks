import $ from 'jquery';


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


export default loadEvents;
