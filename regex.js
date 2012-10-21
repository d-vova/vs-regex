/**
 * Copyright (c) 2012 Vladimir's Software. All rights reserved.
 *
 * @fileoverview Regular Expression with expanded functionality for random
 *               string generation and corner case strings computation
 * @author vladimir.darmin@gmail.com
 *
 * @created Thu, Oct 18 2012 - 11:48:14 -0700
 * @updated Thu, Oct 18 2012 - 11:48:14 -0700
 */

var Regex = exports.Regex = require('./lib/Regex');

exports.create = function create ( expression ) {
  return Regex(expression);
}

exports.measure = function measure ( expression ) {
  var regex = Regex(expression);

  return regex instanceof Error ? regex : regex.measure();
}

exports.generate = function generate ( expression ) {
  var regex = Regex(expression);

  return regex instanceof Error ? regex : regex.generate();
}

exports.limits = function limits ( expression ) {
  var regex = Regex(expression);

  return regex instanceof Error ? regex : regex.limits();
}

exports.explain = function explain ( expression ) {
  var regex = Regex(expression);

  return regex instanceof Error ? regex : regex.explain();
}

if ( require.main == module ) {
  var test = {
    'a*{2}b{3,}+c?{4,5}': '{2<={0<=[97]<=Infinity}<=2}{1<={3<=[98]<=Infinity}<=Infinity}{4<={0<=[99]<=1}<=5}',
    '(a*{2}b{3,}+c?{4,5})': '(1:{2<={0<=[97]<=Infinity}<=2}{1<={3<=[98]<=Infinity}<=Infinity}{4<={0<=[99]<=1}<=5})',
    '(?:a*{2}b{3,}+c?{4,5})': '({2<={0<=[97]<=Infinity}<=2}{1<={3<=[98]<=Infinity}<=Infinity}{4<={0<=[99]<=1}<=5})',
    '[a*{2}b{3,}+c?{4,5}]': '[42..44, 50..53, 63, 97..99, 123, 125]',
    '[^a*{2}b{3,}+c?{4,5}]': '[0..41, 45..49, 54..62, 64..96, 100..122, 124, 126..65535]',
    '.|(.)|(?:.)|[.]|[^.]': '[0..65535]|(1:[0..65535])|([0..65535])|[46]|[0..45, 47..65535]',
    '\\b\\B^$': '@b@B@^@$',
    '(\\b\\B^$)': '(1:@b@B@^@$)',
    '(?:\\b\\B^$)': '(@b@B@^@$)',
    '[\\b\\B^$]': '[36, 66, 94, 98]',
    '[^\\b\\B^$]': '[0..35, 37..65, 67..93, 95..97, 99..65535]',
    '(abc)|(?:def)': '(1:[97][98][99])|([100][101][102])',
    '((abc)|(?:def))': '(1:(2:[97][98][99])|([100][101][102]))',
    '(?:(abc)|(?:def))': '((1:[97][98][99])|([100][101][102]))',
    '[(abc)|(?:def)]': '[40, 41, 58, 63, 97..102, 124]',
    '[^(abc)|(?:def)]': '[0..39, 42..57, 59..62, 64..96, 103..123, 125..65535]',
    '\\d\\D\\s\\S\\w\\W': '[48..57][0..47, 58..65535][9..13, 32, 160, 5760, 6158, 8192..8202, 8232, 8233, 8239, 8287, 12288, 65279][0..8, 14..31, 33..159, 161..5759, 5761..6157, 6159..8191, 8203..8231, 8234..8238, 8240..8286, 8288..12287, 12289..65278, 65280..65535][65..90, 97..122][0..64, 91..96, 123..65535]',
    '(\\d\\D\\s\\S\\w\\W)': '(1:[48..57][0..47, 58..65535][9..13, 32, 160, 5760, 6158, 8192..8202, 8232, 8233, 8239, 8287, 12288, 65279][0..8, 14..31, 33..159, 161..5759, 5761..6157, 6159..8191, 8203..8231, 8234..8238, 8240..8286, 8288..12287, 12289..65278, 65280..65535][65..90, 97..122][0..64, 91..96, 123..65535])',
    '(?:\\d\\D\\s\\S\\w\\W)': '([48..57][0..47, 58..65535][9..13, 32, 160, 5760, 6158, 8192..8202, 8232, 8233, 8239, 8287, 12288, 65279][0..8, 14..31, 33..159, 161..5759, 5761..6157, 6159..8191, 8203..8231, 8234..8238, 8240..8286, 8288..12287, 12289..65278, 65280..65535][65..90, 97..122][0..64, 91..96, 123..65535])',
    '[\\d\\D\\s\\S\\w\\W]': '[0..65535]',
    '[^\\d\\D\\s\\S\\w\\W]': '[]',
    '\\1\\23\\x\\y\\z': '(1)(23)[120][121][122]',
    '(\\1\\23\\x\\y\\z)': '(1:(1)(23)[120][121][122])',
    '(?:\\1\\23\\x\\y\\z)': '((1)(23)[120][121][122])',
    '[\\1\\23\\x\\y\\z]': '[49..51, 120..122]',
    '[^\\1\\23\\x\\y\\z]': '[0..48, 52..119, 123..65535]',
    '-|(-)|(?:-)|[-]|[^-]': '[45]|(1:[45])|([45])|[45]|[0..44, 46..65535]',
    'x-|(x-)|(?:x-)|[x-]|[^x-]': '[120][45]|(1:[120][45])|([120][45])|[45, 120]|[0..44, 46..119, 121..65535]',
    '-y|(-y)|(?:-y)|[-y]|[^-y]': '[45][121]|(1:[45][121])|([45][121])|[45, 121]|[0..44, 46..120, 122..65535]',
    'x-y|(x-y)|(?:x-y)|[x-y]|[^x-y]': '[120][45][121]|(1:[120][45][121])|([120][45][121])|[120, 121]|[0..119, 122..65535]',
    '(a(?:b([()[])c)d)': '(1:[97]([98](2:[40, 41, 91])[99])[100])'
  }

  console.log( 'testing' );

  for ( var expression in test ) {
    var correct = test[expression], regex = Regex(expression);

    var value = regex instanceof Error ? regex : regex.explain();

    if ( value != correct ) {
      console.log( '"' + value + '" should equal to "' + correct + '"' );
    }
  }

  console.log( 'done' );

  var r = Regex('\\1{2}-\\2?-\\3{3,4}=a(?:b(?:c)(?:d)e)f', 'i');

  console.log( r.explain(2) );

  for ( var i = 0; i < 10; i += 1 ) console.log( r.generate() );
}
