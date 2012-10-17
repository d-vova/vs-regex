/**
 * Copyright (c) 2012 Vladimir's Software. All rights reserved.
 *
 * @fileoverview Stream of values representing regular expression
 * @author vladimir.darmin@gmail.com
 *
 * @created Fri, Oct 12 2012 - 16:13:49 -0700
 * @updated Fri, Oct 12 2012 - 16:13:49 -0700
 */

var Stream = module.exports = function Stream ( data, offset ) {
  this.offset = offset || 0;
  this.data = String(data);
  this.position = 0;
}

Stream.prototype.current = function current ( ) {
  return this.data[this.position];
}

Stream.prototype.next = function next ( step ) {
  return this.data[this.position + (step || 1)];
}

Stream.prototype.consume = function consume ( quantity ) {
  this.position += quantity = quantity || 1;

  return this.data.substring(this.position - quantity, this.position);
}

Stream.prototype.hasNext = function hasNext ( quantity ) {
  return this.position + (quantity || 1) < this.data.length;
}

Stream.prototype.isDone = function isDone ( ) {
  return this.position >= this.data.length;
}

Stream.prototype.error = function error ( values, position ) {
  var message = 'Unexpected value';
  var position = position || (this.position + this.offset);
  
  if ( values ) message = 'Expect ' + values.join(' or ');

  return new Error(message + ' at position ' + position);
}
