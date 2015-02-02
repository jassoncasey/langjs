
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

%start file

%{
var syn = require('./syntax');
%}

%%

file: stmts EOF {
  return $1;
};

stmts: stmts stmt {
      $1.push($2);
      $$ = $1;
     } | {
      $$ = syn.mkTerm(syn.symbol.SEQ);
     };

stmt: expr ';' {
      $$ = $1;
    } | def ';' {
      $$ = $1;
    };

def: 'DEF' decl_expr {
    $$ = syn.mkTerm(syn.symbol.DEF, $2);
   } | 'DEF' decl_expr '=' expr {
    $$ = syn.mkTerm(syn.symbol.DEF, $2, $4);
   };

assign: decl_expr '=' expr {
        $$ = syn.mkBinary(syn.ASSIGN, $1, $3);
      };

expr: lor_expr
    | assign
    | block
    | while_expr
    | if_expr
    | switch_expr
    | return_expr;

exprs: exprs ',' expr {
      $1.push($3);
      $$ = $1;
     } | expr {
      $$ = syn.mkTerm(syn.symbol.SEQ, $1);
     };

while_expr: WHILE '(' expr ')' block {
            $$ = syn.mkBinary(syn.WHILE, $3, $5);
          };

if_expr: IF '(' expr ')' stmt {
        $$ = syn.mkTrinary(syn.CONDITIONAL, $3, $5);
       } | IF '(' expr ')' stmt ELSE stmt {
        $$ = syn.mkTrinary(syn.CONDITIONAL, $3, $5, $7);
       };

switch_expr: SWITCH '(' expr ')' '{' cases '}' {
            $$ = syn.mkBinary(syn.SWITCH, $3, $6);
           };

cases: cases case {
      $1.push($2);
      $$ = $1;
     } | case {
      $$ = syn.mkTerm(syn.symbol.SEQ, $1);
     }; 

case: CASE primary_expr ':' stmts {
      $$ = syn.mkBinary(syn.CASE, $2, $4);
    };

block: '{' stmts '}' {
      $$ = syn.mkUnary(syn.BLOCK, $2);
     };

return_expr: RETURN expr {
            $$ = syn.mkUnary(syn.RETURN, $2);
           };

lor_expr: lor_expr IF land_expr {
          $$ = syn.mkBinary(syn.IF, $1, $3);
        } | lor_expr LOR land_expr {
          $$ = syn.mkBinary(syn.LOR, $1, $3);
        } | land_expr {
          $$ = $1;
        };

land_expr: land_expr LAND decl_expr {
          $$ = syn.mkBinary(syn.LAND, $1, $3);
         } | decl_expr {
          $$ = $1;
         };

or_expr: or_expr '|' xor_expr {
        $$ = syn.mkBinary(syn.OR, $1, $3);
       } | xor_expr {
        $$ = $1;
       };

xor_expr: xor_expr '^' and_expr {
          $$ = syn.mkBinary(syn.XOR, $1, $3);
        } | and_expr {
          $$ = $1;
        };

and_expr: and_expr '&' eq_expr {
          $$ = syn.mkBinary(syn.AND, $1, $3);
        } | eq_expr {
          $$ = $1;
        };

eq_expr: EQ rel_expr {
        $$ = syn.mkUnary(syn.EQ, $2);
       } | NEQ rel_expr {
        $$ = syn.mkUnary(syn.NEQ, $2);
       } | eq_expr EQ rel_expr {
        $$ = syn.mkBinary(syn.EQ, $1, $3);
       } | eq_expr NEQ rel_expr {
        $$ = syn.mkBinary(syn.NEQ, $1, $3);
       } | rel_expr {
        $$ = $1;
       };

rel_expr: '<' shift_expr {
          $$ = syn.mkUnary(syn.LT, $2);
        } | '>' shift_expr {
          $$ = syn.mkUnary(syn.GT, $2);
        } | '<=' shift_expr {
          $$ = syn.mkUnary(syn.LTEQ, $2);
        } | '>=' shift_expr {
          $$ = syn.mkUnary(syn.GTEQ, $2);
        } | rel_expr '<' shift_expr {
            $$ = syn.mkBinary(syn.LT, $1, $3);
        } | rel_expr '>' shift_expr {
            $$ = syn.mkBinary(syn.GT, $1, $3);
        } | rel_expr '<=' shift_expr {
            $$ = syn.mkBinary(syn.LTEQ, $1, $3);
        } | rel_expr '>=' shift_expr {
            $$ = syn.mkBinary(syn.GTEQ, $1, $3);
        } | shift_expr {
          $$ = $1;
        };

shift_expr: shift_expr '<<' add_expr {
            $$ = syn.mkBinary(syn.LSHIFT, $1, $3);
          } | shift_expr '>>' add_expr {
            $$ = syn.mkBinary(syn.RSHIFT, $1, $3);
          } | add_expr {
            $$ = $1;
          };

add_expr: add_expr '+' mult_expr {
          $$ = syn.mkBinary(syn.PLUS, $1, $3);
        } | add_expr '-' mult_expr {
          $$ = syn.mkBinary(syn.MINUS, $1, $3);
        } | mult_expr {
          $$ = $1;
        }; 

mult_expr: mult_expr '*' unary_expr {
          $$ = syn.mkBinary(syn.MULT, $1, $3);
         } | mult_expr '/' unary_expr {
          $$ = syn.mkBinary(syn.DIV, $1, $3);
         } | mult_expr '%' unary_expr {
          $$ = syn.mkBinary(syn.MOD, $1, $3);
         } | unary_expr {
          $$ = $1;
         };

unary_expr: unary_op unary_expr {
            $$ = syn.mkUnary($1, $2);
          }
          | postfix_expr {
            $$ = $1;
          };

unary_op: '~' {
          $$ = syn.TILDE;
        } | '!' {
          $$ = syn.BANG;     
        };

decl_expr: decl_expr ':' or_expr {
          $$ = syn.mkTerm(syn.symbol.TERM, $1, $3);
         } | decl_expr '::' or_expr {
          $$ = syn.mkTerm(syn.symbol.TYPE, $1, $3);
         } | decl_expr ':::' or_expr {
          $$ = syn.mkTerm(syn.symbol.KIND, $1, $3);
         } | decl_expr RARROW or_expr {
          $$ = syn.mkBinary(syn.RARROW, $1, $3);
         } | or_expr {
          $$ = $1;
         };

postfix_expr: postfix_expr '(' ')' {
              $$ = syn.mkBinary(syn.CALL, $1, null);
            } | postfix_expr '(' exprs ')' {
              $$ = syn.mkBinary(syn.CALL, $1, $3);
            } | postfix_expr '{' '}' {
              $$ = syn.mkBinary(syn.BRACE, $1, null);
            } | postfix_expr '{' exprs '}' {
              $$ = syn.mkBinary(syn.BRACE, $1, $3);
            } | postfix_expr '[' expr ']' {
              $$ = syn.mkBinary(syn.ARRAY, $1, $3); 
            } | postfix_expr '.' IDENT {
              $$ = syn.mkBinary(syn.PROJECTION, $1, $3);
            } | postfix_expr DOTDOT primary_expr {
              $$ = syn.mkBinary(syn.RANGE, $1, $3);
            } | primary_expr {
              $$ = $1;
            };

primary_expr: IDENT {
              $$ = syn.mkTerm(syn.symbol.X, yytext);
            } | literal {
              $$ = $1; 
            } | '(' exprs ')' {
              $$ = $1;
            } | '(' ')' {
              $$ = null;
            };
    
literal: HEX {
  $$ = syn.mkUInt(yytext, 'hex');
} | DIGITS {
  $$ = syn.mkUInt(yytext);
} | CHAR {
  $$ = syn.mkChar(yytext);
} | STRING {
  $$ = syn.mkStr(yytext);
} | MAC_ADDR {
  $$ = syn.mkMAC_Addr(yytext);
} | IPV4_ADDR {
  $$ = syn.mkIPv4_Addr(yytext);
};

%%

/* Use the node module exporter */
exports.parser = parser;

