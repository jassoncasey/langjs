
%lex

hex     0x[0-9a-fA-F]+
digits  [0-9]+
ident   [a-zA-Z_][a-zA-Z_0-9]*

%{
var _ = require('underscore');
var keywords = {
  /* Environment manipulation operations */
  'def':      'DEF',
  'while':    'WHILE',
  'if':       'IF',
  'return':   'RETURN'
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

/* Handle character literals */
\'[^\']\'   return "CHAR";
\"[^\"]+\"  return "STRING";
\"\"        return "STRING";

/* Handle identifiers, upconvert any keywords */
[a-zA-Z_][a-zA-Z_0-9]* {
  if(_(keywords).has(yytext)) { return keywords[yytext]; }
  else { return "IDENT"; }
}

"->" return "RARROW";
".." return "DOTDOT";
":::" return ":::";
"::" return "::";

"&&" return "LAND";
"||" return "LOR";

"==" return "EQ";
"!=" return "NEQ"

"<=" return "<=";
">=" return ">=";

"<<" return "<<";
">>" return ">>";

"." return ".";
"=" return "=";
"," return ",";
":" return ":";
";" return ";";
"?" return "?";

"(" return "(";
")" return ")";
"[" return "[";
"]" return "]";
"{" return "{";
"}" return "}";

"!" return "!";
"~" return "~";
"&" return "&";
"|" return "|";
"^" return "^";

"<" return "<";
">" return ">";

"+" return "+";
"-" return "-";

"*" return "*";
"/" return "/";
"%" return "%";

"\\" return "SLASH";

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

stmt: expr ';' {
};

exprs_comma: exprs_comma ',' expr {
} | expr {
};

expr: def
    | block
    | ret;

def: 'DEF' decl {
} | 'DEF' decl '=' expr {
} |  decl {
};

block: '{' '}' {
} | '{' stmts '}' {
};

ret: 'RETURN' expr {
};

decl: decl ':' arrow {
} | decl '::' arrow {
} | decl ':::' arrow {
} | arrow {
};

arrow: primary 'RARROW' postfix {
} | postfix {
};

postfix: postfix '(' ')' {
} | postfix '(' exprs_comma ')' {
} | primary {
};

primary: IDENT {
} | literal {
} | '(' ')' {
} | '(' exprs_comma ')' {
};

literal: HEX {
} | DIGITS {
} | CHAR {
} | STRING {
} | MAC_ADDR {
} | IPV4_ADDR {
};

%%

/* Use the node module exporter */
exports.parser = parser;

