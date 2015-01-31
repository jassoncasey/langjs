
var path = require('path');
var fs   = require('fs');
var _    = require('underscore');

var LANGUAGES = path.resolve(__dirname, '..', 'lang');

// Module shouldn't load without requisite subdirectories
if(!fs.existsSync(LANGUAGES)) {
  throw new Error(LANGUAGES + ' does not exist!');
}

function Language(name) {
  this.name = name;
}

function ls() {
  return _(fs.readdirSync(LANGUAGES)).filter(function(name) {
    var candidate = path.join(LANGUAGES, name);
    return fs.statSync(candidate).isDirectory();
  });
}

exports.ls       = ls;
exports.Language = Language;

