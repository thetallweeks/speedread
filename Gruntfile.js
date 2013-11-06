module.exports = function(grunt) {

  // Prevents you from having to run grunt.loadNpmTasks() for every dependency
  require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    sass: {
      dev: {
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

    watch: {
      sass: {
        files: [
          'css/sass/**/*.scss'
        ],
        tasks: [
          'sass:dev',
          'autoprefixer'
        ],
      },
      livereload: {
        files: [
          '*.html',
          'js/**/*.{js,json}',
          'css/*.css',
          'img/**/*.{png,jpg,jpeg,gif,webp,svg}'
        ],
        options: {
          livereload: true
        }
      }
    }

  });

  grunt.registerTask('default', [
    'watch'
  ]);

};