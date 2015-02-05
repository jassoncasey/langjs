(function() {
  'use strict';

var _ = require('underscore');

function Visitor(ir) {
  this.expr = ir;
  this.result = '';
}

Visitor.prototype.constant = function(ir) {
};

Visitor.prototype.variable = function(ir) {
};

Visitor.prototype.unary = function(ir) {
};

Visitor.prototype.binary = function(ir) {
};

Visitor.prototype.call = function(ir) {
};

function compile(ir) {
  var v = new Visitor(ir);
  ir.accept(v);
  return v.result;
}

exports.Visitor = Visitor;
exports.compile = compile;

})();

