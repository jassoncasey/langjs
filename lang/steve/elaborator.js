(function() {
  'use strict';

var _  = require('underscore');
var ir = require('./ir');
var en = require('./environment');
var err = require('../../error');

// Determine if a variable is free in a scope
function isFree(scope, variable) {
  return scope.isFree(variable.name);
}

// Bind a variable to a type in a scope
function bind(scope, variable, type) {
  scope.bind(variable.name, type);
}

// Determine if type is Simple Type
function isSimpleType(type) {
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

// The type of a constant is the SimpleType of its name
Visitor.prototype.constant = function(ir) {
  this.type = new ir.SimpleType(ir.name);
};

// The type of a variable is in the term environment
// ... however, the result should be a ref of that type
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
  // Grab the current scope
  var scope = this.env.terms.scope();
  // Determine if the variable is free to bind
  if(!isFree(scope, ir.name)) {
    throw ('Symbol already bound: ' + ir.name.name);
  }
  // transform any terms into types
  ir.type = makeType(ir.type);
  // ensure the types are well formed
  ir.type.accept(this);
  // Bind the variable and type
  bind(scope, ir.name, ir.type);
};

Visitor.prototype.bindType = function(ir) {
  // Grab the current scope
  var scope = this.env.types.scope();
  // Determine if the variable is free to bind
  if(!isFree(scope, ir.name)) {
    throw ('Symbol already bound: ' + ir.name.name);
  }
  // transform any terms into kinds
  ir.kind = makeKind(ir.kind);
  // ensure the kinds are well formed
  ir.kind.accept(this);
  // Bind the variable and kind
  bind(scope, ir.name, ir.kind);
};

Visitor.prototype.bindKind = function(ir) {
  var scope = this.env.kinds.scope();
  if(!isFree(scope, ir.name)) {
    throw ('Symbol already bound: ' + ir.name.name);
  }
  // transform any terms into kinds
  ir.kind = makeKind(ir.kind);
  // ensure the kinds are well formed
  ir.kind.accept(this);
  // Bind the variable and kind
  bind(scope, ir.name, ir.kind);
};

Visitor.prototype.store = function(ir) {
  var refType;
  ir.name.accept(this);
  // The target of a store must be a reference
  if(!ty.isRefType(this.type)) {
    throw ('Store on non-ref type: ' + ir.this.type);
  }
  refType = this.type;
  ir.expr.accept(this);
  // The inner type of the reference and the source of the store 
  // ... must be equivilant types
  if(!ty.equal(refType.type, this.type)) {
    throw ('Store on unequivilant types: ' + 
            refType.toString() + ' != ' + this.type.toString());
  }
};

Visitor.prototype.seq = function(ir) {
  _(ir.exprs).each(function(expr) {
    expr.accept(this);
  }, this);
};

Visitor.prototype.unary = function(ir) {
  ir.expr.accept(this);
};

Visitor.prototype.binary = function(ir) {
  ir.lhs.accept(this);
  ir.lhs.accept(this);
};

function elaborate(ir) {
  var v = new Visitor(ir);
  ir.accept(v);
  return new Elaboration(v.expr, v.type);
}

// Symbol exports ...
exports.elaborate = elaborate;

})();

