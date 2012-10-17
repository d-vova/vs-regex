/**
 * Copyright (c) 2012 Vladimir's Software. All rights reserved.
 *
 * @fileoverview Range of allowed characters
 * @author vladimir.darmin@gmail.com
 *
 * @created Fri, Oct 12 2012 - 16:08:21 -0700
 * @updated Fri, Oct 12 2012 - 16:08:21 -0700
 */

var toBorders = function toBorders ( intervals ) {
  var borders = [ ];

  for ( var i = 0; i < intervals.length; i += 1 ) {
    var interval = intervals[i];

    if ( interval instanceof Array ) {
      interval = { from: interval[0], to: interval[1] }
    }
    else if ( !(interval instanceof Object) ) {
      interval = { from: +interval, to: +interval }
    }

    var sign = interval.sign === -1 ? -1 : 1;

    borders.push({ index: i, sign: sign, value: interval.from, from: 1 });
    borders.push({ index: i, sign: sign, value: interval.to, to: 1 });
  }

  borders.sort(function ( a, b ) {
    return a.value - b.value || a.sign - b.sign || a.from - b.from;
  });

  return borders;
}

var toIntervals = function toIntervals ( borders ) {
  var intervals = [ ];

  var positive = { started: { }, count: 0 }
  var negative = { started: { }, count: 0 }

  for ( var i = 0; i < borders.length; i += 1 ) {
    var last = intervals[intervals.length - 1];
    var border = borders[i], current = border.sign > 0 ? positive : negative;

    current.started[border.index] = !current.started[border.index]

    if ( current.started[border.index] ) {
      if ( negative.count == 0 ) {
        if ( positive.count == 0 ) {
          if ( border.sign > 0 ) positive.begin = border.value;
        }
        else if ( border.sign < 0 && positive.begin < border.value ) {
          if ( last && (last.to + 2 > positive.begin) ) last.to = border.value - 1;
          else intervals.push({ from: positive.begin, to: border.value - 1 });
        }
      }

      current.count += 1;
    }
    else {
      current.count -= 1;

      if ( negative.count == 0 ) {
        if ( positive.count == 0 )  {
          if ( border.sign > 0 && positive.begin <= border.value ) {
            if ( last && (last.to + 2 > positive.begin) ) last.to = border.value;
            else intervals.push({ from: positive.begin, to: border.value });
          }
        }
        else if ( border.sign < 0 ) positive.begin = border.value + 1;
      }
    }
  }

  return intervals;
}

var Range = module.exports = function Range ( intervals ) {
  this.parts = toIntervals(toBorders(intervals));
}

Range.prototype.add = function add ( range ) {
  var intervals = [ ];

  for ( var i = 0; i < this.parts.length; i += 1 ) {
    var part = this.parts[i];

    intervals.push({ from: part.from, to: part.to });
  }

  for ( var i = 0; i < range.parts.length; i += 1 ) {
    var part = range.parts[i];

    intervals.push({ from: part.from, to: part.to });
  }

  return new Range(intervals);
}

Range.prototype.subtract = function subtract ( range ) {
  var intervals = [ ];

  for ( var i = 0; i < this.parts.length; i += 1 ) {
    var part = this.parts[i];

    intervals.push({ from: part.from, to: part.to });
  }

  for ( var i = 0; i < range.parts.length; i += 1 ) {
    var part = range.parts[i];

    intervals.push({ from: part.from, to: part.to, sign: -1 });
  }

  return new Range(intervals);
}

Range.prototype.intersect = function intersect ( range ) {
  var union = this.add(range), min = union.min(), max = union.max();

  var inverse = this.invert([ min, max ]).add(range.invert([ min, max ]));

  return union.subtract(inverse);
}

Range.prototype.invert = function invert ( range ) {
  if ( range instanceof Range ) {
    return new Range([ [ range.min(), range.max() ] ]).subtract(this);
  }
  else if ( range instanceof Array ) {
    return new Range([ range ]).subtract(this);
  }
  else return new Range([ [ this.min(), this.max() ] ]).subtract(this);
}

Range.prototype.crop = function crop ( from, to ) {
  return this.invert([ [ from, to ] ]).invert([ [ from, to ] ]);
}

Range.prototype.min = function min ( ) {
  return this.parts[0].from;
}

Range.prototype.max = function max ( ) {
  return this.parts[this.parts.length - 1].to;
}

Range.prototype.toString = function toString ( ) {
  var results = [ ];

  for ( var i = 0; i < this.parts.length; i += 1 ) {
    var interval = this.parts[i];

    switch ( interval.to - interval.from ) {
      case 0: results.push(interval.from); break;
      case 1: results.push(interval.from + ', ' + interval.to); break;
      default: results.push(interval.from + '..' + interval.to);
    }
  }

  return results.join(', ');
}

Range.prototype.explain = function explain ( shift ) {
  return shift + 'Range(' + String(this) + ')';
}
