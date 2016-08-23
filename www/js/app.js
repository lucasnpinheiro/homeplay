// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers'])
        .constant('Config', {
            //url: 'http://192.168.1.120/homeplay',
            url: 'http://homeplay.agenciavoxel.com.br',
            api: '/',
            timeout: 5000,
            database: 'homeplay',
            appVersion: '00.00.01'
        })
        .run(function ($ionicPlatform, $rootScope, Config) {
            $ionicPlatform.ready(function () {
                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs)
                if (window.cordova && window.cordova.plugins.Keyboard) {
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                    cordova.plugins.Keyboard.disableScroll(true);

                }
                if (window.StatusBar) {
                    // org.apache.cordova.statusbar required
                    StatusBar.styleDefault();
                }
            });

            $rootScope.appVersion = Config.appVersion;
        })

        .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
            $ionicConfigProvider.views.maxCache(0);

            $stateProvider

                    .state('app', {
                        url: '/app',
                        abstract: true,
                        templateUrl: 'templates/menu.html',
                        controller: 'AppCtrl'
                    })

                    .state('app.form', {
                        url: '/form',
                        cache: false,
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/form.html',
                                controller: 'FormCtrl'
                            }
                        }
                    })

                    .state('app.sincronizar', {
                        url: '/sincronizar',
                        cache: false,
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/sincronizar.html',
                                controller: 'SincronizarCtrl'
                            }
                        }
                    })

                    ;
            // if none of the above states are matched, use this as the fallback
            $urlRouterProvider.otherwise('/app/form');
        });
