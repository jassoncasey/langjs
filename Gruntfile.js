
module.exports = function(grunt) {

grunt.initConfig({
  jison: {
    target : {
      options: {
        moduleType: 'js'
      },
      files: {
        'lib/grammar.js': 'lib/grammar.y'
      }
    }
  },
  jshint: {
    all: ['Gruntfile.js', 'lib/**/*.js', '!lib/grammar.js']
  },
  mochaTest: {
    test: {
      src: ['test/**/*.js']
    }
  },
  watch: {
    scripts: {
      files: ['lib/**/*.js', 'lib/grammar.y', '!lib/grammar.js',
              'test/**/*.pass', 'test/**/*.fail'],
      tasks: ['default'],
      options: {
        spawn: false,
      },
    },
  },
  clean: ['lib/grammar.js']
});

grunt.loadNpmTasks('grunt-jison');
grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.loadNpmTasks('grunt-mocha-test');
grunt.loadNpmTasks('grunt-contrib-clean');
grunt.loadNpmTasks('grunt-contrib-watch');

grunt.registerTask('default', ['jison', 'jshint', 'mochaTest']);
grunt.registerTask('clear', ['clean']);

};
