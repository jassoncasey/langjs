#!/usr/bin/env node

var pgm = require('commander');
var _ = require('underscore');

var pkg = require('./package.json');
var drv = require('./lib/driver');

function plugins(val, list) {
  list.push(val);
  return list;
}

pgm
  .version(pkg.version)
  .usage('[options] <file ...>')
  .option('-l, --lang <lang>',     'Select a language')
  .option('-p, --plugin [plugin]', 'Select a sequence of plugins', plugins, [])
  .option('--compile',         'compile the input program')
  .option('--evaluate',        'evaluate the input program')
  .option('-f, --source',      'display the source file contents')
  .option('-s, --syntax',      'display the syntax parse tree')
  .option('-t, --typing',      'display the elaboration tree')
  .option('-e, --evaluation',  'display the evaluation tree')
  .option('-c, --compilation', 'display the compilation tree')
  .option('--list', 'List the installed languages and plugins')
  .description('A nodejs based Modulular language experimentation framework')
  .parse(process.argv);

// Force the selection of a language
if(!_(pgm.lang).isString()) {
  console.log('Must specify a language');
// Envoke the language driver
} else {
  drv.drive({
    language: pgm.lang,
    plugins: pgm.plugin,
    display: {
      source:      pgm.source      ? true : false,
      syntax:      pgm.syntax      ? true : false,
      typing:      pgm.typing      ? true : false,
      evaluation:  pgm.evaluation  ? true : false,
      compilation: pgm.compilation ? true : false
    }
  }, pgm.args);
}

