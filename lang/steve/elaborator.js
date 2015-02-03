(function() {
  'use strict';

var syn = require('./syntax');

function Elaboration() {
}

Elaboration.prototype             = Object.create(syn.Visitor);
Elaboration.prototype.constructor = Elaboration;

Elaboration.prototype.constant = function(expr) {
};

Elaboration.prototype.variable = function(expr) {
};

Elaboration.prototype.seq = function(expr) {
};

Elaboration.prototype.bindTerm = function(expr) {
};

Elaboration.prototype.store = function(expr) {
};

Elaboration.prototype.conditional = function(expr) {
};

Elaboration.prototype.while_ = function(expr) {
};

Elaboration.prototype.return_ = function(expr) {
};

Elaboration.prototype.unary = function(expr) {
};

Elaboration.prototype.binary = function(expr) {
};

Elaboration.prototype.func = function(expr) {
};

Elaboration.prototype.call = function(expr) {
};

function elaborate(expr) {
  var elaboration = new Elaboration();
  expr.accept(elaboration);
}

exports.elaborate = elaborate;

})();

