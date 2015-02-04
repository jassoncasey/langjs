(function() {
  'use strict';

function Scope() {
  this.env = {};
}

Scope.prototype.lookup = function(symbol) {
  return _(this.env).has(symbol) ? this.env[symbol] : null;
};

Scope.prototype.isFree = function(symbol) {
  return !_(this.env).has(symbol);
};

Scope.prototype.bind = function(symbol, obj) {
  this.env[symbol] = obj;
};

function Stack() {
  this.stack = [new Scope()];
}

Stack.prototype.push = function() {
  this.stack.splice(0, 0, new Scope());
};

Stack.prototype.pop = function() {
  this.stack.splice(0, 1);
};

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

Stack.prototype.scope = function() {
  return this.stack[0];
};

exports.Scope = Scope;
exports.Stack = Stack;

})();

