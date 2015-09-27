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


                    $scope.watchOptions = {
                        timeout: 3000,
                        enableHighAccuracy: false // may cause errors if true
                    };

                    $scope.startOrStop = function () {
                        if (!$rootScope.started) {
                            $rootScope.started = true;
                            // start watching location changes
                            var posOptions = {timeout: 10000, enableHighAccuracy: false};
                            $cordovaGeolocation
                                    .getCurrentPosition(posOptions)
                                    .then(function (position) {
                                        var lat = position.coords.latitude;
                                        var long = position.coords.longitude;
                                        alert(lat + ",   " + long);
                                    }, function (err) {
                                        // error
                                    });



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
                                        console.log('lat: ' + lat + ', lng: ' + lng);
                                    });
                        } else {
                            $rootScope.started = false;

                            // clear watch
                            // $scope.watch.clearWatch();
                            // OR
                            $cordovaGeolocation.clearWatch($scope.watch)
                                    .then(function (result) {
                                        // success
                                        console.log('watch cleared');
                                    }, function (error) {
                                        // error
                                        console.log('An error occured while clearing watch: ' + JSON.stringify(error));
                                    });
                        }

                    }
                });

