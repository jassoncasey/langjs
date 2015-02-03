
var fs     = require('fs');
var path   = require('path');
var _      = require('underscore');
var expect = require('chai').expect;

var trans  = require('../lib/translation');
var parser = require('../lib/parser');
var err    = require('../lib/error');

describe('Possitive and negative syntax testing', function() {
  var dir = path.join(__dirname, 'syntax');
  _(fs.readdirSync(dir)).each(function(lang) {
    var langdir = path.resolve(dir, lang);
    if(fs.statSync(langdir).isDirectory()) {
      var grammar = path.resolve(__dirname, '../lang/', lang, 'grammar.js');
      _(fs.readdirSync(langdir)).each(function(file) {
        var ext = path.extname(file);
        if(ext === '.pass') {
          it(lang + ': Positive syntax test case: ' + file, function() {
            var src = new trans.Source(path.resolve(langdir, file));
            // Expect test case to pass
            try {
              var p = new parser.Parser(grammar);
              p.parse(src.text);
            } catch(e) {
              console.log(e);
              throw e;
            }
          });
        } else if(ext === '.fail') {
          it(lang + ': Negative syntax test case: ' + file, function() {
            var src = new trans.Source(path.resolve(langdir, file));
            // Expect test case to fail
            var p = new parser.Parser(grammar);
            expect(p.parse.bind(parser, src.text)).to.throw();
          });
        }
      });
    }
  });
});


