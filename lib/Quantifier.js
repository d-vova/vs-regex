/**
 * Copyright (c) 2012 Vladimir's Software. All rights reserved.
 *
 * @fileoverview Number of times an element can be repeated
 * @author vladimir.darmin@gmail.com
 *
 * @created Fri, Oct 12 2012 - 23:36:02 -0700
 * @updated Sat, Oct 20 2012 - 22:50:53 -0700
 */

var Quantifier = module.exports = function Quantifier ( from, to, token ) {
  this.from = Math.min(from, to);
  this.to = Math.max(from, to);

  this.token = token;
}

Quantifier.prototype.measure = function measure ( ) {
  if ( this.length ) return this.length;

  var length = this.token.measure();

  var min = this.from * length.min;
  var max = this.to * length.max;

  return this.length = { min: min, max: max }
}

Quantifier.prototype.generate = function generate ( match, mode ) {
  var span = Math.min(this.to - this.from, Quantifier.MAX);
  var quantity = this.from + Math.floor(span * Math.random());

  for ( var i = 0; i < quantity; i += 1 ) {
    var result = this.token.generate(match, mode);

    if ( result instanceof Error ) return result;
  }

  return match;
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

Quantifier.MAX = 100;
