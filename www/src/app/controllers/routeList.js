angular.module('starter')
        .controller('RouteListCtrl',
                function ($scope,
                        $rootScope,
                        $state,
                        $ionicModal,
                        $cordovaGeolocation,
                        $cordovaCamera,
                        uiGmapGoogleMapApi) {

                    $scope.routeList = [];

                    // TODO get from server
                    $scope.routeList = [
                        {
                            id: 1,
                            title: "Route 1",
                            startDate: new Date(),
                            endDate: new Date()
                        },
                        {
                            id: 2,
                            title: "Route 2",
                            startDate: new Date(),
                            endDate: new Date()
                        },
                        {
                            id: 3,
                            title: "Route 3",
                            startDate: new Date(),
                            endDate: new Date()
                        }
                    ];
                });