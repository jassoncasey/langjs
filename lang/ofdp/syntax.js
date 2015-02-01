(function() {
  'use strict';

var _ = require('underscore');

/***************** Utility Wrappers ******************/

function Single(value) {
  this.value = value;
}

Single.prototype.toString = function() {
  return this.value ;
};

function Double(first, second) {
  this.first = first;
  this.second = second;
}

Double.prototype.toString = function() {
  return '(' + this.first + ' ' + this.second + ')';
};

function Triple(first, second, third) {
  this.first = first;
  this.second = second;
  this.third = third;
}

Triple.prototype.toString = function() {
  return '(' + this.first + ' ' + this.second + ' ' + this.third + ')';
};

function Quad(first, second, third, fourth) {
  this.first  = first;
  this.second = second;
  this.third  = third;
  this.fourth = fourth;
}

Quad.prototype.toString = function() {
  return '(' + this.first + ' ' + this.second + ' ' + this.third + this.fourth + ')';
};

/************ Syntax Tree ****************/

function Sequence(seq) {
  if(seq) {
    this.seq = seq;
  } else {
    this.seq = [];
  }
}

Sequence.prototype.push = function(term) {
  this.seq.push(term);
};

Sequence.prototype.toString = function() {
  return _(this.seq).map(function(expr) {
    return expr.toString();
  }).join('\n');
};

function Unary(op, x) {
  Double.call(this, op, x);
}

Unary.prototype             = Object.create(Double.prototype);
Unary.prototype.constructor = Unary;

function Binary(op, x, y) {
  Triple.call(this, op, x, y);
}

Binary.prototype             = Object.create(Triple.prototype);
Binary.prototype.constructor = Binary;

function Trinary(op, x, y, z) {
  Quad.call(this, op, x, y, z);
}

Trinary.prototype             = Object.create(Quad.prototype);
Trinary.prototype.constructor = Trinary;

function Ident(value) {
  Single.call(this, value);
}

Ident.prototype             = Object.create(Single.prototype);
Ident.prototype.constructor = Ident;

/********************* Value Syntax **********************/

function Char(value) {
  Single.call(this, value);
}

Char.prototype = Object.create(Single.prototype);
Char.prototype.constructor = Char;

function Str(value) {
  Single.call(this, value);
}

Str.prototype = Object.create(Single.prototype);
Str.prototype.constructor = Str;

function UInt(value, hex) {
  Single.call(this, value);
  this.hex = hex ? true : false;
}

UInt.prototype             = Object.create(Single.prototype);
UInt.prototype.constructor = UInt;

function MAC_Addr(value) {
  Single.call(this, value);
}

MAC_Addr.prototype             = Object.create(Single.prototype);
MAC_Addr.prototype.constructor = MAC_Addr;

function IPv4_Addr(value) {
  Single.call(this, value);
}

IPv4_Addr.prototype             = Object.create(Single.prototype);
IPv4_Addr.prototype.constructor = IPv4_Addr;

/* Syntax symbol exports */
exports.symbol = {
  SEQ     : "seq",
  X       : "x",
  DEF     : "def",
  ASSIGN  : "=",
  WHILE   : "while",
  COMMA   : ",",
  SWITCH  : "switch",
  CASE    : "case",
  RETURN  : "return",
  BLOCK   : "block",
  IF      : "if",
  CONDITIONAL : "cond",
  LAND    : "and",
  LOR     : "or",
  AND     : "&",
  OR      : "|",
  XOR     : "^",
  EQ      : "==",
  NEQ     : "!=",
  LT      : "<",
  LTEQ    : "<=",
  GT      : ">",
  GTEQ    : ">=",
  LSHIFT  : "<<",
  RSHIFT  : ">>",
  PLUS    : "+",
  MINUS   : "-",
  MULT    : "*",
  DIV     : "/",
  MOD     : "%",
  TILDE   : "~",
  BANG    : "!",
  TERM   : ":",
  TYPE   : "::",
  KIND   : ":::",
  RARROW  : "->",
  PROJECTION : "proj",
  RANGE  : "range",
  CALL    : "call",
  BRACE   : "brace",
  array   : "array"
};

function Term(name) {
  var i;
  this.name = name;
  this.t    = [];
  this.t = Array.prototype.slice.call(arguments);
  this.t.splice(0, 1);
}

Term.prototype.push = function(_t) {
  this.t.push(_t);
};

Term.prototype.toString = function () {
  return "(" + this.name + ' ' + _(this.t).map(function(_t) { 
    return _t.toString(); 
  }).join(", ") + ")";
};

function construct(constructor, args) {
  function F() {
    return constructor.apply(this, args);
  }
  F.prototype = constructor.prototype;
  return new F();
}

exports.mkTerm = function(name) {
  var args = Array.prototype.slice.call(arguments);
  args.splice(0, 1, name);
  function K() {
    return Term.apply(this, args);
  }
  K.prototype = Term.prototype;
  return new K();
};

/* Syntax term factory exports */
exports.mkSequence  = function mkSequence(seq) { return new Sequence(seq); };
exports.mkUnary     = function mkUnary(op, x) { return new Unary(op, x); };
exports.mkBinary    = function mkBinary(op, x, y) { return new Binary(op, x, y); };
exports.mkTrinary   = function mkTrinary(op, x, y, z) { return new Trinary(op, x, y, z); };
exports.mkIdent     = function mkIdent(v) { return new Ident(v); };
exports.mkChar      = function mkChar(v) { return new Char(v); };
exports.mkStr       = function mkStr(v) { return new Str(v); };
exports.mkUInt      = function mkUInt(v, m) { return new UInt(v, m); };
exports.mkMAC_Addr  = function mkMAC_Addr(v) { return new MAC_Addr(v); };
exports.mkIPv4_Addr = function mkIPv4_Addr(v) { return new IPv4_Addr(v); };

})();

