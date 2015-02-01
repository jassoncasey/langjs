(function() {
  'use strict';

var util = require('./util');
var err  = require('./error');

function Parser(grammar) {
  // Assert load the grammar
  this.grammar = util.mustLoad(grammar);

  // Set the parse error function
  this.grammar.parser.yy.parseError = function(str, has) {
    if(hash.token === 'UNKNOWN') {
      throw new err.Lexical(hash.loc, hash.expected);
    } else {
      throw new err.Syntax(hash.token, hash.loc, hash.expected);
    } 
  };

  // Set the parse function
  this.parse = this.grammar.parser.parse;
}

exports.Parser = Parser;

})();

