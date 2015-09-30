angular.module('starter')
        .controller('RouteCtrl',
                function ($scope,
                        $rootScope,
                        $state,
                        $ionicModal,
                        $cordovaGeolocation,
                        mapFactory,
                        $stateParams,
                        uiGmapGoogleMapApi) {
                    $scope.routeId = $stateParams.routeId;

                    // uiGmapGoogleMapApi is a promise.
                    // The "then" callback function provides the google.maps object.
                    uiGmapGoogleMapApi.then(function (maps) {
                        showMap(maps);
                    });

                    var showMap = function (maps) {
                        // TODO change default center
                        // the center is the last position
                        var mapCenter = new maps.LatLng(42.000, 21.4333);
                        var mapElement = document.getElementById('route_map');

                        mapFactory.showMap(
                                maps, mapCenter, mapElement,
                                $rootScope.markers,
                                $rootScope.imgList,
                                $rootScope.latLngList,
                                true);
                    }

                });