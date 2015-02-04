
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

/* Catch the end of the file, otherwise return trash */
<<EOF>>   return "EOF";
.+        return "UNKNOWN";

/lex

%start program

%{
var ir = require('./ir');
%}

%%

program: stmts EOF {
  return $1;
};

stmts: stmts stmt {
  $1.push($2);
  $$ = $1;
} | {
  $$ = new ir.Seq();
};

stmt: expr ';' {
  $$ = $1;
} | def ';' {
  $$ = $1;
};

def: 'DEF' bind {
  $$ = $2;
} | 'DEF' bind '=' expr {
  $$ = new ir.Store($2, $4);
};

expr: lor
    | assign
    | block
    | while_
    | if_
    | return_;

exprs: exprs ',' expr {
  $1.push($3);
  $$ = $1;
} | expr {
  $$ = [$1];
};

assign: bind '=' expr {
  $$ = new ir.Store($1, $3);
};

while_: WHILE '(' expr ')' block {
  $$ = new ir.While($3, $5);
};

if_: IF '(' expr ')' stmt {
  $$ = new ir.Conditional($3, $5, null);
} | IF '(' expr ')' stmt ELSE stmt {
  $$ = new ir.Conditional($3, $5, $7);
};

block: '{' stmts '}' {
  $$ = new ir.Block($2);
};

return_: RETURN expr {
  $$ = new ir.Return($2);
};

lor: lor IF land {
  $$ = new ir.Binary($2, $1, $3);
} | lor LOR land {
  $$ = new ir.Binary($2, $1, $3);
} | land {
  $$ = $1;
};

land: land LAND or {
  $$ = new ir.Binary($2, $1, $3);
} | or {
  $$ = $1;
};

or: or '|' xor {
  $$ = new ir.Binary($2, $1, $3);     
} | xor {
  $$ = $1;
};

xor: xor '^' and {
  $$ = new ir.Binary($2, $1, $3);
} | and {
  $$ = $1;
};

and: and '&' eq {
  $$ = new ir.Binary($2, $1, $3);
} | eq {
  $$ = $1;
};

eq: EQ rel {
  $$ = new ir.Unary($1, $2);
} | NEQ rel {
  $$ = new ir.Unary($1, $2);
} | eq EQ rel {
  $$ = new ir.Binary($2, $1, $3);
} | eq NEQ rel {
  $$ = new ir.Binary($2, $1, $3);
} | rel {
  $$ = $1;
};

rel: '<' shift {
  $$ = new ir.Unary($1, $2);
} | '>' shift {
  $$ = new ir.Unary($1, $2);
} | '<=' shift {
  $$ = new ir.Unary($1, $2);
} | '>=' shift {
  $$ = new ir.Unary($1, $2);
} | rel '<' shift {
  $$ = new ir.Binary($2, $1, $3);
} | rel '>' shift {
  $$ = new ir.Binary($2, $1, $3);
} | rel '<=' shift {
  $$ = new ir.Binary($2, $1, $3);
} | rel '>=' shift {
  $$ = new ir.Binary($2, $1, $3);
} | shift {
  $$ = $1;
};

shift: shift '<<' add {
  $$ = new ir.Binary($2, $1, $3);
} | shift '>>' add {
  $$ = new ir.Binary($2, $1, $3);
} | add {
  $$ = $1;
};

add: add '+' mult {
  $$ = new ir.Binary($2, $1, $3);
} | add '-' mult {
  $$ = new ir.Binary($2, $1, $3);
} | mult {
  $$ = $1;
}; 

mult: mult '*' unary {
  $$ = new ir.Binary($2, $1, $3);
} | mult '/' unary {
  $$ = new ir.Binary($2, $1, $3);
} | mult '%' unary {
  $$ = new ir.Binary($2, $1, $3);
} | unary {
  $$ = $1;
};

unary: unary_op unary {
  $$ = new ir.Unary($1, $2);
} | arrow {
  $$ = $1;
};

unary_op: '~' {
  $$ = $1;
} | '!' {
  $$ = $1;
};

arrow: bind RARROW arrow {
  $$ = new ir.ArrowType($1, $3);
} | bind {
  $$ = $1;
};

bind: postfix ':' arrow {
  $$ = new ir.BindTerm($1, $3);
} | postfix '::' arrow {
  $$ = new ir.BindType($1, $3);
} | postfix ':::' arrow {
  $$ = new ir.BindKind($1, $3);
} | postfix {
  $$ = $1;
};

postfix: postfix '(' ')' {
  $$ = new ir.Call($1, []);
} | postfix '(' exprs ')' {
  $$ = new ir.Call($1, $3);
} | primary {
  $$ = $1;
};

primary: IDENT {
  $$ = new ir.Variable(yytext);
} | literal {
  $$ = $1; 
} | '(' exprs ')' {
  $$ = $2;
} | '(' ')' {
  $$ = [];
};
    
literal: HEX {
  $$ = new ir.Constant('nat', yytext);
} | DIGITS {
  $$ = new ir.Constant('nat', yytext);
} | CHAR {
  $$ = new ir.Constant('char', yytext);
} | STRING {
  $$ = new ir.Constant('string', yytext);
} | MAC_ADDR {
  $$ = new ir.Constant('mac', yytext);
} | IPV4_ADDR {
  $$ = new ir.Constant('ipv4', yytext);
};

%%

/* Use the node module exporter */
exports.parser = parser;

