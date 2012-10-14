/**
 * Copyright (c) 2012 Vladimir's Software. All rights reserved.
 *
 * @fileoverview Position of an element in regular expression
 * @author vladimir.darmin@gmail.com
 *
 * @created Fri, Oct 12 2012 - 17:45:54 -0700
 * @updated Fri, Oct 12 2012 - 17:45:54 -0700
 */

var Stream = require('./Stream');

var Position = module.exports = function Position ( stream ) {
  var regex = /\^|\$|\\b|\\B/;

  if ( !(this instanceof Position) ) {
    var match = stream.check(regex);

    return match instanceof Error ? match : new Position(match);
  }

  var match = stream instanceof Stream ? stream.match(regex) : stream;

  this.value = match[0].slice(-1);
}
