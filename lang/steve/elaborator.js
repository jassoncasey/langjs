(function() {
  'use strict';

var _  = require('underscore');
var ir = require('./ir');
var en = require('./environment');
var err = require('../../error');

function isFree(scope, variable) {
  return scope.isFree(variable.name);
}

function bind(scope, variable, type) {
  scope.bind(variable.name, type);
}

function isType(type) {
  return type.name === 'nat' ||
         type.name === 'int' ||
         type.name === 'char' ||
         type.name === 'string' ;
}

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

function Visitor(env, expr) {
  this.env  = env;
  this.expr = expr;
  this.type = null;
}

Visitor.prototype.constant = function(ir) {
  this.type = new ir.SimpleType(ir.name);
};

Visitor.prototype.variable = function(ir) {
  this.type = this.env.terms.lookup(ir.name).type;
  if(this.type === null) {
    throw ('Symbol not found: ' + ir.name);
  }
  this.type = new ir.RefType(ir);
};

Visitor.prototype.simpleType = function(ir) {
};

Visitor.prototype.arrowType = function(ir) {
};

Visitor.prototype.bindTerm = function(ir) {
  var scope = this.env.terms.scope();
  if(!isFree(scope, ir.name)) {
    throw ('Symbol already bound: ' + ir.name.name);
  }
  ir.type = makeType();
  // check type is well formed
  bind(scope, ir.name, ir.type);
};

Visitor.prototype.bindType = function(ir) {
  var scope = this.env.types.scope();
  if(!isFree(scope, ir.name)) {
    throw ('Symbol already bound: ' + ir.name.name);
  }
  // run type transformer
  // check type is well formed
  bind(scope, ir.name, ir.type);
};

Visitor.prototype.bindKind = function(ir) {
  var scope = this.env.kinds.scope();
  if(!isFree(scope, ir.name)) {
    throw ('Symbol already bound: ' + ir.name.name);
  }
  // run type transformer
  // check type is well formed
  bind(scope, ir.name, ir.type);
};

Visitor.prototype.store = function(ir) {
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

// Symbol exports ...
exports.elaborate = elaborate;

})();

