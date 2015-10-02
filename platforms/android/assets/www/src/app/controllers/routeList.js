angular.module('starter')
        .controller('RouteListCtrl',
                function ($scope,
                        $rootScope,
                        $state,
                        $ionicModal,
                        $cordovaGeolocation,
                        $cordovaCamera,
                        uiGmapGoogleMapApi,
                        routeDetailsFactory) {

                    $scope.routeList = [];

                    // TODO get from server
                    $scope.routeList = [
                        {
                            id: 1,
                            routeName: "Route 1",
                            startDate: new Date(),
                            endDate: new Date(),
                            latLngList: "42.0049747,21.3962856;42.0049747,21.3962856;42.0049747,21.3962856;41.946923, 21.493345"
                        },
                        {
                            id: 2,
                            routeName: "Route 2",
                            startDate: new Date(),
                            endDate: new Date()
                        },
                        {
                            id: 3,
                            routeName: "Route 3",
                            startDate: new Date(),
                            endDate: new Date()
                        }
                    ];

                    $scope.setRouteDetails = function (route) {
                        routeDetailsFactory.setTempRouteDetails(route);
                    }
                });