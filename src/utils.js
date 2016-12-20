function clone(source) {
  return Object.keys(source).reduce((target, key) => {
    target[key] = source[key];

    return target;
  }, { });
}

function transformSelector(selector) {
  return selector
    .replace(/@@([\w\u00c0-\uFFFF-]+)/g, '[data-block~="$1"]')
    .replace(/@([\w\u00c0-\uFFFF-]+)/g, '[data-role~="$1"]');
}


export { clone, transformSelector };
