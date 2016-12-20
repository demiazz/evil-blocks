import $ from 'jquery';

import transformSelector from './transform-selector';


function rewriteSelector(context, name, position) {
  const original = context[name];

  if (!original) {
    return;
  }

  context[name] = function replaceAliases(...args) {
    args[position] = transformSelector(args[position]);

    return original.apply(context, args);
  };

  $.extend(context[name], original);
}


rewriteSelector($, 'find', 0);
rewriteSelector($, 'multiFilter', 0);
rewriteSelector($.find, 'matchesSelector', 1);
rewriteSelector($.find, 'matches', 0);
