(function() {
  'use strict';

var _ = require('underscore');

function Visitor() {}

function Constant(name, value) {
  this.name  = name;
  this.value = value;
}

Constant.prototype.accept = function(v) {
  v.constant(this);
};

Visitor.prototype.constant = function(expr) {};

function SimpleType(name) {
  this.name = name;
}

SimpleType.prototype.accept = function(v) {
  v.simpleType(this);
};

Visitor.prototype.simpletype = function(expr) {};

function ArrowType(argTypes, retType) {
  this.argTypes = argTypes;
  this.retType = retType;
}

ArrowType.prototype.accept = function(v) {
  v.arrowType(this);
};

Visitor.prototype.arrowType = function(expr) {};

function Variable(id) {
  this.id = id;
}

Variable.prototype.accept = function(v) {
  v.variable(this);
};

Visitor.prototype.variable = function(expr) {};

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

Visitor.prototype.seq = function(expr) {
  _(expr.exprs).each(function(_expr) {
    _expr.accept(this);
  });
};

function BindTerm(name, type) {
  this.name = name;
  this.type = type;
}

BindTerm.prototype.accept = function(v) {
  v.bindTerm(this);
};

Visitor.prototype.bindTerm = function(expr) {
  expr.type.accept(this);
};

function BindType(name, kind) {
}

BindType.prototype.accept = function(v) {
  v.bindType(this);
};

Visitor.prototype.bindType = function(expr) {
  expr.type.accept(this);
};

function BindKind(name, kind) {
}

BindKind.prototype.accept = function(v) {
  v.bindKind(this);
};

Visitor.prototype.bindKind = function(expr) {
  expr.type.accept(this);
};

function Store(name, expr) {
  this.name = name;
  this.expr = expr;
}

Store.prototype.accept = function(v) {
  v.store(this);
};

Visitor.prototype.store = function(expr) {
  expr.expr.accept(this);
};

function Conditional(pred, thenExpr, elseExpr) {
  this.pred      = pred;
  this.thenExpr = thenExpr;
  this.elseExpr = elseExpr;
}

Conditional.prototype.accept = function(v) {
  v.conditional(this);
};

Visitor.prototype.conditional = function(expr) {
  expr.pred.accept(this);
  expr.thenExpr.accept(this);
  expr.elseExpr.accept(this);
};

function While(pred, expr) {
  this.pred = pred;
  this.expr = expr;
}

While.prototype.accept = function(v) {
  v.while_(this);
};

Visitor.prototype.while_ = function(expr) {
  expr.pred.accept(this);
  expr.expr.accept(this);
};

function Return(expr) {
  this.expr = expr;
}

Return.prototype.accept = function(v) {
  v.return_(this);
};

Visitor.prototype.return_ = function(expr) {
  expr.expr.accept(this);
};

function Unary(op, expr) {
  this.op   = op;
  this.expr = expr;
}

Unary.prototype.accept = function(v) {
  v.unary(this);
};

Visitor.prototype.unary = function(expr) {
  expr.expr.accept(this);
};

function Binary(op, lhs, rhs) {
  this.op  = op;
  this.lhs = lhs;
  this.rhs = rhs;
}

Binary.prototype.accept = function(v) {
  v.binary(this);
};

Visitor.prototype.binary = function(expr) {
  expr.lhs.accept(this);
  expr.rhs.accept(this);
};

function Func(arrow, body) {
  this.arrow = arrow;
  this.body  = body;
}

Func.prototype.accept = function(v) {
  v.func(this);
};

Visitor.prototype.func = function(expr) {
  expr.arrow.accept(this);
  expr.body.accept(this);
};

function Call(name, params) {
  this.name   = name;
  this.params = params ? params : new Seq();
}

Call.prototype.accept = function(v) {
  v.call(this);
};

Visitor.prototype.call = function(expr) {
  expr.params.accept(this);
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
exports.While       = While;
exports.Return      = Return;
exports.Unary       = Unary;
exports.Binary      = Binary;
exports.Func        = Func;
exports.Call        = Call;

exports.Visitor = Visitor;

})();

