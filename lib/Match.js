/**
 * Copyright (c) 2012 Vladimir's Software. All rights reserved.
 *
 * @fileoverview Matched value holder
 * @author vladimir.darmin@gmail.com
 *
 * @created Sat, Oct 20 2012 - 15:34:26 -0700
 * @updated Sun, Oct 21 2012 - 01:29:04 -0700
 */

var Match = module.exports = function Match ( value, index, groups ) {
  this.value = value || '';
  this.index = index || 0;
  this.groups = groups || [ ];

  this.groups[this.index] = '';
}

Match.prototype.next = function next ( ) {
  return new Match(this.value, this.index + 1, this.groups);
}

Match.prototype.append = function append ( string ) {
  var string = String(string);

  this.value += string;
  this.groups[this.index] += string;

  return this;
}

Match.prototype.toString = function toString ( ) {
  return String(this.groups[this.index]);
}

Match.prototype.valueOf = function valueOf ( ) {
  return String(this.groups[this.index]);
}
