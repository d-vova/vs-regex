/**
 * Copyright (c) 2012 Vladimir's Software. All rights reserved.
 *
 * @fileoverview Back reference to a previously matched group
 * @author vladimir.darmin@gmail.com
 *
 * @created Sat, Oct 13 2012 - 23:35:50 -0700
 * @updated Sat, Oct 13 2012 - 23:35:50 -0700
 */

var Reference = module.exports = function Reference ( number ) {
  this.number = number;
}

Reference.prototype.explain = function explain ( shift ) {
  return shift + 'Reference(' + this.number + ')';
}
