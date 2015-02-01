
%lex

hex     0x[0-9a-fA-F]+
digits  [0-9]+
ident   [a-zA-Z_][a-zA-Z_0-9]*

%{
// JS code necessary for lexing

var keywords = {
};

%}

%%

<<EOF>>   return "EOF";
.+        return "UNKNOWN";

/lex

%start program

%{
// JS code necessary for parsing
%}

%%

program: EOF;

%%

// Use nodejs module exporter
exports.parser = parser;

