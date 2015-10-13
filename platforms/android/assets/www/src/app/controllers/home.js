angular.module('starter')
        .controller('HomeCtrl',
                function ($scope,
                        $rootScope,
                        $ionicModal,
                        $cordovaGeolocation,
                        $cordovaCamera,
                        uiGmapGoogleMapApi,
//                        $interval,
                        mapFactory,
                        $ionicPlatform,
//                        locationFactory,
                        apiFactory) {

                    $ionicPlatform.registerBackButtonAction(function (event) {
                        event.preventDefault();
                    }, 100);


                    $scope.clearCurrentRouteData = function () {
                        console.log("Clearing current route data...");

                        $rootScope.routeObject = {};
                        $rootScope.positionList = new Array();
                        $rootScope.latLngList = new Array();
                        $rootScope.routeObject.markers = new Array();
                        $rootScope.routeObject.imgList = new Array();

                        $rootScope.routeObject.startDate = '';
                        $rootScope.routeObject.endDate = '';
                        $rootScope.routeObject.routeName = '';
                        $rootScope.routeObject.positionListString = '';

                        $rootScope.startPosition = {};
                    }

                    if ($rootScope.started === undefined) {
                        $rootScope.started = false;
                    }
                    $scope.clearCurrentRouteData(); //initialize route data

                    $scope.watchOptions = {
                        timeout: 10000,
                        frequency: 20000, // update every 20 seconds
                        enableHighAccuracy: true, // may cause errors if true
                        maximumAge: 600000
                    };

                    $scope.appendPositionToLists = function (lat, lng) {
                        var location = {
                            latitude: lat,
                            longitude: lng,
                            toString: function () {
                                return this.latitude + "," + this.longitude;
                            }
                        };
                        console.log('lat: ' + lat + ', lng: ' + lng);
                        $rootScope.positionList.push(location);

                        // uiGmapGoogleMapApi is a promise.
                        // The "then" callback function provides the google.maps object.
                        uiGmapGoogleMapApi.then(function (maps) {
                            var latlng = new maps.LatLng(lat, lng);
                            $rootScope.latLngList.push(latlng);
                        });
                    }

                    function calculateDistanceAndAppendOrRejectPosition(latitude, longitude) {
                        uiGmapGoogleMapApi.then(function (maps) {
                            // calculate distance from the last position
                            // if distance < 15m, do not append the position to the list
                            var location1 = new maps.LatLng(
                                    $rootScope.positionList[$rootScope.positionList.length - 1].latitude,
                                    $rootScope.positionList[$rootScope.positionList.length - 1].longitude
                                    );
                            var location2 = new maps.LatLng(
                                    latitude,
                                    longitude);

                            directionsService = new maps.DirectionsService();
                            directionsDisplay = new maps.DirectionsRenderer({
                                suppressMarkers: true,
                                suppressInfoWindows: true
                            });
                            var request = {
                                origin: location1,
                                destination: location2,
                                travelMode: maps.DirectionsTravelMode.WALKING
                            };
                            directionsService.route(request, function (response, status) {
                                if (status == maps.DirectionsStatus.OK)
                                {
                                    var distance = parseFloat(response.routes[0].legs[0].distance.value);
                                    console.log('distance: ' + distance);
//                                    if (distance < 30) {
                                    if (distance > 0) {
                                        // append position to list
                                        console.log("appending position to list");
                                        $scope.appendPositionToLists(latitude, longitude);
                                    }
                                } else {
                                    console.log('getting distance status: ' + status);
                                    console.log('getting distance response: ' + JSON.stringify(response));
                                }
                            });
                        });
                    }
                    ;

                    $scope.watchPositionChanges = function () {
                        console.log("Started watching postion changes...");

                        $scope.watch = $cordovaGeolocation.watchPosition($scope.watchOptions);
                        $scope.watch.then(
                                null,
                                function (err) {
                                    // error
                                    console.log('An error occured while setting watch: ' + JSON.stringify(err));
                                },
                                function (position) {
                                    console.log("Time: " + new Date());
                                    var lat = position.coords.latitude;
                                    var lng = position.coords.longitude;
                                    calculateDistanceAndAppendOrRejectPosition(lat, lng);
                                });

//                            $cordovaGeolocation
//                                    .getCurrentPosition($scope.positionOptions)
//                                    .then(function (position) {
//                                        var lat = position.coords.latitude;
//                                        var lng = position.coords.longitude;
//                                        calculateDistanceAndAppendOrRejectPosition(lat, lng);
//                                    }, function (err) {
//                                        // error
//                                        alert('Can not get position');
//                                        console.log('An error occured while getting possition: ' + JSON.stringify(err));
//                                    });

                    }

                    $scope.positionOptions = {timeout: 10000, enableHighAccuracy: true, maximumAge: 600000};

                    $scope.startOrStop = function () {
                        if (!$rootScope.started) {
//                            locationFactory.getCurrentLocation().then(function (position) {
//                                var lat = position.latitude;
//                                var lng = position.longitude;

                            $cordovaGeolocation
                                    .getCurrentPosition($scope.positionOptions)
                                    .then(function (position) {
                                        var lat = position.coords.latitude;
                                        var lng = position.coords.longitude;
                                        $rootScope.startPosition = {
                                            "lat": lat,
                                            "lng": lng,
                                        }

                                        var marker = {
                                            "title": 'My location',
                                            "lat": lat,
                                            "lng": lng,
                                            "description": "Start position"
                                        }
                                        $rootScope.routeObject.markers.push(marker);

                                        $rootScope.started = true;
                                        $rootScope.routeObject.startDate = new Date();
                                        $scope.appendPositionToLists(lat, lng);

                                        // start watching location changes
                                        $scope.watchPositionChanges();
                                    }, function (error) {
                                        // error
                                        alert('Can not get position');
                                        console.log('An error occured while getting possition: ' + JSON.stringify(error));
                                    });
//                            $cordovaGeolocation
//                                    .getCurrentPosition($scope.positionOptions)
//                                    .then(function (position) {
//                                        var lat = position.coords.latitude;
//                                        var lng = position.coords.longitude;
//                                        $rootScope.startPosition = {
//                                            "lat": lat,
//                                            "lng": lng,
//                                        }
//
//                                        var marker = {
//                                            "title": 'My location',
//                                            "lat": lat,
//                                            "lng": lng,
//                                            "description": "Start position"
//                                        }
//                                        $rootScope.routeObject.markers.push(marker);
//
//                                        $rootScope.started = true;
//                                        $rootScope.routeObject.startDate = new Date();
//                                        $scope.appendPositionToLists(lat, lng);
//
//                                        // start watching location changes
//                                        $scope.watchPositionChanges();
//                                    }, function (err) {
//                                        // error
//                                        alert('Can not get current position');
//                                        console.log('An error occured while getting possition: ' + JSON.stringify(err));
//                                    });
                        } else {
                            $rootScope.started = false;
                            $rootScope.routeObject.endDate = new Date();

                            // clear watch
                            $scope.stopWatchingPositionChanges();

                            $scope.showEndRouteModal();
                        }

                    }

                    $rootScope.stopWatchingPositionChanges = function () {
                        console.log("Stopped watching postion changes...");
                        $scope.watch.clearWatch();
                    }

                    $scope.$on('$destroy', function () {
                        console.log("ondestroy called");
                        // Make sure that the interval is destroyed too
                        $rootScope.stopWatchingPositionChanges();
                    });

                    $scope.saveAndEndRoute = function () {
                        console.log("Saving current route...");

                        // join array of positions into one string
                        $rootScope.routeObject.positionListString = $rootScope.positionList.join(";");
                        // TODO check if should get and append end position?

                        // save route to server
                        apiFactory.addRoute($rootScope.routeObject, $rootScope.userId)
                                .then(function (success) {
                                    // if successfully saved, proceed with the following lines:

                                    // at the end, clear route data
                                    $rootScope.started = false;
                                    $scope.clearCurrentRouteData();

                                    // close dialog
                                    $scope.closeEndRouteModal();

                                }, function (error) {
                                    console.log('Route saving failed. Error: ' + JSON.stringify(error));
                                });
                    }

                    $scope.deleteCurrentRoute = function () {
                        console.log("Deleting current route...");
                        // clear route data
                        $rootScope.started = false;
                        $scope.clearCurrentRouteData();
                        // close dialog
                        $scope.closeEndRouteModal();
                    }

                    $scope.continueCurrentRoute = function () {
                        console.log("Continuing current route...");
                        $rootScope.started = true;
                        // continue watching location changes
                        $scope.watchPositionChanges();
                        // close dialog
                        $scope.closeEndRouteModal();
                    }

                    // Create the map modal that we will use later
                    $ionicModal.fromTemplateUrl('src/app/views/map.html', {
                        scope: $scope
                    }).then(function (modal) {
                        $scope.modal = modal;
                    });

                    // Triggered in the map modal to close it
                    $scope.closeMapModal = function () {
                        $scope.modal.hide();
                    };

                    // Open the map modal
                    $scope.showMapModal = function () {
                        $scope.modal.show();
                    };


                    // Create the end route modal that we will use later
                    $ionicModal.fromTemplateUrl('src/app/views/endRouteModal.html', {
                        scope: $scope
                    }).then(function (modal) {
                        $scope.endRouteModal = modal;
                    });

                    // Triggered in the end route modal to close it
                    $scope.closeEndRouteModal = function () {
                        $scope.endRouteModal.hide();
                    };

                    // Open the end route modal
                    $scope.showEndRouteModal = function () {
                        $scope.endRouteModal.show();
                    };


                    $scope.showCurrentRoute = function () {
                        $scope.showMapModal();

                        // uiGmapGoogleMapApi is a promise.
                        // The "then" callback function provides the google.maps object.
                        uiGmapGoogleMapApi.then(function (maps) {
                            showMap(maps);
                        });
                    }

                    var showMap = function (maps) {
                        // TODO change default center
                        // the center is the last position
                        var mapCenter = new maps.LatLng(42.000, 21.4333);
                        if ($rootScope.positionList !== undefined && $rootScope.positionList.length > 0) {
                            mapCenter = new maps.LatLng(
                                    $rootScope.positionList[$rootScope.positionList.length - 1].latitude,
                                    $rootScope.positionList[$rootScope.positionList.length - 1].longitude
                                    );
                        }
                        var mapElement = document.getElementById('map');

                        mapFactory.showMap(
                                maps, mapCenter, mapElement,
                                $rootScope.routeObject.markers,
                                $rootScope.routeObject.imgList,
                                $rootScope.latLngList,
                                false);

                    }


                    $scope.takePicture = function () {
                        var options = {
                            quality: 50,
                            destinationType: Camera.DestinationType.DATA_URL,
                            sourceType: Camera.PictureSourceType.CAMERA,
                            allowEdit: true,
                            encodingType: Camera.EncodingType.JPEG,
                            targetWidth: 100,
                            targetHeight: 100,
                            popoverOptions: CameraPopoverOptions,
                            saveToPhotoAlbum: false,
                            correctOrientation: true
                        };

                        $cordovaCamera.getPicture(options).then(function (imageData) {
                            $scope.appendMarkerToList(imageData);
                        }, function (err) {
                            alert("Can not take photo: " + JSON.stringify(err));
                            console.log("Can not take photo: " + JSON.stringify(err));
                        });

                    }

                    $scope.pushImageToList = function (lat, lng, imageData, dateTaken) {
                        var image = {
                            "dateTaken": dateTaken,
                            "lat": lat,
                            "lng": lng,
                            "imageData": imageData
                        }
                        $rootScope.routeObject.imgList.push(image);
                    }

                    $scope.appendMarkerToList = function (imageData) {
//                        locationFactory.getCurrentLocation().then(function (position) {
//                            $scope.pushImageToList(position.latitude, position.longitude, imageData, new Date());
//                        }
                        $cordovaGeolocation
                                .getCurrentPosition($scope.positionOptions)
                                .then(function (position) {
                                    $scope.pushImageToList(position.coords.latitude, position.coords.longitude, imageData);
                                }, function (error) {
                                    // error
                                    alert('Can not get current position');
                                    console.log('An error occured while getting possition. Pushing image to list with start location. Error: ' + JSON.stringify(error));
                                    $scope.pushImageToList($scope.currentPosition.lat, $scope.currentPosition.lng, imageData, new Date());

                                });
//                        $cordovaGeolocation
//                                .getCurrentPosition($scope.positionOptions)
//                                .then(function (position) {
//                                    $scope.pushImageToList(position.coords.latitude, position.coords.longitude, imageData, new Date());
//                                }, function (err) {
//                                    // error
//                                    alert('Can not get current position');
//                                    console.log('An error occured while getting possition. Pushing image to list with start location. Error: ' + JSON.stringify(err));
//                                    $scope.pushImageToList($scope.currentPosition.lat, $scope.currentPosition.lng, imageData, new Date());
//                                });
                    }

                });

