import $ from 'jquery';
import createEngine from 'lighty';

import { transformSelector, clone } from './utils';


function builder(element, prototype) {
  const component = clone(prototype);

  component.block = $(element);

  if (component.init) {
    component.init();
  }
}

const engine = createEngine(builder);

function block(selector, prototype) {
  engine.component(transformSelector(selector), prototype);
}

function vitalize(trees) {
  engine.vitalize(trees);
}


export { block, vitalize };
