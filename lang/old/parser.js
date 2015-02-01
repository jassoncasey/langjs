(function(){
  'use strict';

var err    = require('./error');
var parser = require('./grammar').parser;

parser.yy.parseError = function(str, hash) {
  if(hash.token === 'UNKNOWN') {
    throw new err.Lexical(hash.loc, hash.expected);
  } else {
    throw new err.Syntax(hash.token, hash.loc, hash.expected);
  }
};

function parse(input) {
  return parser.parse(input.text);
}

exports.parse = parse;

})();

