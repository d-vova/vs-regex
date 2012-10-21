/**
 * Copyright (c) 2012 Vladimir's Software. All rights reserved.
 *
 * @fileoverview Group of tokens treated as a single element
 * @author vladimir.darmin@gmail.com
 *
 * @created Sat, Oct 13 2012 - 23:41:29 -0700
 * @updated Sat, Oct 20 2012 - 22:48:51 -0700
 */

var Group = module.exports = function Group ( regex, number ) {
  this.regex = regex;
  this.number = number;

  if ( number ) regex.groups[number] = regex;
}

Group.prototype.measure = function measure ( ) {
  if ( this.length ) return this.length;

  return this.length = this.regex.measure();
}

Group.prototype.generate = function generate ( match, mode ) {
  return match.append(match.groups[this.number]);
}

Group.prototype.explain = function explain ( step, shift ) {
  var step = step || '', shift = shift || '';

  var content = [
    shift + '(' + ( this.number ? this.number + ':' : '' ),
    this.regex.explain(step, shift + step),
    shift + ')'
  ];

  return content.join(step ? '\n' : '');
}
