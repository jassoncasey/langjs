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

function elaborate(ir) {
  var v = new Visitor(ir);
  ir.accept(v);
  return new Elaboration(v.expr, v.type);
}

exports.Visitor = Visitor;
exports.elaborate = elaborate;

})();

