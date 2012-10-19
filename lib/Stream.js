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
  this.pos = 0;
}

Stream.prototype.substream = function substream ( text, offset ) {
  var text = text || this.data.slice(Math.min(this.data.length, this.pos));
  var offset = offset || this.pos + this.offset;

  return new Stream(text, offset);
}

Stream.prototype.position = function position ( ) {
  return this.pos + this.offset;
}

Stream.prototype.current = function current ( ) {
  return this.data[this.pos];
}

Stream.prototype.next = function next ( step ) {
  return this.data[this.pos + (step || 1)];
}

Stream.prototype.consume = function consume ( quantity ) {
  this.pos += quantity = quantity || 1;

  return this.data.substring(this.pos - quantity, this.pos);
}

Stream.prototype.error = function error ( comment, position ) {
  var message = comment ? 'Expect ' + comment : 'Unexpected value';
  var position = position || this.position();

  return new Error(message + ' at position ' + position);
}
