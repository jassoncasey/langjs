(function() {
  'use strict';

var _ = require('underscore');

function Visitor() {
}

Visitor.prototype.constant = function(ir) {
};

Visitor.prototype.variable = function(ir) {
};

Visitor.prototype.simpleType = function(ir) {
};

Visitor.prototype.arrowType = function(ir) {
  _(ir.argTypes).each(function(argType) {
    argType.accept(this);
  });
  ir.retType.accept(this);
};

Visitor.prototype.seq = function(ir) {
  _(ir.exprs).each(function(expr) {
    expr.accept(this);
  });
};

Visitor.prototype.bindTerm = function(ir) {
  ir.name.accept(this);
  ir.type.accept(this);
};

Visitor.prototype.bindType = function(ir) {
  ir.name.accept(this);
  ir.kind.accept(this);
};

Visitor.prototype.bindKind = function(ir) {
  ir.name.accept(this);
  ir.kind.accept(this);
};

Visitor.prototype.store = function(ir) {
  ir.name.accept(this);
  ir.expr.accept(this);
};

Visitor.prototype.conditional = function(ir) {
  ir.pred.accept(this);
  ir.thenExpr.accept(ir);
  if(ir.elseExpr) {
    ir.elseExpr.accept(ir);
  }
};

Visitor.prototype.block = function(ir) {
  ir.body.accept(this);
};

Visitor.prototype.while_ = function(ir) {
  ir.pred.accept(this);
  ir.body.accept(this);
};

Visitor.prototype.return_ = function(ir) {
  ir.expr.accept(this);
};

Visitor.prototype.unary = function(ir) {
  ir.expr.accept(this);
};

Visitor.prototype.binary = function(ir) {
  ir.lhs.accept(this);
  ir.rhs.accept(this);
};

Visitor.prototype.func = function(ir) {
};

Visitor.prototype.call = function(ir) {
  var arg;
  var first = true;
  this.f.write(ir.name);
  this.f.write('(');
  this.f.beginSet();
  for(arg in ir.args) {
    if(first) { first = false; }
    else { this.f.write(', '); }
    arg.accept(this);
  }
  this.f.endSet();
  this.f.write(')');
};

Visitor.prototype.toString = function() {
  return this.f.toString();
};

function visit(ir) {
  var v = new Visitor();
  ir.accept(v);
  return v.result;
}

exports.Visitor  = Visitor;

})();

