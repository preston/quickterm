module.exports = function (grunt) {
  var webpack = require('webpack');
  var path = require('path');

  // Store location settings
  // var settings = grunt.file.readJSON('gruntfile.settings.json');

  // Get and store version
  var versionData = grunt.file.readJSON('src/version.json').version,
    version = versionData.major + '.' + versionData.minor + '.' + versionData.patch;


  var publicOAuthId = process.env.TASTYTERM_OAUTH_CLIENT_ID
    ? process.env.TASTYTERM_OAUTH_CLIENT_ID
    : "0a3dc7ab-fd0b-408a-bbb9-4224d8451e81";

  // Project configuration
  var config = {
    mode: 'development',
    pkg: grunt.file.readJSON('package.json'),
    // settings: settings,
    // Clean folders or files
    clean: {
      build: {
        src: ['./build']
      }
    },

    sass: {
      build: {
        options: {
          sourceMap: true
        },
        files: [{
          cwd: 'src/app/stylesheets',
          src: '**/*.sass',
          dest: 'build/css/',
          expand: true,
          ext: '.css'
        }]
      }
    },

    pug: {
      build: {
        options: {
          pretty: true
        },
        files: [{
          cwd: "src/app/views",
          src: "**/*.pug",
          dest: "build",
          expand: true,
          ext: ".html"
        }]
      }
    },

    copy: {
      build: {
        options: {},
        files: [{
          cwd: 'node_modules/bootstrap/fonts',
          src: "*",
          dest: 'build/fonts/',
          expand: true
        }, {
          cwd: 'node_modules/font-awesome/fonts',
          src: "*",
          dest: 'build/fonts/',
          expand: true
        }, {
          cwd: 'src/images/',
          src: '**/*',
          dest: 'build/images/',
          expand: true
        }]
      }
    },

    concat: {
      build: {
        files: [{
          src: [
            "node_modules/bootstrap/dist/css/bootstrap.min.css",
            "node_modules/font-awesome/css/font-awesome.min.css",
            "node_modules/angular2-toaster/toaster.css"
          ],
          dest: 'build/css/extra.css'
        }]
      }
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          vendor: {
            name: "vendor",
            test: "vendor",
            enforce: true
          }
        }
      }
    },
    webpack: {
      build: {
        entry: {
          'main': './src/main.ts',
          'vendor': './src/vendor.ts'
        },
        output: {
          path: __dirname + '/build/',
          publicPath: "/",
          filename: '[name].bundle.js',
          chunkFilename: "[id].bundle.js",
          sourceMapFilename: "[name].bundle.js.map"
        },
        plugins: [
          // compile time plugins
          new webpack.DefinePlugin({
            'process.env.TASTYTERM_OAUTH_CLIENT_ID': JSON.stringify(publicOAuthId),
          }),
          // new webpack.optimize.DedupePlugin(),
          // new webpack.optimize.UglifyJsPlugin({
          //     beautify: false,
          //     mangle: {
          //         screw_ie8: true,
          //         keep_fnames: true
          //     },
          //     compress: {
          //         screw_ie8: true,
          //         warnings: false
          //     },
          //     comments: false
          // }),
          // new webpack.ResolverPlugin(new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin('bower.json', ['main'])),
          new webpack.ProvidePlugin({
            $: "jquery",
            jquery: "jquery",
            "window.jQuery": "jquery",
            jQuery: "jquery"
          })
        ],
        resolve: {
          extensions: ['.tsx', '.ts', '.js'],
          modules: [path.resolve(__dirname, './src'), "node_modules"]
        },
        module: {
          // preLoaders: [{
          //     loader: "source-map-loader"
          // }],
          rules: [
            {
              test: /\.tsx?$/,
              use: ['ts-loader', 'angular2-router-loader'],
              exclude: /node_modules/
            }
          ],
          noParse: [path.join(path.resolve(__dirname, 'node_modules'), '@angular', 'bower_components')],
        },
        devServer: {
          historyApiFallback: true
        },
        watch: false,
        keepalive: false
      }
    },

    watch: {
      options: {
        interrupt: true,
        // livereload: true,
        spawn: true
      },
      sass: {
        files: ['src/**/*.sass'],
        tasks: ['sass'],
      },
      pug: {
        files: ['src/**/*.pug'],
        tasks: ['pug'],
      },
      webpack: {
        files: ['src/**/*.ts'],
        tasks: ['webpack'],
        options: {
          livereload: true
        }
      }
    },

    // Serve stuff while grunt is running
    connect: {
      build: {
        options: {
          port: 4200,
          base: 'build',
          // open: true,
          keepalive: true
          // livereload: true
        }
      }
    },

    // Watch tasks concurrently
    concurrent: {
      options: {
        logConcurrentOutput: true
      },
      build: ['watch:sass', 'watch:pug', 'watch:webpack', 'connect']
    },

  };

  return config;
};