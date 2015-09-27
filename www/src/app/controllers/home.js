angular.module('starter')
        .controller('HomeCtrl',
                function (
                        $scope,
                        $rootScope,
                        $state,
                        $ionicSideMenuDelegate,
                        $ionicModal,
                        $timeout,
                        $cordovaGeolocation
                        ) {
                    if ($rootScope.started === undefined) {
                        $rootScope.started = false;
                    }

                    $rootScope.positionList = new Array();
                    $rootScope.latLngList = new Array();

                    $scope.watchOptions = {
                        timeout: 10000,
                        enableHighAccuracy: false // may cause errors if true
                    };

                    $scope.appendPositionToLists = function (lat, lng) {
                        var location = {
                            latitude: lat,
                            longitude: lng,
                        };
                        console.log('lat: ' + lat + ', lng: ' + lng);
                        $rootScope.positionList.push(location);

//                        var latlng = new google.maps.LatLng(lat, lng);
//                        $rootScope.latLngList.push(latlng);
                    }

                    $scope.watchPositionChanges = function () {
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

                    $scope.startOrStop = function () {
                        if (!$rootScope.started) {
                            // start watching location changes
                            var posOptions = {timeout: 10000, enableHighAccuracy: false};
                            $cordovaGeolocation
                                    .getCurrentPosition(posOptions)
                                    .then(function (position) {
                                        var lat = position.coords.latitude;
                                        var lng = position.coords.longitude;
                                        $rootScope.started = true;
                                        $scope.appendPositionToLists(lat, lng);

                                        $scope.watchPositionChanges();
                                    }, function (err) {
                                        // error
                                        alert('Can not get current position');
                                        console.log('An error occured while getting possition: ' + JSON.stringify(err));
                                    });
                        } else {
                            $rootScope.started = false;

                            // clear watch
                            $scope.watch.clearWatch();
                            // OR
//                                $cordovaGeolocation.clearWatch($scope.watch)
//                                        .then(function (result) {
//                                            // success
//                                            console.log('watch cleared');
//                                        }, function (error) {
//                                            // error
//                                            console.log('An error occured while clearing watch: ' + JSON.stringify(error));
//                                        });

                            // TODO save route to server
                            // at the end, clear route data
                            $rootScope.positionList = new Array();
                            $rootScope.latLngList = new Array();

                        }

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


                    $scope.showCurrentRoute = function () {
                        $scope.showMapModal();
                    }
                });

