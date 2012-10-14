/**
 * Copyright (c) 2012 Vladimir's Software. All rights reserved.
 *
 * @fileoverview Stream of values representing regular expression
 * @author vladimir.darmin@gmail.com
 *
 * @created Fri, Oct 12 2012 - 16:13:49 -0700
 * @updated Fri, Oct 12 2012 - 16:13:49 -0700
 */

var Stream = module.exports = function Stream ( data ) {
  this.data = String(data);
  this.position = 0;
}

Stream.prototype.current = function current ( ) {
  return this.data[this.position];
}

Stream.prototype.next = function next ( step ) {
  return this.data[this.position + (step | 1)];
}

Stream.prototype.consume = function consume ( quantity ) {
  this.position += quantitiy | 1;
}

Stream.prototype.check = function check ( regex ) {
  return this.data.slice(this.position).match(regex);
}

Stream.prototype.match = function match ( regex ) {
  var result = this.check(regex);

  if ( !result || result.index != 0 ) {
    throw new Error('expect ' + regex + ' at position ' + this.position);
  }

  this.position += result.length;

  return result;
}
