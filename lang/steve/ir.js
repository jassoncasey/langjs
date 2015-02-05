(function() {
  'use strict';

var _ = require('underscore');
var pr = require('./printer');
var types = require('./types');

function noop() {}

function Visitor() {}


/*
 * Constant - constant/literal in the language
 *
 * Examples: 1, -1, true, 'c', 'im a literal', ...
 */
function Constant(name, value) {
  this.name  = name;
  this.value = value;
}

// Visitor callback
Constant.prototype.accept = function(v) {
  v.constant(this);
};

// Generic constant visitor
Visitor.prototype.constant = noop;

/*
 * Variable - symbol referencing a value
 *
 * Examples: x, foo, dostuff, ...
 */
function Variable(name) {
  this.name = name;
}

// Visitor callback
Variable.prototype.accept = function(v) {
  v.variable(this);
};

// Generic variable visitor
Visitor.prototype.variable = noop;

// Import the simple type
var SimpleType               = types.SimpleType;
Visitor.prototype.simpleType = types.visitSimpleType;

// Import the arrow type
var ArrowType               = types.ArrowType;
Visitor.prototype.arrowType = types.visitArrow;

/*
 * Seq - sequence of expressions
 *
 * Example: 1; 1+2; dostuff(1, 2);
 */
function Seq(expr) {
  if(_(expr).isArray()) {
    this.exprs = expr;
  } else if(_(expr).isObject()) {
    this.exprs = [expr];
  } else {
    this.exprs = [];
  }
}

// Add an expression to the sequence
Seq.prototype.push = function(expr) {
  this.exprs.push(expr);
};

// Visitor callback
Seq.prototype.accept = function(v) {
  v.seq(this);
};

// Generic sequence visitor
Visitor.prototype.seq = function(seq) {
  _(seq.exprs).each(function(expr) {
    expr.accept(this);
  }, this);
};

/*
 * BindTerm - bind a symbol to a type
 *
 * Examples: x: int, y: nat, z: bool
 */
function BindTerm(name, type) {
  this.name = name;
  // Transform any variables to simple types
  if(type instanceof Variable) {
    type = new SimpleType(type.name);
  }
  this.type = type;
}

// Visitor callback
BindTerm.prototype.accept = function(v) {
  v.bindTerm(this);
};

// Generic bind term visitor
Visitor.prototype.bindTerm = function(bind) {
  bind.type.accept(this);
};

/*
 * BindType - bind a type symbol to a kind
 *
 * Examples: Header:: typename; Coordinates:: Pair(int, int);
 */
function BindType(name, kind) {
  this.name = name;
  this.kind = kind;
}

// Visitor callback
BindType.prototype.accept = function(v) {
  v.bindType(this);
};

// Generic bind type visitor
Visitor.prototype.bindType = function(bind) {
  bind.kind.accept(this);
};

/*
 * BindKind - bind a kind symbol to a kind
 *
 * Examples: Vector::: (T:: typename) -> typename;
 */
function BindKind(name, kind) {
  this.name = name;
  this.kind = kind;
}

// Visitor callback
BindKind.prototype.accept = function(v) {
  v.bindKind(this);
};

// Generic bind kind visitor
Visitor.prototype.bindKind = function(bind) {
  bind.kind.accept(this);
};

/*
 * Store - store an expression, type, or kind value 
 *         with a symbol location
 */
function Store(name, expr) {
  this.name = name;
  this.expr = expr;
}

// Visitor callback
Store.prototype.accept = function(v) {
  v.store(this);
};

// Generic store visitor
Visitor.prototype.store = function(store) {
  store.name.accept(this);
  store.expr.accept(this);
};

/*
 * Conditional - standarnd branching conditional expression
 *
 * Examples: if(predicate) then { expr } else { expr }
 */
function Conditional(pred, thenExpr, elseExpr) {
  this.pred      = pred;
  this.thenExpr = thenExpr;
  this.elseExpr = elseExpr;
}

// Visitor callback
Conditional.prototype.accept = function(v) {
  v.conditional(this);
};

// Generic conditional visitor
Visitor.prototype.conditional = function(conditional) {
  conditional.pred.accept(this);
  conditional.thenExpr.accept(this);
  if(conditional.elseExpr) {
    conditional.elseExpr.accept(this);
  }
};

/*
 * Block - lexically scoped container of expressions
 *
 * Example: { x+1; 1; }
 */
function Block(body) {
  this.body = body;
}

// Visitor callback
Block.prototype.accept = function(v) {
  v.block(this);
};

// Generic block visitor
Visitor.prototype.block = function(block) {
  block.body.accept(this);
};

/*
 * While - standard while loop expression
 *
 * Example: while(predicate) { ... do stuff ... }
 */
function While(pred, body) {
  this.pred = pred;
  this.body = body;
}

// Visitor callback
While.prototype.accept = function(v) {
  v.while_(this);
};

// Generic while visitor
Visitor.prototype.while_ = function(while_) {
  while_.pred.accept(this);
  while_.body.accept(this);
};

/*
 * Return - return control flow from a function 
 *
 * Example: return -1;
 */
function Return(expr) {
  this.expr = expr;
}

// Visitor callback
Return.prototype.accept = function(v) {
  v.return_(this);
};

// Generic return visitor
Visitor.prototype.return_ = function(return_) {
  return_.expr.accept(this);
};

/*
 * Unary - unary operation wrapper
 * 
 * Examples: -1, !x, ~0x0f, ..
 */
function Unary(op, expr) {
  this.op   = op;
  this.expr = expr;
}

// Visitor callback
Unary.prototype.accept = function(v) {
  v.unary(this);
};

// Generic unary visitor
Visitor.prototype.unary = function(unary) {
  unary.expr.accept(this);
};

/*
 * Binary - binary operation wrapper
 *
 * Examples: 1 + x; 0x0ff << 2; ..
 */
function Binary(op, lhs, rhs) {
  this.op  = op;
  this.lhs = lhs;
  this.rhs = rhs;
}

// Visitor callback
Binary.prototype.accept = function(v) {
  v.binary(this);
};

// Generic binary visitor
Visitor.prototype.binary = function(binary) {
  binary.lhs.accept(this);
  binary.rhs.accept(this);
};

/*
 * Func - function expression
 *
 * Example: id(x: int) -> int = { return x; }
 */
function Func(arrow, body) {
  this.arrow = arrow;
  this.body  = body;
}

// Visitor callback
Func.prototype.accept = function(v) {
  v.func(this);
};

// Generic function visitor
Visitor.prototype.func = function(func) {
  func.arrow.accept(this);
  func.body.accept(this);
};

/*
 * Call - function invocation
 *
 * Examples: x(), foo(1, x), ...
 */
function Call(name, args) {
  this.name   = name;
  this.args = args ? args : [];
}

// Visitor callback
Call.prototype.accept = function(v) {
  v.call(this);
};

// Generic call visitor
Visitor.prototype.call = function(call) {
  _(call.args).each(function(arg) {
    arg.accept(this);
  }, this);
};

exports.Constant    = Constant;
exports.Variable    = Variable;
exports.SimpleType  = SimpleType;
exports.ArrowType   = ArrowType;
exports.Seq         = Seq;
exports.BindTerm    = BindTerm;
exports.BindType    = BindType;
exports.BindKind    = BindKind;
exports.Store       = Store;
exports.Conditional = Conditional;
exports.Block       = Block;
exports.While       = While;
exports.Return      = Return;
exports.Unary       = Unary;
exports.Binary      = Binary;
exports.Func        = Func;
exports.Call        = Call;

exports.Visitor = Visitor;

})();

