(function(){
  'use strict';

var _ = require('underscore');

function Sequence(seq) {
  this.seq = seq;
}

Sequence.prototype.toString = function() {
  return _(this.seq).map(function(elaboration) {
    return elaboration.toString();
  }).join('\n');
};

exports.Sequence = Sequence;

function Elaboration(term, type) {
  this.term = term;
  this.type = type;
}

Elaboration.prototype.toString = function() {
  return '<' + this.term.toString() + ', ' + this.type.toString() + '>';
};

exports.Elaboration = Elaboration;

})();

