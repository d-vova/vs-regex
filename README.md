#vs-regex#

Regular Expression with expanded functionality for random string generation and corner case strings computation


* * *


#Grammar#

Current implementation supports a subset of regular expression syntax

##Position##

`^`, `\b`, `\B`, and `$` are zero-width characters that mark text and word boundaries

`some text` matches `^``\b``some``\B`` ``\b``text``\B``$`

##Range##

`.` is a named range representing any character

`\d`, `\D`, `\s`, `\S`, `\w`, and `\W` are named ranges representing subsets that include or exclude digit, whitespace, or word characters

`[...]` and `[^...]` are custom set ranges representing subsets that include or exclude indicated subranges (single value and named).

`-` connecting two single value subranges represents the minimal interval including both values

Any unmatched and escaped characters in regular expression represent single value ranges

##Group##

`(...)` is a capturing regular expression group that can be treated as a single reusable element

`(?:...)` is a non-capturing regular expression group that can be treated as a single unique element

##Reference##

Escaped natural numbers represent captured group elements

`(a|b|c) == \\1` matches `a == a`, `b == b`, and `c == c`

##Quantifier##

`?`, `*`, and `+` are quatifiers of the preceding elements representing at most one, any number, and at least one repetition

`{n}`, `{n,}`, and `{n,m}` are quantifiers of the preceding elements representing exactly `n`, at least `n`, and between `n` and `m` repetitions


* * *


#Functionality#

##Match##

##Generate##

##Borders##


* * *


#License#

MIT
