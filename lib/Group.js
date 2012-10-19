/**
 * Copyright (c) 2012 Vladimir's Software. All rights reserved.
 *
 * @fileoverview Group of tokens treated as a single element
 * @author vladimir.darmin@gmail.com
 *
 * @created Sat, Oct 13 2012 - 23:41:29 -0700
 * @updated Sat, Oct 13 2012 - 23:41:29 -0700
 */

var Group = module.exports = function Group ( regex, isCapturing ) {
  this.regex = regex;
  this.isCapturing = isCapturing;
}

Group.prototype.explain = function explain ( step, shift ) {
  var step = step || '', shift = shift || '';

  var content = [
    shift + '(' + ( this.isCapturing ? this.isCapturing + ':' : '' ),
    this.regex.explain(step, shift + step),
    shift + ')'
  ];

  return content.join(step ? '\n' : '');
}
