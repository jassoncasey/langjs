#!/usr/bin/env node

var pkg = require('./package.json');
var pgm = require('commander');
var _   = require('underscore');

var lang = require('./lib/language');
var plgn = require('./lib/plugin');

//var driver = require('./lib/driver');

function plugins(val, list) {
  list.push(val);
  return list;
}

pgm
  .version(pkg.version)
  .usage('[options] <file ...>')
  .option('-l, --lang <lang>', 'Select a language')
  .option('-p, --plugin [plugin]', 'Select a sequence of plugins', plugins, [])
  .option('-s, --syntax', 'display the syntax parse tree')
  .option('-t, --typing', 'display the elaboration tree')
  .option('-e, --evaluation', 'display the evaluation tree')
  .option('-c, --compilation', 'display the compilation tree')
  .option('--list', 'List the installed languages and plugins')
  .description('A nodejs based Modulular language experimentation framework')
  .parse(process.argv);

if(pgm.list) {
  console.log('Supported languages');
  _(lang.ls()).each(function(name) {
    console.log('  '+name);
  });
  console.log('Supported plugins');
  _(plgn.ls()).each(function(name) {
    console.log('  '+name);
  });
} else {

var x = {
  language: pgm.lang,
  plugins: pgm.plugin,
  display: {
    syntax:      pgm.syntax ? true : false,
    typing:      pgm.typing ? true : false,
    evaluation:  pgm.evaluation ? true : false,
    compilation: pgm.compilation ? true : false
  },
  files: pgm.args
};

console.log('%j', x);

}
