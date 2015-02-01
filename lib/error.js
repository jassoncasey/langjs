(function(){
  'use strict';

var _ = require('underscore');

function GeneralError(msg) {
  this.msg = msg;
}

GeneralError.prototype.toString = function() {
  return this.msg;
};

function LexicalError(loc, expected) {
  this.loc      = loc;
  this.expected = expected;
}

LexicalError.prototype.toString = function(filename) {
  var result = [];

  result.push(new Array(30).join('='));
  result.push('Lexical Error');
  result.push(new Array(30).join('-'));
  result.push('\tLine/Col: '+this.loc.first_line+'/'+this.loc.first_column);

  return result.join('\n');
};

function SyntaxError(token, loc, expected) {
  this.token    = token;
  this.loc      = loc;
  this.expected = expected;
}

SyntaxError.prototype.toString = function(filename) {
  var result = [];

  result.push(new Array(30).join('='));
  result.push('Syntax Error');
  result.push(new Array(30).join('-'));
  result.push('Filename: ' + filename);
  result.push('Line/Col: '+this.loc.first_line+'/'+this.loc.first_column);
  result.push('Found: '+this.token);
  result.push('Expected: '+this.expected.join(' '));
  result.push(new Array(30).join('-'));

  return result.join('\n');
};

function ElaborationError() {
}

ElaborationError.prototype.toString = function(filename) {
  return '';
};

function EvaluationError() {
}

EvaluationError.prototype.toString = function(filename) {
  return '';
};

exports.General     = GeneralError;
exports.Lexical     = LexicalError;
exports.Syntax      = SyntaxError;
exports.Elaboration = ElaborationError;
exports.Evaluation  = EvaluationError;

})();
