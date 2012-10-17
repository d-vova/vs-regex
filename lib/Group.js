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

Group.prototype.explain = function explain ( shift ) {
  var shift = shift || '', content = [ ];

  content.push(shift + '->Group(' + this.isCapturing + ')');
  content.push(this.regex.explain(shift + '  ');
  content.push(shift + '<-Group');

  return content.join('\n');
}
