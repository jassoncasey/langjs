(function() {
  'use strict';

/*
 * Scope - store of symbols to values
 *
 * Examples: x: int, Type:: enum { ... }, typename::: kind
 */
function Scope() {
  this.env = {};
}

// Find the value of a symbol
Scope.prototype.lookup = function(symbol) {
  return _(this.env).has(symbol) ? this.env[symbol] : null;
};

// Determine if symbol is not bound in the scope
Scope.prototype.isFree = function(symbol) {
  return !_(this.env).has(symbol);
};

// Bind a symbol to value in the scope
Scope.prototype.bind = function(symbol, obj) {
  this.env[symbol] = obj;
};

/*
 * Stack - stack of scopes used for lexical scoping
 *
 * Examples: push a new scope when entering a block, pop when leaving
 */

function Stack() {
  this.stack = [new Scope()];
}

// Enter a new lexical scope
Stack.prototype.push = function() {
  this.stack.splice(0, 0, new Scope());
};

// Leave a lexical scope
Stack.prototype.pop = function() {
  this.stack.splice(0, 1);
};

// Search the stack from top to bottom for a symbol, return the bound value
Stack.prototype.lookup = function(symbol) {
  var scope, obj;
  for(scope in this.stack) {
    obj = scope.lookup(symbol);
    if(obj) { 
      return obj;
    }
  }
  return null;
};

// Get the current scope
Stack.prototype.scope = function() {
  return this.stack[0];
};

/*
 * Environment - basic store for bindings: terms, types, kinds
 *
 * Examples: (Sigma, Delta, Gamma) |- term : type
 */

function Environment() {
  this.terms_ = new Stack();
  this.types_ = new Stack();
  this.kinds_ = new Stack();
}

// Enter a new lexical scope
Environment.prototype.push = function() {
  this.terms_.push();
  this.types_.push();
  this.kinds_.push();
};

// Leave a lexical scope
Environment.prototype.pop = function() {
  this.terms_.pop();
  this.types_.pop();
  this.kinds_.pop();
};

// Get the term binding store
Environment.prototype.terms = function() {
  return this.terms_;
};

// Get the type binding store
Environment.prototype.types = function() {
  return this.types_;
};

// Get the kind binding store
Environment.prototype.kinds = function() {
  return this.kinds_;
};

// Symbol exports ...
exports.Scope       = Scope;
exports.Stack       = Stack;
exports.Environment = Environment;

})();

