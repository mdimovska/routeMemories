// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter',
        [
            'ionic',
            'ngCordova',
            'uiGmapgoogle-maps'
        ])

        .run(function ($ionicPlatform) {
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
        })

        .config(function ($stateProvider, $urlRouterProvider, uiGmapGoogleMapApiProvider, $compileProvider) {

            $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|blob):|data:image\//);

            $stateProvider

                    .state('app', {
                        url: '/app',
                        abstract: true,
                        templateUrl: 'src/app/views/menu.html',
                        controller: 'MenuCtrl'
                    })

                    .state('app.routeList', {
                        url: '/routeList',
                        views: {
                            'menuContent': {
                                templateUrl: 'src/app/views/routeList.html',
                                controller: 'RouteListCtrl'
                            }
                        }
                    })

                    .state('app.home', {
                        url: '/home',
                        views: {
                            'menuContent': {
                                templateUrl: 'src/app/views/home.html',
                                controller: 'HomeCtrl'
                            }
                        }
                    })

                    .state('app.route', {
                        url: '/routeList/:routeId',
                        views: {
                            'menuContent': {
                                templateUrl: 'src/app/views/route.html',
                                controller: 'RouteCtrl'
                            }
                        }
                    })
            // if none of the above states are matched, use this as the fallback
            $urlRouterProvider.otherwise('app/home');

            uiGmapGoogleMapApiProvider.configure({
                key: 'AIzaSyBFOprPOwvx5eWps01IUF3rQvafdsp4iu0 ',
                v: '3.20',
                language: 'en',
                sensor: 'false',
            })
        });
