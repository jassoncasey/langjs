
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
var syn = require('./syntax');
%}

%%

program: stmts EOF {
  return $1;
};

stmts: stmts stmt {
      $1.push($2);
      $$ = $1;
     } | {
      $$ = new syn.Seq();
     };

stmt: expr ';' {
      $$ = $1;
    } | def ';' {
      $$ = $1;
    };

def: 'DEF' decl_expr {
  $$ = $2;
} | 'DEF' decl_expr '=' expr {
  $$ = new syn.Store($2, $4);
};

expr: lor_expr
    | assign
    | block
    | while_expr
    | if_expr
    | return_expr;

exprs: exprs ',' expr {
  $1.push($3);
  $$ = $1;
} | expr {
  $$ = new syn.Seq($1);
};

assign: decl_expr '=' expr {
  $$ = new syn.Store($1, $3);
};

while_expr: WHILE '(' expr ')' block {
  $$ = new syn.While($3, $5);
};

if_expr: IF '(' expr ')' stmt {
  $$ = new syn.Conditional($3, $5, null);
} | IF '(' expr ')' stmt ELSE stmt {
  $$ = new syn.Conditional($3, $5, $7);
};

block: '{' stmts '}' {
  $$ = $2;
};

return_expr: RETURN expr {
  $$ = new syn.Return($2);
};

lor_expr: lor_expr IF land_expr {
  $$ = new syn.Binary($2, $1, $3);
} | lor_expr LOR land_expr {
  $$ = new syn.Binary($2, $1, $3);
} | land_expr {
  $$ = $1;
};

land_expr: land_expr LAND decl_expr {
  $$ = new syn.Binary($2, $1, $3);
} | decl_expr {
  $$ = $1;
};

or_expr: or_expr '|' xor_expr {
  $$ = new syn.Binary($2, $1, $3);     
} | xor_expr {
  $$ = $1;
};

xor_expr: xor_expr '^' and_expr {
  $$ = new syn.Binary($2, $1, $3);
} | and_expr {
  $$ = $1;
};

and_expr: and_expr '&' eq_expr {
  $$ = new syn.Binary($2, $1, $3);
} | eq_expr {
  $$ = $1;
};

eq_expr: EQ rel_expr {
  $$ = new syn.Unary($1, $2);
} | NEQ rel_expr {
  $$ = new syn.Unary($1, $2);
} | eq_expr EQ rel_expr {
  $$ = new syn.Binary($2, $1, $3);
} | eq_expr NEQ rel_expr {
  $$ = new syn.Binary($2, $1, $3);
} | rel_expr {
  $$ = $1;
};

rel_expr: '<' shift_expr {
  $$ = new syn.Unary($1, $2);
} | '>' shift_expr {
  $$ = new syn.Unary($1, $2);
} | '<=' shift_expr {
  $$ = new syn.Unary($1, $2);
} | '>=' shift_expr {
  $$ = new syn.Unary($1, $2);
} | rel_expr '<' shift_expr {
  $$ = new syn.Binary($2, $1, $3);
} | rel_expr '>' shift_expr {
  $$ = new syn.Binary($2, $1, $3);
} | rel_expr '<=' shift_expr {
  $$ = new syn.Binary($2, $1, $3);
} | rel_expr '>=' shift_expr {
  $$ = new syn.Binary($2, $1, $3);
} | shift_expr {
  $$ = $1;
};

shift_expr: shift_expr '<<' add_expr {
  $$ = new syn.Binary($2, $1, $3);
} | shift_expr '>>' add_expr {
  $$ = new syn.Binary($2, $1, $3);
} | add_expr {
  $$ = $1;
};

add_expr: add_expr '+' mult_expr {
  $$ = new syn.Binary($2, $1, $3);
} | add_expr '-' mult_expr {
  $$ = new syn.Binary($2, $1, $3);
} | mult_expr {
  $$ = $1;
}; 

mult_expr: mult_expr '*' unary_expr {
  $$ = new syn.Binary($2, $1, $3);
} | mult_expr '/' unary_expr {
  $$ = new syn.Binary($2, $1, $3);
} | mult_expr '%' unary_expr {
  $$ = new syn.Binary($2, $1, $3);
} | unary_expr {
  $$ = $1;
};

unary_expr: unary_op unary_expr {
  $$ = new syn.Unary($1, $2);
} | postfix_expr {
  $$ = $1;
};

unary_op: '~' {
  $$ = syn.TILDE;
} | '!' {
  $$ = syn.BANG;     
};

decl_expr: decl_expr ':' or_expr {
  $$ = new syn.BindTerm($1, $3);
} | decl_expr '::' or_expr {
  $$ = new syn.BindType($1, $3);
} | decl_expr ':::' or_expr {
  $$ = new syn.BindKind($1, $3);
} | decl_expr RARROW or_expr {
  $$ = new syn.ArrowType($1, $3);
} | or_expr {
  $$ = $1;
};

postfix_expr: postfix_expr '(' ')' {
  $$ = new syn.Call($1, null);
} | postfix_expr '(' exprs ')' {
  $$ = new syn.Call($1, $3);
} | primary_expr {
  $$ = $1;
};

primary_expr: IDENT {
  $$ = new syn.Variable(yytext);
} | literal {
  $$ = $1; 
} | '(' exprs ')' {
  $$ = $1;
} | '(' ')' {
  $$ = new syn.Seq();
};
    
literal: HEX {
  $$ = new syn.Constant('nat', yytext);
} | DIGITS {
  $$ = new syn.Constant('nat', yytext);
} | CHAR {
  $$ = new syn.Constant('char', yytext);
} | STRING {
  $$ = new syn.Constant('string', yytext);
} | MAC_ADDR {
  $$ = new syn.Constant('mac', yytext);
} | IPV4_ADDR {
  $$ = new syn.Constant('ipv4', yytext);
};

%%

/* Use the node module exporter */
exports.parser = parser;

