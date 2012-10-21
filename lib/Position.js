/**
 * Copyright (c) 2012 Vladimir's Software. All rights reserved.
 *
 * @fileoverview Position zero-width element
 * @author vladimir.darmin@gmail.com
 *
 * @created Fri, Oct 12 2012 - 17:45:54 -0700
 * @updated Sat, Oct 20 2012 - 22:47:38 -0700
 */

var Position = module.exports = function Position ( value ) {
  this.value = value;
}

Position.prototype.measure = function measure ( ) {
  if ( this.length ) return this.length;

  return this.length = { min: 0, max: 0 }
}

Position.prototype.generate = function generate ( match, mode ) {
  // for now positions are ignored during generation process
}

Position.prototype.explain = function explain ( step, shift ) {
  var step = step || '', shift = shift || '';

  return shift + '@' + this.value;
}
