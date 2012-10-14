/**
 * Copyright (c) 2012 Vladimir's Software. All rights reserved.
 *
 * @fileoverview Range of characters represented by an element
 * @author vladimir.darmin@gmail.com
 *
 * @created Sat, Oct 13 2012 - 00:17:24 -0700
 * @updated Sat, Oct 13 2012 - 00:17:24 -0700
 */

var Stream = require('./Stream');
var Interval = require('./Interval');

var CHARS = [ [ 0, 65535 ] ];
var DIGITS = [ [ 48, 57 ] ];
var SPACES = [
  [ 9, 13 ], 32, 160, 5760, 6158, [ 8192, 8202 ],
  [ 8232, 8233 ], 8239, 8287, 12288, 65279
];
var WORDS = [ [ 65, 90 ], [ 97, 122 ] ]

var Range = module.exports = function Range ( stream ) {
  var regex = /(\.)|\\(?:(d)|(D)|(s)|(S)|(w)|(W))|\[((\^)?(?:\\\]|[^\]])*)\]/;

  if ( !(this instanceof Range) ) {
    var match = stream.check(regex);

    return match instanceof Error ? match : new Range(match);
  }

  var match = stream instanceof Stream ? stream.match(regex) : stream;

  this.interval = new Interval([ ]);

  if ( match[1] ) this.interval = new Interval(CHARS);
  else if ( match[2] ) this.interval = new Interval(DIGITS);
  else if ( match[3] ) this.interval = new Interval(DIGITS).invert(CHARS[0]);
  else if ( match[4] ) this.interval = new Interval(SPACES);
  else if ( match[5] ) this.interval = new Interval(SPACES).invert(CHARS[0]);
  else if ( match[6] ) this.interval = new Interval(WORDS);
  else if ( match[7] ) this.interval = new Interval(WORDS).invert(CHARS[0]);
  else if ( match[8] ) {
    var content = match[8], isInverted = !!match[9];

    var interval = this.interval = new Interval([ ]);

    var regex = /\\(?:(d)|(D)|(s)|(S)|(w)|(W))|(?:\\)?(.)(?:-\\?(.))?/;

    while ( match = content.match(regex) ) {
      if ( match[1] ) interval.add(new Interval(DIGITS));
      else if ( match[2] ) interval.add(new Interval(DIGITS).invert(CHARS[0]));
      else if ( match[3] ) interval.add(new Interval(SPACES));
      else if ( match[4] ) interval.add(new Interval(SPACES).invert(CHARS[0]));
      else if ( match[5] ) interval.add(new Interval(WORDS));
      else if ( match[6] ) interval.add(new Interval(WORDS).invert(CHARS[0]));
      else interval.add(new Interval([ [ match[7], match[8] || match[7] ] ]));

      content = content.slice(match[0].length);
    }

    if ( isInverted ) this.interval = this.interval.invert(CHARS[0]);
  }
}
