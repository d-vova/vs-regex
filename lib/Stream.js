/**
 * Copyright (c) 2012 Vladimir's Software. All rights reserved.
 *
 * @fileoverview Stream of values representing regular expression
 * @author vladimir.darmin@gmail.com
 *
 * @created Fri, Oct 12 2012 - 16:13:49 -0700
 * @updated Fri, Oct 19 2012 - 13:12:40 -0700
 */

var Stream = module.exports = function Stream ( data, offset ) {
  this.offset = offset || 0;
  this.data = String(data);   // this is not enough, some characters can be specified by their codes
  this.position = 0;
}

Stream.prototype.substream = function substream ( start, length ) {
  var start = start || this.position, position = this.offset + start;
  var length = Math.min(length || this.data.length, this.data.length - start);

  return new Stream(this.data.slice(start, start + length), position);
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

Stream.prototype.error = function error ( comment, position ) {
  var message = comment ? 'Expect ' + comment : 'Unexpected value';
  var position = position || this.position + this.offset;

  return new Error(message + ' at position ' + position);
}
