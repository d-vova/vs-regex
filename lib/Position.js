/**
 * Copyright (c) 2012 Vladimir's Software. All rights reserved.
 *
 * @fileoverview Position zero-width element
 * @author vladimir.darmin@gmail.com
 *
 * @created Fri, Oct 12 2012 - 17:45:54 -0700
 * @updated Fri, Oct 12 2012 - 17:45:54 -0700
 */

var Position = module.exports = function Position ( value ) {
  this.value = value
}

Position.prototype.explain = function explain ( shift ) {
  return shift + 'Position(' + this.value + ')';
}
