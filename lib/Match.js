/**
 * Copyright (c) 2012 Vladimir's Software. All rights reserved.
 *
 * @fileoverview Matched value holder
 * @author vladimir.darmin@gmail.com
 *
 * @created Sat, Oct 20 2012 - 15:34:26 -0700
 * @updated Sat, Oct 20 2012 - 22:55:36 -0700
 */

var Match = module.exports = function Match ( input, index, groups ) {
  this.input = input || '';
  this.index = index || 0;
  this.groups = groups || [ '' ];
}

Match.prototype.append = function append ( part ) {
  this.input += part;
  this.groups[0] += part;

  return this;
}

Match.prototype.toString = function toString ( ) {
  return this.groups[0];
}

Match.prototype.valueOf = function valueOf ( ) {
  return this.groups[0];
}
