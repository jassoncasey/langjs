(function() {
  'use strict';

var _ = require('underscore');

function Visitor(expr) {
  this.expr = expr;
  this.result = null;
}

Visitor.prototype.constant = function(ir) {
  this.result = ir.value;
};

Visitor.prototype.variable = function(ir) {

};

Visitor.prototype.seq = function(ir) {
  _(ir.exprs).each(function(expr) {
    expr.accept(this);
  }, this);
};

Visitor.prototype.unary = function(ir) {
};

Visitor.prototype.binary = function(ir) {
  var lhs = evaluate(ir.lhs);
  var rhs = evaluate(ir.rhs);
  switch(ir.op) {
    case '+':
      this.result = lhs + rhs;
      break;
    default:
      throw 'Bad binary operator: ' + ir.op;
  }
};

Visitor.prototype.call = function(ir) {
};

function evaluate(ir) {
  var v = new Visitor(ir);
  ir.accept(v);
  return v.result;
}

exports.Visitor  = Visitor;
exports.evaluate = evaluate;

})();

