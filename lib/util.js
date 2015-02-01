(function() {
  'use strict';

var fs = require('fs');

function exists(file) {
  return fs.existsSync(file);
}

function mustExist(file) {
  if(!exists(file)) {
    throw new Error(file + ' does not exist!');
  }
}

function mustLoad(file) {
  mustExist(file);
  return require(file);
}

function mayLoad(file) {
  if(exists(file)) {
    return require(file);
  } else {
    return null;
  }
}

exports.exists    = exists;
exports.mustExist = mustExist;
exports.mustLoad  = mustLoad;
exports.mayLoad   = mayLoad;

})();

