
var path = require('path');
var fs   = require('fs');
var _    = require('underscore');

var lang = require('./language');

var PLUGINS = path.resolve(__dirname, '..', 'plugin');

// Module shouldn't load without requisite subdirectories
if(!fs.existsSync(PLUGINS)) {
  throw new Error(PLUGINS + ' does not exist!');
}

function Plugin(name) {
  this.name = name;
}

function ls() {
  return _(fs.readdirSync(PLUGINS)).filter(function(name) {
    var candidate = path.join(PLUGINS, name);
    return fs.statSync(candidate).isDirectory();
  });
}

exports.ls     = ls;
exports.Plugin = Plugin;

