(function() {
  'use strict';

var _ = require('underscore');
var fmt = require('../../lib/formatter');

function Visitor() {
  this.f = new fmt.Formatter();
}

Visitor.prototype.constant = function(ir) {
  this.f.write(ir.value);
};

Visitor.prototype.variable = function(ir) {
  this.f.write(ir.name);
};

Visitor.prototype.simpleType = function(ir) {
  this.f.write(ir.name);
};

Visitor.prototype.arrowType = function(ir) {
  var idx;
  var first = true;
  this.f.write('(');
  this.f.beginSet();
  for(idx=0; idx<ir.argTypes.length; ++idx) {
    if(first) { first = false; }
    else      { this.f.write(', '); }
    ir.argTypes[idx].accept(this);
  }
  this.f.endSet();
  this.f.write(') -> ');
  ir.retType.accept(this);
};

Visitor.prototype.seq = function(ir) {
  _(ir.exprs).each(function(expr) {
    expr.accept(this);
    this.f.writeln(';');
  }, this);
};

Visitor.prototype.bindTerm = function(ir) {
  ir.name.accept(this);
  this.f.write(': ');
  ir.type.accept(this);
};

Visitor.prototype.bindType = function(ir) {
  ir.name.accept(this);
  this.f.write(':: ');
  ir.kind.accept(this);
};

Visitor.prototype.bindKind = function(ir) {
  ir.name.accept(this);
  this.f.write('::: ');
  ir.kind.accept(this);
};

Visitor.prototype.store = function(ir) {
  ir.name.accept(this);
  this.f.write(' = ');
  ir.expr.accept(this);
};

Visitor.prototype.conditional = function(ir) {
  this.f.write('if(');
  ir.pred.accept(this);
  this.f.write(') ');
  ir.thenExpr.accept(ir);
  if(ir.elseExpr) {
    this.f.writeln(' else ');
    ir.elseExpr.accept(ir);
  } else {
    this.f.nl();
  }
};

Visitor.prototype.block = function(ir) {
  this.f.writeln('{');
  this.f.instab();
  ir.body.accept(this);
  this.f.rmtab();
  this.f.writeln('}');
};

Visitor.prototype.while_ = function(ir) {
  this.f.write('while(');
  ir.pred.accept(this);
  this.f.writeln(') ');
  ir.body.accept(this);
};

Visitor.prototype.return_ = function(ir) {
  this.f.write('return ');
  ir.expr.accept(this);
};

Visitor.prototype.unary = function(ir) {
  this.f.write(ir.op);
  this.f.sp();
  ir.expr.accept(this);
};

Visitor.prototype.binary = function(ir) {
  ir.lhs.accept(this);
  this.f.sp();
  this.f.write(ir.op);
  this.f.sp();
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

function toString(ir) {
  var v = new Visitor();
  ir.accept(v);
  return v.toString();
}

exports.Visitor  = Visitor;
exports.toString = toString;

})();

