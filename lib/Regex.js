/**
 * Copyright (c) 2012 Vladimir's Software. All rights reserved.
 *
 * @fileoverview Regular Expression with expanded capabilities for random
 *               string generation and corner case strings computation
 * @author vladimir.darmin@gmail.com
 *
 * @created Fri, Oct 12 2012 - 15:49:47 -0700
 * @updated Fri, Oct 12 2012 - 15:49:47 -0700
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

var matchNumber = function matchNumber ( stream, number ) {
  if ( !stream.isDone() ) {
    var code = stream.current().charCodeAt(0);

    if ( code > 47 && code < 58 ) {
      return matchNumber(stream, number + stream.consume());
    }
  }

  return number ? +number : stream.error([ 'number' ]);
}

var matchRound = function matchRound ( stream ) {
  var content = '';

  while ( var current = stream.consume() ) {
    switch ( current ) {
      case '\\': {
        if ( stream.isDone() ) {
          return stream.error([ 'another character after "\\"' ]);
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
      case ')': return new Stream(content, stream.position + stream.offset);
      default: content += current;
    }
  }

  return stream.error('")"');
}

var matchSquare = function matchSquare ( stream ) {
  var content = '';

  while ( var current = stream.consume() ) {
    switch ( current ) {
      case '\\': {
        if ( stream.isDone() ) {
          return stream.error([ 'another character after "\\"' ]);
        }

        content += current + stream.consume();
      } break;
      case ']': return new Stream(content, stream.position + stream.offset);
      default: content += current;
    }
  }

  return stream.error('"]"');
}

var matchCurly = function matchCurly ( stream ) {
  var number, content = '';
  
  number = matchNumber(stream);

  if ( !(number instanceof Error) ) content += String(number);
  else return number;

  switch ( stream.consume() ) {
    case ',': content += ',';
    case '}': return content;
    default: return stream.error([ '","', '"}"' ]);
  }

  number = matchNumber(stream);

  if ( !(number instanceof Error) ) content += String(number);

  return stream.consume() == '}' ? content : stream.error([ '"}"' ]);
}

var composeRange = function composeRange ( regex, stream ) {
  var range = new Range(), shouldInvert = false;

  if ( stream.next() == '^' ) shouldInvert = !!stream.consume();

  while ( var current = stream.consume() ) {
    if ( current == '\\' ) {
      switch ( current = stream.consume() ) {
        case 'd': range.add(new Range(DIGITS)); continue;
        case 'D': range.add(new Range(DIGITS).invert(CHARS[0])); continue;
        case 's': range.add(new Range(SPACES)); continue;
        case 'S': range.add(new Range(SPACES).invert(CHARS[0])); continue;
        case 'w': range.add(new Range(WORDS)); continue;
        case 'W': range.add(new Range(WORDS).invert(CHARS[0])); continue;
        case '': return stream.error('another character after "\\"');
      }
    }

    var begin = current.charCodeAt(0), end = begin;

    if ( stream.current() == '-' ) {
      current = stream.consume();

      if ( stream.isDone() ) range.add(new Range([ '-'.charCodeAt(0) ]));
      else if ( stream.current() == '\\' ) {
        switch ( stream.next() ) {
          case 'd':
          case 'D':
          case 's':
          case 'S':
          case 'w':
          case 'W': range.add(new Range([ '-'.charCodeAt(0) ]); break;
          default: {
            stream.consume()

            switch ( current = stream.consume() ) {
              case '': return stream.error('another character after "\\"');
              default: end = current.charCodeAt(0);
            }
          }
        }
      }
      else end = stream.consume().charCodeAt(0)
    }

    range.add(new Range([ [ begin, end ] ]));
  }

  return shouldInvert ? range.invert(CHARS[0]) : range;
}

var composeGroup = function composeGroup ( regex, stream ) {
  var isCapturing = stream.current() == '?' && stream.next() == ':';
  
  if ( isCapturing ) stream.consume(2);

  var string = stream.data.slice(stream.position);
  var regex = Regex(string, regex.mode, stream);

  return regex instanceof Error ? regex : new Group(regex, isCapturing);
}

var composeQuantifier = function composeQuantifier ( regex, string ) {
  var limits = string.split(','), from = limits[0], to = limits[1];

  to = to ? to : to == null ? Infinity : from;

  return new Quantifier(from, to, regex.tokens.pop());
}

var next = function next ( regex, stream ) {
  var tokens = regex.tokens;

  switch ( var current = stream.consume() ) {
    case '^':
    case '$': return new Position(current);
    case '.': return new Range(CHARS);
    case '[': return composeRange(regex, matchSquare(stream));
    case '(': return composeGroup(regex, matchRound(stream));
    case '?': return new Quantifier(0, 1, tokens.pop());
    case '*': return new Quantifier(0, Infinity, tokens.pop());
    case '+': return new Quantifier(1, Infinity, tokens.pop());
    case '{': return composeQuantifier(regex, matchCurly(stream));
    case '\\': {
      switch ( current = stream.consume() ) {
        case 'b':
        case 'B': return new Position(current);
        case 'd': return new Range(DIGITS);
        case 'D': return new Range(DIGITS).invert(CHARS[0]);
        case 's': return new Range(SPACES);
        case 'S': return new Range(SPACES).invert(CHARS[0]);
        case 'w': return new Range(WORDS);
        case 'W': return new Range(WORDS).invert(CHARS[0]);
        case '': return stream.error('another character after "\\"');
        default: {
          var code = current.charCodeAt(0);

          if ( code > 47 && code < 58 ) {
            return new Reference(matchNumber(stream, current));
          }

          return new Range([ code ]);
        }
      }
    }
    default: return new Range([ current.charCodeAt(0) ]);
  }
}

var parse = function parse ( regex, stream ) {
  var stream = stream || new Stream(regex);

  while ( !stream.isDone() ) {
    var token = next(regex.tokens, stream);

    if ( token instanceof Error ) return token;

    regex.tokens.push(token);
  }
}

var Regex = module.exports = function Regex ( string, mode, stream ) {
  var regex = this instanceof Regex ? this : Object.create(Regex);

  regex.string = string;
  regex.mode = mode;
  regex.tokens = [ ];

  var error = parse(regex, stream);

  if ( error ) if ( this == regex ) throw error; else return error;

  return regex;
}

Regex.prototype.explain = function explain ( shift ) {
  var content = [ ];

  for ( var i = 0; i < this.tokens.length; i += 1 ) {
    content.push(this.tokens[i].explain(shift);
  }

  return content.join('\n');
}
