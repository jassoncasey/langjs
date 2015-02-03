(function() {
  'use strict';

var _ = require('underscore');

function Constant(name, value) {
  this.name  = name;
  this.value = value;
}

function SimpleType(name) {
  this.name = name;
}

function ArrowType(argTypes, retType) {
  this.argTypes = argTypes;
  this.retType = retType;
}

function Variable(id) {
  this.id = id;
}

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

function BindTerm(name, type) {
  this.name = name;
  this.type = type;
}

function BindType(name, kind) {
}

function BindKind(name, kind) {
}

function Store(name, expr) {
  this.name = name;
  this.expr = expr;
}

function Conditional(pred, thenExpr, elseExpr) {
  this.pred      = pred;
  this.thenExpr = thenExpr;
  this.elseExpr = elseExpr;
}

function While(pred, expr) {
  this.pred = pred;
  this.expr = expr;
}

function Return(expr) {
  this.expr = expr;
}

function Unary(op, expr) {
  this.op   = op;
  this.expr = expr;
}

function Binary(op, lhs, rhs) {
  this.op  = op;
  this.lhs = lhs;
  this.rhs = rhs;
}

function Func(arrow, body) {
  this.arrow = arrow;
  this.body  = body;
}

function Call(name, params) {
  this.name   = name;
  this.params = params ? params : new Seq();
}

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

})();

