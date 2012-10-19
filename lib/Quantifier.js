/**
 * Copyright (c) 2012 Vladimir's Software. All rights reserved.
 *
 * @fileoverview Number of times an element can be repeated
 * @author vladimir.darmin@gmail.com
 *
 * @created Fri, Oct 12 2012 - 23:36:02 -0700
 * @updated Fri, Oct 12 2012 - 23:36:02 -0700
 */

var Quantifier = module.exports = function Quantifier ( from, to, token ) {
  this.from = from;
  this.to = to;
  this.token = token;
}

Quantifier.prototype.explain = function explain ( step, shift ) {
  var step = step || '', shift = shift || '';

  var content = [
    shift + '{' + this.from + '<=',
    this.token && this.token.explain(step, shift + step) || '""',
    shift + '<=' + this.to + '}'
  ]

  return content.join(step ? '\n' : '');
}
