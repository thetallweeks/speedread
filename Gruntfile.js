module.exports = function(grunt) {

  // Prevents you from having to run grunt.loadNpmTasks() for every dependency
  require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    connect : {
      server : {
        options: {
          port: 9001,
          livereload : true
        }
      }
    },

    sass: {
      dev : {
        files: {
          'css/app.css': 'css/sass/app.scss'
        }
      }
    },

    autoprefixer: {
      options: {
        browsers: [
          'last 2 version', 'ie 9', 'ie 10'
        ]
      },
      single_file: {
        src: 'css/app.css',
        dest: 'css/app.css'
      }
    },

    cssmin: {
      minify: {
        src: 'css/app.css',
        dest: 'css/app.min.css'
      }
    },

    concat : {
      options : {
        // Add a semicolon because minfication removes line breaks
        separator: ';'
      },
      basic : {
        src: [
          'js/vendor/jquery-1.10.2.min.js',
          'js/main.js'
        ],
        dest: 'js/main.min.js'
      }
    },

    uglify : {
      options: {
        compress : true
      },
      my_target : {
        files : {
          'js/main.min.js' : 'js/main.min.js'
        }
      }
    },

    watch: {
      // Set up watch:dev and watch:dist
      sass: {
        files: [
          'css/sass/**/*.scss'
        ],
        tasks: [
          'sass:dev',
          'autoprefixer',
          'cssmin'
        ],
      },
      js : {
        files : [
          'js/vendor/jquery-1.10.2.min.js',
          'js/main.js'
        ],
        tasks : [
          'concat'
        ]
      },
      livereload: {
        files: [
          '*.html',
          'js/main.min.js',
          'css/*.css',
          'img/**/*.{png,jpg,jpeg,gif,webp,svg}'
        ],
        options: {
          livereload: true
        }
      }
    }
  });

grunt.registerTask('dev', [
  'connect',
  'watch'
]);

grunt.registerTask('dist', [
  'sass',
  'autoprefixer',
  'cssmin',
  'concat',
  'uglify'
]);

grunt.registerTask('default', [
  'watch'
]);

};