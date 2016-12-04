angular.module('starter')
        .controller('RouteCtrl',
                function ($scope,
                        mapFactory,
                        $stateParams,
                        uiGmapGoogleMapApi,
                        apiFactory,
                        routeDetailsFactory) {

                    var route = routeDetailsFactory.getTempRouteDetails();
                    $scope.route = route;
                    $scope.route.imgList = [];
                    $scope.routeId = $stateParams.routeId;

                    // get photos by route
                    apiFactory.getPhotosByRoute($scope.route._id)
                            .then(function (success) {
                                $scope.route.imgList = success;
                                // uiGmapGoogleMapApi is a promise.
                                // The "then" callback function provides the google.maps object.
                                uiGmapGoogleMapApi.then(function (maps) {
                                    showMap(maps);
                                });
                            }, function (error) {
                                console.log('Photo list retrieval failed. Error: ' + JSON.stringify(error));
                                uiGmapGoogleMapApi.then(function (maps) {
                                    showMap(maps);
                                });
                            });

                    var showMap = function (maps) {
                        // TODO change default center
                        // the center is the last position
                        var mapCenter = new maps.LatLng(42.000, 21.4333);
                        var mapElement = document.getElementById('route_map');

                        var latLngList = new Array();
                        var markerList = new Array();
                        if ($scope.route.latLngList !== undefined && $scope.route.latLngList !== null && $scope.route.latLngList !== "") {
                            var positonList = $scope.route.latLngList.split(";");
                            positonList.forEach(function (position, index) {
                                var latAndLng = position.split(",");
                                var latlng = new maps.LatLng(latAndLng[0], latAndLng[1]);
                                latLngList.push(latlng);

                                if (index === 0) {
                                    // add start point marker
                                    var startMarker = {
                                        "title": 'My location',
                                        "lat": latAndLng[0],
                                        "lng": latAndLng[1],
                                        "description": "Start position",
                                        "iconUrl": "src/assets/img/marker1.png"
                                    }
                                    markerList.push(startMarker);
                                } else if (index === (positonList.length - 1)) {
                                    // add start point marker
                                    var endMarker = {
                                        "title": 'Final location',
                                        "lat": latAndLng[0],
                                        "lng": latAndLng[1],
                                        "description": "End position",
                                        "iconUrl": "src/assets/img/marker1.png"
                                    }
                                    markerList.push(endMarker);
                                } else {
                                    // TODO delete
                                     var middleMarker = {
                                        "title": 'Middle location',
                                        "lat": latAndLng[0],
                                        "lng": latAndLng[1],
                                        "description": "Middle position",
                                        "iconUrl": "src/assets/img/marker2.png"
                                    }
//                                    markerList.push(middleMarker);
                                }
                            });
                        }

                        mapFactory.showMap(
                                maps, mapCenter, mapElement,
                                markerList,
                                $scope.route.imgList,
                                latLngList,
                                true);
                    }

                });