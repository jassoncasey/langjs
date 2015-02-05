(function() {
  'use strict';

var _ = require('underscore');
var ir = require('./ir');

function Elaboration(expr, type) {
  this.expr = expr;
  this.type = type;
}

Elaboration.prototype.toString = function() {
  return '<' + ir.toString(this.expr) + ', ' + ir.toString(this.type) + '>';
};

Elaboration.prototype.accept = function(v) {
  this.expr.accept(v);
};

function Visitor(expr) {
  this.expr = expr;
  this.type = null;
}

Visitor.prototype.constant = function(ir) {
};

Visitor.prototype.variable = function(ir) {
};

Visitor.prototype.simpleType = function(ir) {
};

Visitor.prototype.arrowType = function(ir) {
};

Visitor.prototype.seq = function(ir) {
  _(ir.exprs).each(function(expr) {
    expr.accept(this);
  }, this);
};

Visitor.prototype.unary = function(ir) {
  var expr = elaborate(ir.expr);
  this.type = expr.type;
};

Visitor.prototype.binary = function(ir) {
  var lhs = elaborate(ir.lhs);
  var rhs = elaborate(ir.rhs);
};

function elaborate(ir) {
  var v = new Visitor(ir);
  ir.accept(v);
  return new Elaboration(v.expr, v.type);
}

exports.Visitor = Visitor;
exports.elaborate = elaborate;

})();

