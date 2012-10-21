/**
 * Copyright (c) 2012 Vladimir's Software. All rights reserved.
 *
 * @fileoverview Back reference to a previously matched group
 * @author vladimir.darmin@gmail.com
 *
 * @created Sat, Oct 13 2012 - 23:35:50 -0700
 * @updated Sat, Oct 20 2012 - 22:46:29 -0700
 */

var Reference = module.exports = function Reference ( groups, number ) {
  this.groups = groups;
  this.number = number;
}

Reference.prototype.measure = function measure ( ) {
  if ( this.length ) return this.length;

  var group = this.groups[this.number];

  return this.length = group && group.measure() || 0;
}

Reference.prototype.generate = function generate ( match, mode ) {
  return match.append(match.groups[this.number] || '');
}

Reference.prototype.explain = function explain ( step, shift ) {
  var step = step || '', shift = shift || '';

  return shift + '(' + this.number + ')';
}
