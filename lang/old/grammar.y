
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
var stlc = require('./stlc');
%}

%%

file: stmts EOF {
  return $1;
} | EOF {
  return null;
};

stmts: stmts stmt {
  $1.push($2);
  $$ = $1;
} | stmt {
  $$ = new stlc.Sequence($1);
};

stmt: expr ';' {
  $$ = $1;
};

exprs_comma: exprs_comma ',' expr {
  $1.push($3);
  $$ = $1; 
} | expr {
  $$ = new stlc.Sequence($1);
};

expr: def
    | block
    | ret;

def: 'DEF' decl {
  $$ = $2;
} | 'DEF' decl '=' expr {
  $$ = new stlc.Store($1, $3);
} |  decl {
  $$ = $1;
};

block: '{' '}' {
  return new stlc.Sequence();
} | '{' stmts '}' {
  return $2;
};

ret: 'RETURN' expr {
  return new stlc.Return ($2);
};

decl: decl ':' arrow {
  $$ = new stlc.TermBinding($1, $3);
} | decl '::' arrow {
  $$ = new stlc.TypeBinding($1, $3);
} | decl ':::' arrow {
  $$ = new stlc.KindBinding($1, $3);
} | arrow {
  $$ = $1;
};

arrow: primary 'RARROW' postfix {
  $$ = new stlc.Arrow($1, $3);
} | postfix {
  $$ = $1;
};

postfix: postfix '(' ')' {
  $$ = new stlc.Application($1, null);
} | postfix '(' exprs_comma ')' {
  $$ = new stlc.Application($1, $3);
} | primary {
  $$ = $1;
};

primary: IDENT {
  $$ = new stlc.Variable($1);
} | literal {
  $$ = $1;
} | '(' ')' {
  $$ = new stlc.Sequence();
} | '(' exprs_comma ')' {
  $$ = $2;
};

literal: HEX {
  $$ = new stlc.Constant('nat_h', yytext);
} | DIGITS {
  $$ = new stlc.Constant('nat', yytext);
} | CHAR {
  $$ = new stlc.Constant('char', yytext);
} | STRING {
  $$ = new stlc.Constant('string', yytext);
} | MAC_ADDR {
  $$ = new stlc.Constant('mac', yytext);
} | IPV4_ADDR {
  $$ = new stlc.Constant('ipv4', yytext);
};

%%

/* Use the node module exporter */
exports.parser = parser;

