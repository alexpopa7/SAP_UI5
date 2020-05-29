'use strict';

module.exports = function(grunt) {

	// get grunt options (console command parameters)
	var sUser = grunt.option('user');
	var sPwd = grunt.option('pwd');
	var sClient = grunt.option('client');

	// load grunt plugins
    require('jit-grunt')(grunt, {
		openui5_preload: 'grunt-openui5',
		configureProxies: 'grunt-connect-proxy',		
        nwabap_ui5uploader: 'grunt-nwabap-ui5uploader'
	});
	

	grunt.initConfig({

		settings: {
            connect: {
                host: 'localhost',
                port: '9555'
            },
            proxy: {
                host: 'i42lp1.informatik.tu-muenchen.de',
                port: '8000'
            }
		},
		
		connect: {
            options: {
                hostname: '<%= settings.connect.host %>',
                port: '<%= settings.connect.port %>',
                livereload: 35729,
                middleware: function (connect, options, defaultMiddleware) {
                    var aMiddlewares = [];
                    aMiddlewares.push(require('grunt-connect-proxy/lib/utils').proxyRequest);
                    aMiddlewares.push(defaultMiddleware);
                    return aMiddlewares;
                }
            },
            connectWebapp: {
                options: {
                    base: ['webapp'],
                    open: true
                }
            },
            proxies: [
                // {
                //     context: '/resources',
                //     host: '<%= settings.proxy.host %>',
                //     port: '<%= settings.proxy.port %>',
                //     https: false,
                //     rewrite: {
                //         '/resources': '/sap/public/bc/ui5_ui5/resources'
                //     }
				// }, 
				{
                    context: '/sap/opu/odata',
                    host: '<%= settings.proxy.host %>',
                    port: '<%= settings.proxy.port %>',
                    https: false
				}
				
            ]
		},
		
		watch: {
            options: {
                livereload: true
            },
            watchWebapp: {
                files: ['webapp/**/*']
            }
        },

		// connect: {
		// 	options: {
		// 		port: 8080,
		// 		hostname: '*'
		// 	},
		// 	src: {},
		// 	dist: {}
		// },

		openui5_connect: {
			src: {
				options: {
					appresources: 'webapp'
				}
			},
			dist: {
				options: {
					appresources: 'dist'
				}
			}
		},

		openui5_preload: {
			component: {
				options: {
					resources: {
						cwd: 'webapp',
						prefix: 'org.ubb.books',
						src: [
							'**/*.js',
							'**/*.fragment.html',
							'**/*.fragment.json',
							'**/*.fragment.xml',
							'**/*.view.html',
							'**/*.view.json',
							'**/*.view.xml',
							'**/*.properties',
							'manifest.json',
							'!test/**'
						]
					},
					dest: 'dist'
				},
				components: true
			}
		},

		nwabap_ui5uploader: {
			upload: {
				options: {
					/*I42*/
                    conn: {
						client: '801',
						server: 'http://i42lp1.informatik.tu-muenchen.de:8000/',
                        // transportRequest: 'I42K902395',
                        useStrictSSL: false,
                        port: 8000
                    },
					auth: {
						user: sUser,
						pwd: sPwd
					},
					ui5: {
						language: 'EN',
						transportno: 'I42K902291',
						package: 'Z801_ALPO',
						bspcontainer: 'Z801_BOOKS_ALPO',
						bspcontainer_text: 'Books UI5 app Szila'
					},
					resources: {
						cwd: 'dist',
						src: '**/*.*'
					}
				}
			}
		},

		clean: {
			dist: 'dist',
			coverage: 'coverage'
		},

		copy: {
			dist: {
				files: [ {
					expand: true,
					cwd: 'webapp',
					src: [
						'**',
						'!test/**'
					],
					dest: 'dist'
				} ]
			}
		},

		eslint: {
			webapp: ['webapp']
		}

	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-openui5');

	// Server task
	// grunt.registerTask('serve', function(target) {
	// 	grunt.task.run('openui5_connect:' + (target || 'src') + ':keepalive');
	// });

	// register serve task
    grunt.registerTask('serve', ['configureProxies:server', 'connect:connectWebapp', 'watch:watchWebapp']);

	// Build task
	grunt.registerTask('build', ['clean:dist', 'openui5_preload', 'copy']);

    grunt.registerTask('deploy', ['build', 'nwabap_ui5uploader:upload']);

	// Default task
	grunt.registerTask('default', ['serve']);
};
