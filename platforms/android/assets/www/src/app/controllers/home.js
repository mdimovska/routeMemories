angular.module('starter')
        .controller('HomeCtrl',
                function (
                        $scope,
                        $rootScope,
                        $state,
                        $ionicModal,
                        $cordovaGeolocation,
                        $cordovaCamera
                        ) {
                    if ($rootScope.started === undefined) {
                        $rootScope.started = false;
                    }

                    $rootScope.positionList = new Array();
                    $rootScope.latLngList = new Array();
                    $rootScope.markers = new Array();
//                        {
//                            "title": 'My location',
//                            "lat": $scope.myLocation.latitude,
//                            "lng": $scope.myLocation.longitude,
//                            "description": "This is my location"
//                        }
//                        ,
//                        {
//                            "title": 'Venue location',
//                            "lat": $scope.placeLocation.latitude,
//                            "lng": $scope.placeLocation.longitude,
//                            "description": formattedAddressOfPlace
//                        }


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

                        var latlng = new google.maps.LatLng(lat, lng);
                        $rootScope.latLngList.push(latlng);
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

                                        var marker = {
                                            "title": 'My location',
                                            "lat": lat,
                                            "lng": lng,
                                            "description": "Start position"
                                        }
                                        $scope.markers.push(marker);

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
                            $rootScope.markers = new Array();

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

                        showMap();
                    }


                    var showMap = function () {
                        // TODO change default center
                        var mapCenter = new google.maps.LatLng(2, 1);
                        if ($rootScope.positionList !== undefined && $rootScope.positionList.length > 0) {
                            mapCenter = new google.maps.LatLng(
                                    $rootScope.positionList[$rootScope.positionList.length - 1].latitude,
                                    $rootScope.positionList[$rootScope.positionList.length - 1].longitude
                                    );
                        }
                        var mapOptions = {
                            center: mapCenter,
                            zoom: 17,
                            mapTypeId: google.maps.MapTypeId.ROADMAP
                        };
                        var map = new google.maps.Map(document.getElementById('map'), mapOptions);

                        var infoWindow = new google.maps.InfoWindow();
                        var latLngBounds = new google.maps.LatLngBounds();
                        for (i = 0; i < $rootScope.markers.length; i++) {
                            var data = $rootScope.markers[i];
                            var myLatlng = new google.maps.LatLng(data.lat, data.lng);
                            var marker = new google.maps.Marker({
                                position: myLatlng,
                                map: map,
                                title: data.title
                            });
                            latLngBounds.extend(marker.position);
                            (function (marker, data) {
                                google.maps.event.addListener(marker, "click", function (e) {
                                    infoWindow.setContent(data.description);
                                    infoWindow.open(map, marker);
                                });
                            })(marker, data);
                        }
//                        map.setCenter(latLngBounds.getCenter());
//                        map.fitBounds(latLngBounds);

                        //***********ROUTING****************//

                        //Initialize the Path Array
                        var path = new google.maps.MVCArray();

                        //Initialize the Direction Service
                        var service = new google.maps.DirectionsService();

                        //Set the Path Stroke Color
                        var poly = new google.maps.Polyline({map: map, strokeColor: '#4986E7'});

                        //Loop and Draw Path Route between the Points on MAP
                        for (var i = 0; i < $rootScope.latLngList.length; i++) {
                            if ((i + 1) < $rootScope.latLngList.length) {
                                var src = $rootScope.latLngList[i];
                                var des = $rootScope.latLngList[i + 1];
                                path.push(src);
                                poly.setPath(path);
                                service.route({
                                    origin: src,
                                    destination: des,
                                    travelMode: google.maps.DirectionsTravelMode.DRIVING
                                }, function (result, status) {
                                    if (status == google.maps.DirectionsStatus.OK) {
                                        for (var i = 0, len = result.routes[0].overview_path.length; i < len; i++) {
                                            path.push(result.routes[0].overview_path[i]);
                                        }
                                    }
                                });
                            }
                        }

                    }


                    $scope.takePicture = function () {

//                        var options = {
//                            destinationType: Camera.DestinationType.FILE_URI,
//                            sourceType: Camera.PictureSourceType.CAMERA,
//                        };

//                            $cordovaCamera.getPicture(options).then(function (imageURI) {
////                                var image = document.getElementById('myImage');
////                                image.src = imageURI;
//                                $scope.imgURI = imageURI;
//                            }, function (err) {
//                                // error
//                                 alert("Can not take photo: " + JSON.stringify(err));
////                                console.log("Can not take photo: " + JSON.stringify(err));
//                            });
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
//                                var image = document.getElementById('myImage');
//                                image.src = "data:image/jpeg;base64," + imageData;
                            alert(imageData);
                            $scope.imgURI = "data:image/jpeg;base64," + imageData;

                        }, function (err) {
                            // error
                            alert("Can not take photo: " + JSON.stringify(err));
                            console.log("Can not take photo: " + JSON.stringify(err));
                        });

                    }



                });

