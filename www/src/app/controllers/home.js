angular.module('starter')
        .controller('HomeCtrl',
                function ($scope,
                        $rootScope,
                        $ionicModal,
                        $cordovaGeolocation,
                        $cordovaCamera,
                        uiGmapGoogleMapApi,
                        mapFactory,
                        apiFactory) {

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
                                    var lat = position.coords.latitude;
                                    var lng = position.coords.longitude;
                                    $scope.appendPositionToLists(lat, lng);
                                });
                    }

                    $scope.positionOptions = {timeout: 10000, enableHighAccuracy: true, maximumAge: 600000};

                    $scope.startOrStop = function () {
                        if (!$rootScope.started) {
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
                                    }, function (err) {
                                        // error
                                        alert('Can not get current position');
                                        console.log('An error occured while getting possition: ' + JSON.stringify(err));
                                    });
                        } else {
                            $rootScope.started = false;
                            $rootScope.routeObject.endDate = new Date();

                            // clear watch
                            // TODO check this
                            $scope.stopWatchingPositionChanges();

                            $scope.showEndRouteModal();
                        }

                    }

                    $scope.stopWatchingPositionChanges = function () {
                        console.log("Stopped watching postion changes...");
                        $scope.watch.clearWatch();
                    }


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

                    $scope.pushImageToList = function (lat, lng, imageData) {
                        var image = {
                            "title": 'Image',
                            "lat": lat,
                            "lng": lng,
                            "description": "Image",
                            "imageData": imageData
                        }
                        $rootScope.routeObject.imgList.push(image);
                    }

                    $scope.appendMarkerToList = function (imageData) {
                        $cordovaGeolocation
                                .getCurrentPosition($scope.positionOptions)
                                .then(function (position) {
                                    $scope.pushImageToList(position.coords.latitude, position.coords.longitude, imageData);
                                }, function (err) {
                                    // error
                                    alert('Can not get current position');
                                    console.log('An error occured while getting possition. Pushing image to list with start location. Error: ' + JSON.stringify(err));
                                    $scope.pushImageToList($scope.currentPosition.lat, $scope.currentPosition.lng, imageData);
                                });
                    }

                });

