(function(){
  'use strict';

var _ = require('underscore');

function OverloadSet() {
  //IMPLEMENT
}

function Scope() {
  this.terms = {};
  this.types = {};
  this.kinds = {};
}

Scope.prototype.hasTerm = function(symbol) {
  return symbol in this.terms;
};

Scope.prototype.bindTerm = function(symbol, type) {
  this.terms[symbol] = type;
};

Scope.prototype.hasType = function(symbol) {
  return symbol in this.types;
};
Scope.prototype.bindType = function(symbol, kind) {
  this.types[symbol] = kind;
};

Scope.prototype.hasKind = function(symbol) {
  return symbol in this.kinds;
};

Scope.prototype.bindKind = function(symbol, meta) {
  this.kinds[symbol] = meta;
};

Scope.prototype.define = function(symbol, term) {
  this.scope[symbol] = term;
};

Scope.prototype.lookup = function(symbol) {
  return this.scope[symbol];
};

function Stack() {
  // Stack of scopes
  // .. managed in reverse order
  this.baseScope = new Scope();
  this.stack = [this.baseScope];

  this.baseScope.bindKind('kind', 'kind');
}

Stack.prototype.push = function() {
  this.stack.splice(0, 0, new Scope());
};

Stack.prototype.pop = function() {
  if(this.stack.length === 0) {
    throw 'Stack: empty pop';
  }
  this.stack.splice(0, 1);
};

Stack.prototype.currScope = function() {
  return this.stack[0];
};

Stack.prototype.lookup = function(symbol) {
  var scope;
  for(scope in this.stack) {
    if(_(scope).has(symbol)) {
      return scope[symbol];
    }
  }
};

Stack.prototype.hasKind = function(symbol) {
  return _(this.stack).some(function(scope) {
    return scope.hasKind(symbol);
  });
};

exports.Stack = Stack;

})();

