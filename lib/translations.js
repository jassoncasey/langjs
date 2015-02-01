(function() {
  'use strict';

var fs   = require('fs');
var path = require('path');
var _    = require('underscore');

function Source(filename) {
  this.filename = filename;
  this.dirname  = path.dirname(filename);
  this.basename = path.basename(filename);
  this.text     = fs.readFileSync(filename, 'utf-8');
}

Source.prototype.slice = function(line_start, col_start, line_end, col_end) {
  // provide a simple array of strings to slice
  var lines = this.buf.split('\n');

  // Adjust line values or 0-based start and slice
  line_start -= 1;
  line_end   -= 1;
  lines = lines.slice(line_start, line_end);

  lines[0] = lines[0].slice(col_start);
  if(line_start + 1 === line_end) {
    lines[0] = lines[0].slice(col_start, col_end);
  } else {
    lines[0] = lines[0].slice(col_start);
    lines[lines.length-1] = lines[lines.length-1].slice(0, col_end);
  }

  return lines.join('\n');
};

function Translation() {
  this.ir_list = [];
  this.ir_hash = {};
}

Translation.prototype.addRep = function(name, ir) {
  this.ir_list.push(ir);
  this.ir_hash[name] = ir;
};

Translation.prototype.getRep = function(name) {
  return this.ir_hash[name];
};

exports.Source      = Source;
exports.Translation = Translation;

})();

