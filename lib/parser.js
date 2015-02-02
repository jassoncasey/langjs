(function() {
  'use strict';

var util = require('./util');
var err  = require('./error');

function Parser(grammar) {
  // Assert load the grammar
  this.grammar = util.mustLoad(grammar);

  // Set the parse error function
  this.grammar.parser.yy.parseError = function(str, hash) {
    if(hash.token === 'UNKNOWN') {
      throw new err.Lexical(hash.loc, hash.expected);
    } else {
      throw new err.Syntax(hash.token, hash.loc, hash.expected);
    } 
  };
}

Parser.prototype.parse = function(text) {
  return this.grammar.parser.parse(text);
};

exports.Parser = Parser;

})();

