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
  .option('-c, --compile <lang>',  'compile the input program')
  .option('-f, --source',          'display the source file contents')
  .option('-s, --syntax',          'display the syntax parse tree')
  .option('-t, --typing',          'display the elaboration tree')
  .option('--list',                'List the installed languages and plugins')
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
    emitter: pgm.compile ? pgm.compile : null,
    display: {
      source: pgm.source ? true : false,
      syntax: pgm.syntax ? true : false,
      typing: pgm.typing ? true : false
    }
  }, pgm.args);
}

