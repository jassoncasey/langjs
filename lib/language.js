(function() {
  'use strict';

var path = require('path');
var fs   = require('fs');
var _    = require('underscore');

var err  = require('./error');
var util = require('./util');
var parser = require('./parser');

var LANGUAGES = path.resolve(__dirname, '..', 'lang');
var PLUGINS   = path.resolve(__dirname, '..', 'plugin');

// Assert the presence of the lang directory
util.mustExist(LANGUAGES);

// Object to wrap a language
function Language(name, plugins, compiler) {
  this.name = name;
  this.plugins = plugins;

  // Find the language module
  this.langdir = path.resolve(LANGUAGES, name);
  util.mustExist(this.langdir);

  // Assert the mandatory module presence and load
  this.grammar = path.resolve(this.langdir, 'grammar.js');
  this.parser  = new parser.Parser(this.grammar);

  this.printer = path.resolve(this.langdir, 'printer.js');
  this.printer = util.mustLoad(this.printer);

  this.elaborator = path.resolve(this.langdir, 'elaborator.js');
  this.elaborator = util.mustLoad(this.elaborator);
  this.evaluator  = path.resolve(this.langdir, 'evaluator.js');
  this.evaluator  = util.mayLoad(this.evaluator);

  // Add an optional compiler
  if(compiler) {
    this.compiler = path.resolve(this.langdir, 'emitter', compiler + '.js');
    this.compiler = util.mayLoad(this.evaluator);
  }
}

Language.prototype.parse = function(source) {
  return this.parser.parse(source.text);
};

Language.prototype.toString = function(ir) {
  return this.printer.toString(ir);
};

Language.prototype.elaborate = function(syntax) {
  return this.elaborator.elaborate(syntax);
};

Language.prototype.evaluate = function(elaboration) {
  if(_(this.evaluator).isObject()) {
    return this.evaluator.evaluate(elaboration);
  } else {
    return elaboration;
  }
};

Language.prototype.compile = function(elaboration) {
  if(_(this.compiler).isObject()) {
    return this.compiler.compile(elaboration);
  } else {
    return elaboration;
  }
};

// List the available languages
function ls() {
  return _(fs.readdirSync(LANGUAGES)).filter(function(name) {
    var candidate = path.join(LANGUAGES, name);
    return fs.statSync(candidate).isDirectory();
  });
}

// Does the specified language exist
function exists(name) {
  return _(fs.readdirSync(LANGUAGES)).contains(name);
}

exports.ls       = ls;
exports.exists   = exists;
exports.Language = Language;

})();

