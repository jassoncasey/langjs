(function(){
  'use strict';

var _ = require('underscore');

var err   = require('./error');
var lang  = require('./language');
var trans = require('./translation');

function list() {
  console.log('Supported languages');
  _(lang.ls()).each(function(name) {
    console.log('  ' + name);
  });
  console.log('Supported plugins');
  _(plgn.ls()).each(function(name) {
    console.log('  ' + name);
  });
}

function drive(options, files) {
  if(options.list) {
    list();
  } else {

    try {
      var language = new lang.Language(options.language, options.plugins);

      _(files).each(function(filename) {
        // Establish an empty translation
        var source, syntax, elaboration, 
          translation = new trans.Translation();
    
        // Read the file and create a source moduleA
        source = new trans.Source(filename);
        translation.addRep('source', source);
        if(options.display.source) {
          console.log(source.toString());
        }

        // Add a syntax IR to the translation
        syntax = language.parse(source);
        translation.addRep('syntax', syntax);
        if(options.display.syntax) {
          console.log(language.toString(syntax));
        }

        // Add an elaboration IR to the translation
        elaboration = language.elaborate(syntax);
        translation.addRep('elaboration', elaboration);
        if(options.display.elaboration) {
          console.log(elaboration.toString());
        }

        if(options.evaluate) {
          // Add an evaluation IR to the translation
          evaluation = language.evaluate(elaboration);
          translation.addRep('evaluation', evaluation);
          if(options.display.evaluation) {
            console.log(evaluation.toString());
          }
        } else if (options.compile) {
          // Add a compilation IR to the translation
          compilation = language.compile(elaboration);
          translation.addRep('compilation', compilation);
          if(options.display.compilation) {
            console.log(compilation.toString());
          }
        }
      });

    } catch (e) {
      if(e instanceof err.General || 
         e instanceof err.Lexical ||
         e instanceof err.Syntax || 
         e instanceof err.Elaboration ||
         e instanceof err.Evaluation) {
        console.log(e.toString());
      } else {
        throw e;
      }
    }
  }
}

exports.drive = drive;

})();

