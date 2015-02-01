
module.exports = function(grunt) {

grunt.initConfig({
  jison: {
    grammar: {
      options: {
        moduleType: 'js'
      },
      files: [{
        exapnd: true,
        cwd: 'lang/',
        src: ['*.y'],
        dest: 'lang/'
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

};
