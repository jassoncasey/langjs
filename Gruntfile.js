
var _ = require('underscore');
var path = require('path');

module.exports = function(grunt) {

grunt.initConfig({
  jison: {
    dist: {
      options: {
        moduleType: 'js'
      },
      files: [{
        expand: true,
        src: 'lang/**/*.y',
        rename: function(dest, src) {
          return path.resolve(path.dirname(src), 
                              path.basename(src, '.y') + '.js');
        }
      }]
    }
  },
  jshint: {
    all: ['Gruntfile.js', 'lib/**/*.js', 
          'lang/**/*.js', '!lang/**/grammar.js']
  },
  mochaTest: {
    test: {
      src: ['test/**/*.js']
    }
  },
  watch: {
    scripts: {
      files: ['lib/**/*.js', 'lang/**/*.js', 
              'lang/**/grammar.y', '!lang/**/grammar.js',
              'test/**/*.pass', 'test/**/*.fail'],
      tasks: ['default'],
      options: {
        spawn: false,
      },
    },
  },
  clean: ['lang/**/grammar.js']
});

grunt.loadNpmTasks('grunt-jison');
grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.loadNpmTasks('grunt-mocha-test');
grunt.loadNpmTasks('grunt-contrib-clean');
grunt.loadNpmTasks('grunt-contrib-watch');

grunt.registerTask('default', ['jison', 'jshint', 'mochaTest']);
grunt.registerTask('clear', ['clean']);

grunt.registerMultiTask('test', 'asdfasdfsadf', function() {

  _(this).each(function(value, key) {
    console.log('%j = %j', key, value);
  });
  
  this.files.forEach(function(f) {
    console.log(f);
  });

});

};
