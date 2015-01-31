
var fs     = require('fs');
var path   = require('path');
var _      = require('underscore');
var expect = require('chai').expect;

var trans  = require('../lib/translations');
var parser = require('../lib/parser');
var err    = require('../lib/error');

describe('Possitive and negative syntax testing', function() {
  var dir = path.join(__dirname, 'syntax');
  _(fs.readdirSync(dir)).each(function(file) {
    var ext = path.extname(file);
    if(ext === '.pass') {
      it('Positive syntax test case: ' + file, function() {
        var src = new trans.Source(path.join(dir, file));
        // Expect test case to pass
        try {
          parser.parse(src);
        } catch(e) {
          console.log(e);
          throw e;
        }
      });
    } else if(ext === '.fail') {
      it('Negative syntax test case: ' + file, function() {
        var src = new trans.Source(path.join(dir, file));
        // Expect test case to fail
        expect(parser.parse.bind(parser, src)).to.throw();
      });
    }
  });
});


