
/**
 * @module utils
 */

(/** @lends module:utils */function(){
  'use strict';

var _ = require('underscore');

/**
 * This is a string formatter, it is used for providing
 * pretty printing of arbitrary objects to strings.
 *
 * @constructor
*/
function Formatter(tab, width) {
  this.tab   = tab   ? tab : '  ';
  this.width = width ? width : 80;
  this.level = 0;
  this.lines = [];
  this.line  = '';
  this.mark  = 0;
}
exports.Formatter = Formatter;

/**
 * Returns a string verison of the formatter.
 *
 * @returns {String} a string version of the formatter.
 */
Formatter.prototype.toString = function() {
  return this.lines.join('\n') + this.line;
};

function indent(tab, level) {
  var result = '';
  _(level).range(function() {
    result += tab;
  });
  return result;
}

Formatter.prototype.sp = function() {
  this.line += ' ';
};

Formatter.prototype.indent = function() {
  this.line += indent(this.tab, this.level);
  if(this.line.length < this.mark) {
    _(this.mark - this.line.length).times(function() {
      this.sp();
      this.line += ' ';
    });
  }
  return this;
};

Formatter.prototype.nl = function() {
  this.lines.push(this.line);
  this.line = '';
  this.indent();
};

Formatter.prototype.write = function(input) {
  if(input.length + this.line.length > this.width) {
    this.nl();
  }
  if(input.length + this.line.length > this.width) {
    throw 'Formatter width too narrow';
  }
  this.line += input;
};

Formatter.prototype.writeln = function(input) {
  var tmp = input ? input : '';
  if(tmp.length + this.line.length > this.width) {
    this.nl();
  }
  if(tmp.length + this.line.length > this.width) {
    throw 'Formatter width too narrow';
  }
  this.lines.push(this.line + tmp);
  this.line = '';
  this.indent();
};

Formatter.prototype.tab = function() {
  this.level += 1;
};

Formatter.prototype.untab = function() {
  this.level -= 1;
};

Formatter.prototype.beginBlock = function(openChar) {
  var tmp = openChar ? openChar : '';
  this.writeln(tmp);
  this.tab();
};

Formatter.prototype.endBlock = function(closeChar) {
  var tmp = closeChar ? closeChar : '';
  this.untab();
  this.nl();
  this.writeln(tmp);
};

Formatter.prototype.beginSet = function() {
  this.mark = this.line.length;
};

Formatter.prototype.endSet = function() {
  this.mark = 0;
};

/**
 * Used to begin a formatter block.
 *
 * @param {String} name - the name of the current formatter block
 * @returns {Formatter} a reference to self
 */
Formatter.prototype.begin = function(name) {
  this.indent();
  this.result += name + ' {' + '\n';
  this.level += 1;
  return this;
};

/**
 * Used to end a formatter block.
 *
 * @returns {Formatter} a reference to self
 */
Formatter.prototype.end = function() {
  this.level -= 1;
  this.indent();
  this.result += '}';
  return this;
};

/**
 * Adds a field/value to the formatter.
 *
 * @param {String} field - attribute title of the pair
 * @param {Object} value - object that will be stringified
 * @returns {Formatter} returns a self reference
 */
Formatter.prototype.addPair = function(field, value) {
  this.indent();
  this.result += field + ': ' + value + '\n';
  return this;
};

/**
 * Adds a field/name/value to the formatter. 
 *
 * @param {String} field - attribute title of the pair
 * @param {String} name - string representation of value
 * @param {Object} value - object that will be stringified
 * @returns {Formatter} returns a self reference
 */
Formatter.prototype.addTriple = function(field, name, value) {
  this.indent();
  this.result += field + ': ' + name + '(' + value + ')' + '\n';
  return this;
};

})();

