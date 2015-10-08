angular.module('starter')
        .controller('RouteListCtrl',
                function ($scope,
                        $rootScope,
                        apiFactory,
                        routeDetailsFactory) {

                    $scope.routeList = [];

                    apiFactory.getRoutesByUser($rootScope.userId)
                            .then(function (success) {
                                console.log('route list by user: ' + JSON.stringify(success));
                                $scope.routeList = success;
                            }, function (error) {
                                console.log('Route list retrieval failed. Error: ' + JSON.stringify(error));
                            });

                    $scope.setRouteDetails = function (route) {
                        routeDetailsFactory.setTempRouteDetails(route);
                    }
                });