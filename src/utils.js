function clone(source) {
  return Object.keys(source).reduce((target, key) => {
    target[key] = source[key];

    return target;
  }, { });
}

const endsWith = String.prototype.endsWith
  ? (string, substring) => string.endsWith(substring)
  : (string, substring) => string.substr(-substring.length) === substring;

const startsWith = String.prototype.startsWith
  ? (string, substring) => string.startsWith(substring)
  : (string, substring) => string.substr(0, substring.length) === substring;

function transformSelector(selector) {
  return selector
    .replace(/@@([\w\u00c0-\uFFFF-]+)/g, '[data-block~="$1"]')
    .replace(/@([\w\u00c0-\uFFFF-]+)/g, '[data-role~="$1"]');
}


export { clone, endsWith, startsWith, transformSelector };
