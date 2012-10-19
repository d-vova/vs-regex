/**
 * Copyright (c) 2012 Vladimir's Software. All rights reserved.
 *
 * @fileoverview Underlying regular expression class
 * @author vladimir.darmin@gmail.com
 *
 * @created Fri, Oct 12 2012 - 15:49:47 -0700
 * @updated Thu, Oct 18 2012 - 15:55:15 -0700
 */

var Stream = require('./Stream');

var Position = require('./Position');
var Range = require('./Range');
var Group = require('./Group');
var Reference = require('./Reference');
var Quantifier = require('./Quantifier');

var CHARS = [ [ 0, 65535 ] ];
var DIGITS = [ [ 48, 57 ] ];
var SPACES = [
  [ 9, 13 ], 32, 160, 5760, 6158, [ 8192, 8202 ],
  [ 8232, 8233 ], 8239, 8287, 12288, 65279
];
var WORDS = [ [ 65, 90 ], [ 97, 122 ] ];

var matchRound = function matchRound ( stream ) {
  var current, content = '';

  while ( current = stream.consume() ) {
    switch ( current ) {
      case '\\': {
        if ( !stream.current() ) {
          return stream.error('a character after "\\"');
        }

        content += current + stream.consume();
      } break;
      case '[': {
        var body = matchSquare(stream);

        if ( body instanceof Error ) return body;

        content += '[' + body + ']';
      } break;
      case '(': {
        var body = matchRound(stream);

        if ( body instanceof Error) return body;

        content += '(' + body + ')';
      } break;
      case ')': return content;
      default: content += current;
    }
  }

  return stream.error('")"');
}

var matchSquare = function matchSquare ( stream ) {
  var current, content = '';

  while ( current = stream.consume() ) {
    if ( current == ']' ) return content;

    content += current;

    if ( current == '\\' ) {
      if ( current = stream.consume() ) content += current;
      else return stream.error('a character after "\\"');
    }
  }

  return stream.error('"]"');
}

var matchCurly = function matchCurly ( stream ) {
  var current, content = '', hasComma = false, hasDigit = false;

  while ( current = stream.consume() ) {
    var code = current.charCodeAt(0);

    if ( code > 47 && code < 58 ) hasDigit = true;
    else if ( current == ',' ) {
      if ( !hasDigit ) return stream.error('a digit');
      else if ( hasComma ) return stream.error('"}" or a digit');
    }
    else if ( current == '}' ) {
      return hasDigit ? content : stream.error('a digit');
    }

    content += current;
  }

  return stream.error('"}"');
}

var nextInterval = function nextInterval ( stream ) {
  var next, current = stream.consume();

  if ( !current ) return null;

  if ( current == '\\' ) {
    switch ( current = stream.consume() ) {
      case 'd': return new Range(DIGITS);
      case 'D': return new Range(DIGITS).invert(CHARS[0]);
      case 's': return new Range(SPACES);
      case 'S': return new Range(SPACES).invert(CHARS[0]);
      case 'w': return new Range(WORDS);
      case 'W': return new Range(WORDS).invert(CHARS[0]);
      case '': return stream.error('a character after "\\"');
    }
  }

  var begin = current.charCodeAt(0), end = begin;

  if ( stream.current() == '-' ) {
    next = stream.next();

    if ( next == '\\' ) {
      switch ( next = stream.next(2) ) {
          case 'd':
          case 'D':
          case 's':
          case 'S':
          case 'w':
          case 'W': return new Range([ begin ]);
      }

      if ( next ) end = stream.consume(3).slice(-1).charCodeAt(0);
      else return stream.error('a character after "\\"');
    }
    else if ( next ) end = stream.consume(2).slice(-1).charCodeAt(0);
  }

  return new Range([ [ begin, end ] ]);
}

var composeRange = function composeRange ( regex ) {
  var position = regex.stream.position;
  var expression = matchSquare(regex.stream);

  if ( expression instanceof Error ) return expression;

  var stream = regex.stream.substream(position, expression.length);
  var interval, isInverse = false; range = new Range();

  if ( stream.current() == '^' ) isInverse = !!stream.consume();

  while ( interval = nextInterval(stream) ) {
    if ( interval instanceof Error ) return interval;
    else range = range.add(interval);
  }

  return isInverse ? range.invert(CHARS[0]) : range;
}

var composeGroup = function composeGroup ( regex ) {
  var position = regex.stream.position;
  var expression = matchRound(regex.stream);

  if ( expression instanceof Error ) return expression;

  var stream = regex.stream.substream(position, expression.length);
  var isCapturing = stream.current() != '?' || stream.next() != ':';

  var number = isCapturing ? regex.groups.length : 0;

  if ( !isCapturing ) stream.consume(2); else regex.groups.push(null);

  var regex = Regex(stream, regex.mode, regex);

  return regex instanceof Error ? regex : new Group(regex, number);
}

var composeQuantifier = function composeQuantifier ( regex ) {
  var expression = matchCurly(regex.stream);

  if ( expression instanceof Error ) return expression;

  var limits = expression.split(','), from = limits[0], to = limits[1];

  to = to ? to : to == null ? from : Infinity;

  return new Quantifier(+from, +to, regex.tokens.slice(-1)[0].pop());
}

var next = function next ( regex ) {
  var current, tokens = regex.tokens.slice(-1)[0];

  switch ( current = regex.stream.consume() ) {
    case '^':
    case '$': return new Position(current);
    case '.': return new Range(CHARS);
    case '[': return composeRange(regex);
    case '(': return composeGroup(regex);
    case '?': return new Quantifier(0, 1, tokens.pop());
    case '*': return new Quantifier(0, Infinity, tokens.pop());
    case '+': return new Quantifier(1, Infinity, tokens.pop());
    case '{': return composeQuantifier(regex);
    case '|': { regex.tokens.push([ ]); return next(regex); }
    case '\\': {
      switch ( current = regex.stream.consume() ) {
        case 'b':
        case 'B': return new Position(current);
        case 'd': return new Range(DIGITS);
        case 'D': return new Range(DIGITS).invert(CHARS[0]);
        case 's': return new Range(SPACES);
        case 'S': return new Range(SPACES).invert(CHARS[0]);
        case 'w': return new Range(WORDS);
        case 'W': return new Range(WORDS).invert(CHARS[0]);
        case '': return stream.error('a character after "\\"');
        default: {
          var number = current, code = current.charCodeAt(0);

          if ( code > 47 && code < 58 ) {
            while ( current = regex.stream.current() ) {
              code = current.charCodeAt(0);

              if ( code < 48 || code > 57 ) break;

              number += regex.stream.consume();
            }

            return new Reference(+number);
          }

          return new Range([ code ]);
        }
      }
    }
    default: return new Range([ current.charCodeAt(0) ]);
  }
}

var Regex = module.exports = function Regex ( stream, mode, parent ) {
  var regex = this instanceof Regex ? this : Object.create(Regex.prototype);

  regex.stream = stream instanceof Stream ? stream : new Stream(stream);
  regex.string = stream instanceof Stream ? stream.raw : stream;
  regex.groups = parent && parent.groups || [ regex ];
  regex.tokens = [ [ ] ];
  regex.mode = mode;

  while ( regex.stream.current() ) {
    var token = next(regex);

    if ( token instanceof Error ) {
      if ( this == regex ) throw token; else return token;
    }

    regex.tokens.slice(-1)[0].push(token);
  }

  if ( this != regex ) return regex;
}

Regex.prototype.explain = function explain ( step, shift ) {
  var step = step || '', shift = shift || '';

  for ( var i = +step; i > 0; i -= 1 ) {
    step = ( i == step ? '' : step ) + ' ';
  }

  var content = [ ];

  for ( var i = 0; i < this.tokens.length; i += 1 ) {
    var subcontent = [ ];

    for ( var j = 0; j < this.tokens[i].length; j += 1 ) {
      subcontent.push(this.tokens[i][j].explain(step, shift));
    }

    content.push(subcontent.join(step ? '\n' : ''));
  }

  return content.join(step ? '\n\n' : '|');
}
