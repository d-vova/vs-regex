/**
 * Copyright (c) 2012 Vladimir's Software. All rights reserved.
 *
 * @fileoverview Back reference to a previously matched group
 * @author vladimir.darmin@gmail.com
 *
 * @created Sat, Oct 13 2012 - 23:35:50 -0700
 * @updated Sat, Oct 13 2012 - 23:35:50 -0700
 */

var Stream = require('./Stream');

var Reference = module.exports = function Reference ( Stream ) {
  var regex = /\\\(d+)/;

  if ( !(this instanceof Reference) ) {
    var match = stream.check(regex);

    return match instanceof Error ? match : new Reference(match);
  }

  var match = stream instanceof Stream ? stream.match(regex) : stream;

  this.value = match[1];
}
