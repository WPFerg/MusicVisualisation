module.exports = function(grunt) {

  grunt.initConfig({
    less: {
        files: {
            "build/style.css": "css/style.less"
        }
    },
    copy: {
        main: {
            files: [
                {expand: true, cwd: 'js', src: '**', dest: 'build/js'},
                {expand: true, cwd: 'html', src: '**', dest: 'build/'},
            ]
        }
    },
    watch: {
        less: {
            files: ['css/**/*.less'],
            tasks: ['less']
        },
        default: {
            files: ['css/**/*.less', 'js/**/*.js', 'html/**/*.html'],
            tasks: ['less', 'copy:main']
        }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('default', ['less', 'copy:main', 'watch:default']);

};
