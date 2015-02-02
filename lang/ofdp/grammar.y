
%lex

%{
var _ = require('underscore');

var keywords = {
  /* Environment manipulation operations */
};
%}

%%

/* Skip any whitespace */
[ \t\n]+  {}

/* Network primitive value structure */
([0-9a-fA-F]{2}(\-|\:)){5}[0-9a-fA-F]{2} return "MAC_ADDR";
([0-9]{1,3}\.){3}[0-9]{1,3}              return "IPV4_ADDR";

/* Handle uint literals */
0x[0-9a-fA-F]+          return "HEX";
[0-9]+                  return "DIGITS";

/* Handle identifiers, upconvert any keywords */
[a-zA-Z_][a-zA-Z_0-9]* {
  if(_(keywords).has(yytext)) { return keywords[yytext]; }
  else { return "IDENT"; }
}

"->" return "RARROW";
"=" return "=";
";" return ";";
"*" return "*"; 
"(" return "(";
")" return ")";
"/" return "/";

/* Catch the end of the file, otherwise return trash */
<<EOF>>   return "EOF";
.+        return "UNKNOWN";

/lex

%start file

%{
%}

%%

file: stmts EOF {
} | EOF {
};

stmts: stmts stmt {
} | stmt {
};

stmt: match_set;

match_set: match_set ',' match
         | match;

match: IDENT
     | IDENT '(' ')'
     | IDENT '(' match_fields ')';

match_fields: match_fields ',' match_field
            | match_field;

match_field: IDENT
           | IDENT '=' classifier;

classifier: '*'
          | literal
          | literal '/' literal
          | literal literal;

literal: HEX {
} | DIGITS {
} | MAC_ADDR {
} | IPV4_ADDR {
};

%%

/* Use the node module exporter */
exports.parser = parser;

