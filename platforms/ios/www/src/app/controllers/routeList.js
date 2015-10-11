angular.module('starter')
        .controller('RouteListCtrl',
                function ($scope,
                        $rootScope,
                        apiFactory,
                        routeDetailsFactory) {

                    $scope.routeList = [];

                    $scope.data = {
                        showDelete: false
                    };

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

                    $scope.onItemDelete = function (route) {
                        apiFactory.deleteRoute(route._id)
                                .then(function (success) {
                                    console.log('Route deleted');
                                    $scope.routeList.splice($scope.routeList.indexOf(route), 1);
                                }, function (error) {
                                    console.log('Deleting of route failed. Error: ' + JSON.stringify(error));
                                });
                    }
                });