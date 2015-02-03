(function() {
  'use strict';

var syn = require('./syntax');
var env = require('./environment');

function Elaboration(stack, expr) {
  syn.Visitor.call(this);

  this.stack = stack;
  this.expr  = expr;
  this.type  = null;
}

Elaboration.prototype = Object.create(syn.Visitor.prototype);
Elaboration.prototype.constructor = Elaboration;

Elaboration.prototype.toString = function() {
  return '<' + this.expr.toString() + ' : ' + this.type.toString() + '>';
};

Elaboration.prototype.constant = function() {
  this.type = new syn.SimpleType(this.expr.name);
};

Elaboration.prototype.simpleType = function() {
  switch(this.expr.id) {
    case 'nat':
    case 'bool':
    case 'char':
    case 'string':
    case 'int':
    case 'ipv4':
    case 'mac':
      break;
    default:
      throw "Bad typename: " + this.expr.id;
  }
  this.type = this.expr.id;
};

Elaboration.prototype.arrowType = function() {

};

Elaboration.prototype.variable = function() {
  this.type = this.typeEnv.lookup(this.expr.id);
};

Elaboration.prototype.seq = function() {
  _(this.expr.exprs).each(function(expr) {
    this.type = elaborate(this.typeEnv, expr).type;
  });
};

Elaboration.prototype.bindTerm = function() {
  if(!this.env.isFree(this.expr.name)) {}

  elaborate(this.typeEnv, this.expr.type);
  this.typeEnv.bind(expr.name, expr.type);
  this.type = expr.type;
};

Elaboration.prototype.store = function() {
  var type = this.typeEnv.lookup(this.expr.name);
  var elab = elaborate(this.typeEnv, this.expr.expr);
  if(type !== elab.type) {}
  this.type = type;
};

Elaboration.prototype.conditional = function() {
  if(elaborate(this.env, this.expr.pred).type !== BOOL) {}
  var thenElab = elaborate(this.env, this.expr.thenExpr);
  var elseElab = elaborate(this.env, this.expr.elseExpr);
  if(!syn.equalTypes(thenElab.type, elseElab.type)) {}
  this.type = thenElab.type;
};

Elaboration.prototype.while_ = function() {
  if(elaborate(this.env, this.expr.pred).type !== BOOL) {}
  this.type = elaborate(this.env, this.expr.expr).type;
};

Elaboration.prototype.return_ = function() {
  this.type = elaborate(this.env, this.expr.expr);
};

Elaboration.prototype.unary = function(expr) {
  var abs = this.env.lookup(expr.op);
  var exprType = elaborate(this.env, expr.expr);
};

Elaboration.prototype.binary = function(expr) {
  var abs = this.env.lookup(expr.op);
  var lhsType = elaborate(this.env, expr.lhs);
  var rhsType = elaborate(this.env, expr.rhs);
};

Elaboration.prototype.func = function(expr) {
};

Elaboration.prototype.call = function(expr) {
  var abs = this.env.lookup(expr.name);
};

Elaboration.prototype.visit = function() {
  this.expr.accept(this);
  return this;
};

function elaborate(expr, env) {
  var _env = env ? env : new env.Environment();
  var elab = new Elaboration(expr, env);
  return elab.visit(elaboration);
}

exports.elaborate = elaborate;

})();

