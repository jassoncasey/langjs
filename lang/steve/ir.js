(function() {
  'use strict';

var _ = require('underscore');
var pr = require('./printer');

function Visitor() {}

function Constant(name, value) {
  this.name  = name;
  this.value = value;
}

Constant.prototype.accept = function(v) {
  v.constant(this);
};

Visitor.prototype.constant = function() {};

function Variable(name) {
  this.name = name;
}

Variable.prototype.accept = function(v) {
  v.variable(this);
};

Visitor.prototype.variable = function() {};

function SimpleType(name) {
  this.name = name;
}

SimpleType.prototype.accept = function(v) {
  v.simpleType(this);
};

Visitor.prototype.simpleType = function() {};

function ArrowType(argTypes, retType) {
  this.argTypes = argTypes;
  this.retType  = retType;
}

ArrowType.prototype.accept = function(v) {
  v.arrowType(this);
};

Visitor.prototype.arrowType = function(arrow) {
  _(arrow.argTypes).each(function(arg) {
    arg.accept(this);
  });
  arrow.retType.accept(this);
};

function Seq(expr) {
  if(_(expr).isArray()) {
    this.exprs = expr;
  } else if(_(expr).isObject()) {
    this.exprs = [expr];
  } else {
    this.exprs = [];
  }
}

Seq.prototype.push = function(expr) {
  this.exprs.push(expr);
};

Seq.prototype.accept = function(v) {
  v.seq(this);
};

Visitor.prototype.seq = function(seq) {
  _(seq.exprs).each(function(expr) {
    expr.accept(this);
  });
};

function BindTerm(name, type) {
  this.name = name;
  this.type = type;
}

BindTerm.prototype.accept = function(v) {
  v.bindTerm(this);
};

Visitor.prototype.bindTerm = function(bind) {
  bind.type.accept(this);
};

function BindType(name, kind) {
  this.name = name;
  this.kind = kind;
}

BindType.prototype.accept = function(v) {
  v.bindType(this);
};

Visitor.prototype.bindType = function(bind) {
  bind.kind.accept(this);
};

function BindKind(name, kind) {
  this.name = name;
  this.kind = kind;
}

BindKind.prototype.accept = function(v) {
  v.bindKind(this);
};

Visitor.prototype.bindKind = function(bind) {
  bind.kind.accept(this);
};

function Store(name, expr) {
  this.name = name;
  this.expr = expr;
}

Store.prototype.accept = function(v) {
  v.store(this);
};

Visitor.prototype.store = function(store) {
  store.name.accept(this);
  store.expr.accept(this);
};

function Conditional(pred, thenExpr, elseExpr) {
  this.pred      = pred;
  this.thenExpr = thenExpr;
  this.elseExpr = elseExpr;
}

Conditional.prototype.accept = function(v) {
  v.conditional(this);
};

Visitor.prototype.conditional = function(conditional) {
  conditional.pred.accept(this);
  conditional.thenExpr.accept(this);
  if(conditional.elseExpr) {
    conditional.elseExpr.accept(this);
  }
};

function Block(body) {
  this.body = body;
}

Block.prototype.accept = function(v) {
  v.block(this);
};

Visitor.prototype.block = function(block) {
  block.body.accept(this);
};

function While(pred, body) {
  this.pred = pred;
  this.body = body;
}

While.prototype.accept = function(v) {
  v.while_(this);
};

Visitor.prototype.while_ = function(while_) {
  while_.pred.accept(this);
  while_.body.accept(this);
};

function Return(expr) {
  this.expr = expr;
}

Return.prototype.accept = function(v) {
  v.return_(this);
};

Visitor.prototype.return_ = function(return_) {
  return_.expr.accept(this);
};

function Unary(op, expr) {
  this.op   = op;
  this.expr = expr;
}

Unary.prototype.accept = function(v) {
  v.unary(this);
};

Visitor.prototype.unary = function(unary) {
  unary.expr.accept(this);
};

function Binary(op, lhs, rhs) {
  this.op  = op;
  this.lhs = lhs;
  this.rhs = rhs;
}

Binary.prototype.accept = function(v) {
  v.binary(this);
};

Visitor.prototype.binary = function(binary) {
  binary.lhs.accept(this);
  binary.rhs.accept(this);
};

function Func(arrow, body) {
  this.arrow = arrow;
  this.body  = body;
}

Func.prototype.accept = function(v) {
  v.func(this);
};

Visitor.prototype.func = function(func) {
  func.arrow.accept(this);
  func.body.accept(this);
};

function Call(name, args) {
  this.name   = name;
  this.args = args ? args : [];
}

Call.prototype.accept = function(v) {
  v.call(this);
};

Visitor.prototype.call = function(call) {
  _(call.args).each(function(arg) {
    arg.accept(this);
  });
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

