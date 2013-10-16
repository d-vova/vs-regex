#vs-regex#

Regular Expression with expanded functionality for random string generation and corner case strings computation



##Syntax##

Current implementation supports a subset of regular expression syntax

###position###

`^`, `\b`, `\B`, and `$` are zero-width characters that mark text and word boundaries

`some text` matches `^``\b``some``\B`` ``\b``text``\B``$`

###range###

`.` is a named range representing any character

`\d`, `\D`, `\s`, `\S`, `\w`, and `\W` are named ranges representing subsets that include or exclude digit, whitespace, or word characters

`[...]` and `[^...]` are custom set ranges representing subsets that include or exclude indicated subranges (single value and named).

`-` connecting two single value subranges represents the minimal interval including both values

Any unmatched and escaped characters in regular expression represent single value ranges

###group###

`(...)` is a capturing regular expression group that can be treated as a single reusable element

`(?:...)` is a non-capturing regular expression group that can be treated as a single unique element

###reference###

Escaped natural numbers represent captured group elements

`(a|b|c) == \\1` matches `a == a`, `b == b`, and `c == c`

###quantifier###

`?`, `*`, and `+` are quatifiers of the preceding elements representing at most one, any number, and at least one repetition

`{n}`, `{n,}`, and `{n,m}` are quantifiers of the preceding elements representing exactly `n`, at least `n`, and between `n` and `m` repetitions



##Module##

```javascript
var regex = require('vs-regex');
```

###Regex###

Underlying regular expression class that provides all the functional capabilities to the module

```javascript
var Regex = require('vs-regex').Regex;
```

###create###

A new instance of `Regex` object can be created by using a module shortcut:

```javascript
var r = regex.create('regular expression');
```

or simply by using `new` on the class:

```javascript
var r = new Regex('regular expression');
```

###match###

Check if regular expression matches a string:

```javascript
//                 (   space |   vowel  |        consonant       )*
var r = new Regex('(?:([\\s])|([aeiouy])|([bcdfghjklmnpqrstvwxz]))*');

console.log( r.match('123 some text 456') );
console.log( r.match('123456789') );
```

Output:
```
{
  index: 3,
  input: "123 some text 456",
  "0": [
    { value: " some text ", index: 3 }
  ]
  "1": [
    { value: " ", index: 3 },
    { value: " ", index: 8 },
    { value: " ", index: 13 }
  ],
  "2": [
    { value: "o", index: 5 },
    { value: "e", index: 7 },
    { value: "e", index: 10 }
  ],
  "3": [
    { value: "s", index: 4 },
    { value: "m", index: 6 },
    { value: "t", index: 9 },
    { value: "x", index: 11 },
    { value: "t", index: 12 }
  ]
}

null
```

###measure###

Calculate the minimum and maximum length of the strings matching regular expression

###generate###

Generate a random string that matches regular expression

###borders (not implemented)###

Compute a set of strings that represent corner cases for regular expression

###explain###

During the times when you have no idea why a regular expression does not behave the way you expect, it can be helpful to take a peek at the regular expression parse tree.



##License##

MIT
