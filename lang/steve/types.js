(function() {
  'use strict';

function noop() {}

/* 
 * SimpleType - wrapper for ground types
 *
 * Examples: BOOL, CHAR, STRING, NAT, INT, ...
 */

function SimpleType(name) {
  this.name = name;
}

// Visitor callback
SimpleType.prototype.accept = function(v) {
  v.simpleType(this);
};

// Type equality operation
SimpleType.prototype.equal = function(rhs) {
  return rhs instanceof SimpleType && this.name === rhs.name;
};

SimpleType.prototype.toString = function() {
  return '(type ' + this.name + ')';
};

// Generic simpleType visitation
var visitSimpleType = noop;

/*
 * RefType - wrapper type for references
 *
 * Examples: ref types can be implied; used for store validation
 */
function RefType(type) {
  this.type = type;
}

// Visitor callback
RefType.prototype.accept = function(v) {
  v.refType(this);
};

// Type equality operation
RefType.prototype.equal = function(rhs) {
  return rhs instanceof RefType &&
    equal(this.type, rhs.type);
};

RefType.prototype.toString = function() {
  return '(ref ' + this.type.toString() + ')';
};

// Generic ref type visitor
function visitRefType(refType) {
  refType.type.accept(this);
}

/*
 * ArrowType - function/abstraction type
 *
 * Examples: < has the type ... (NAT, NAT) -> BOOL
 */
function ArrowType(argTypes, retType) {
  this.argTypes = argTypes;
  this.retType  = retType;
}
      
// Visitor callback
ArrowType.prototype.accept = function(v) {
  v.arrowType(this);
};

// Type equality operation
ArrowType.prototype.equal = function(rhs) {
  return rhs instanceof ArrowType &&
    this.argTypes.length === rhs.argTypes.length &&
    _(_(this.argTypes, rhs.argTypes).zip()).every(function(argPair) {
      return equal(argPair[0], argPair[1]); 
    }) && equal(this.retType, rhs.retType);
};

ArrowType.prototype.toString = function() {
  return '(' + _(this.argTypes).map(function(argType) {
    return argType.toString();
  }).join(', ') + '->' + this.retType.toString() + ')';
};

// Generic arrow visitation
function visitArrow(arrow) {
  _(arrow.argTypes).each(function(arg) {
    arg.accept(this);
  }, this);
  arrow.retType.accept(this);
}

// Entry point for type equality checks
function equal(lhs, rhs) {
  return lhs.equal(rhs);
}

// Symbol exports ...
exports.SimpleType      = SimpleType;
exports.visitSimpleType = visitSimpleType;
exports.ArrowType       = ArrowType;
exports.visitArrow      = visitArrow;
exports.equal           = equal;

})();

