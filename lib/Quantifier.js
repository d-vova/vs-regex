/**
 * Copyright (c) 2012 Vladimir's Software. All rights reserved.
 *
 * @fileoverview Number of times an element can be repeated
 * @author vladimir.darmin@gmail.com
 *
 * @created Fri, Oct 12 2012 - 23:36:02 -0700
 * @updated Fri, Oct 12 2012 - 23:36:02 -0700
 */

var Stream = require('./Stream');

var Quantifier = module.exports = function Quantifier ( stream ) {
  var regex = /(\?)|(\*)|(\+)|{(\d+)(?:,(\d+)?)}/;

  if ( !(this instanceof Quantifier) ) {
    var match = stream.check(regex);

    return match instanceof Error ? match : new Quantifier(match);
  }

  var match = stream instanceof Stream ? stream.match(regex) : stream;

  if ( match[1] ) this.from = 0;
  else if ( match[2] ) this.from = 0;
  else if ( match[3] ) this.from = 1;
  else this.from = +match[4];

  if ( match[1] this.to = 1;
  else if ( match[2] ) this.to = Infinity;
  else if ( match[3] ) this.to = Infinity;
  else this.to = +(match[5] || Infinity);
}
