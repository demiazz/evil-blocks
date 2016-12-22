function find(component) {
  component.$ = function findInBlock(selector) {
    return component.block.find(selector);
  };
}


export default find;
