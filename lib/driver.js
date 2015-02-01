(function(){
  'use strict';

var _ = require('underscore');

var trans  = require('./translation');
var parser = require('./parser');
var elab   = require('./elaborator');
var evl    = require('./evaluator');
var err    = require('./error');

exports.compile = function(files, options) { 

  _(files).each(function(filename) {
    // Establish an empty translation
    var source, syntax, elaboration, 
        translation = new trans.Translation();
    try {
      // Read the file and create a source moduleA
      source = new trans.Source(filename);
      translation.addRep('source', source);

      // Add a syntax IR to the translation
      syntax = parser.parse(source);
      translation.addRep('syntax', syntax);
      if(options.display.syntax) {
        console.log(new Array(30).join('='));
        console.log('Syntax Tree');
        console.log(new Array(30).join('-'));
        console.log(syntax.toString());
      }

      // Add an elaboration IR to the translation
      elaboration = elab.elaborate(syntax);
      translation.addRep('elaboration', elaboration);
      if(options.display.elaboration) {
        console.log(new Array(30).join('='));
        console.log('Elaboration Tree');
        console.log(new Array(30).join('-'));
        console.log(elaboration.toString());
      }

      // Evaluate or compile the elaboration
      if(options.eval) {
        evl.evaluate(elaboration);
      } else {
        output = require(options.transform).transform(elaboration);
        translation.addRep('transform', output);
      }

    } catch (e) {
      if(e instanceof err.Lexical) {
        console.log(e.toString(filename));
      } else if(e instanceof err.Syntax) {
        console.log(e.toString(filename));
      } else if(e instanceof err.Elaboration) {
        console.log(e.toString(filename));
      } else {
        throw e;
      }
    }
  });
};

})();

