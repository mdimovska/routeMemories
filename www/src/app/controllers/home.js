angular.module('starter')
    .controller('HomeCtrl',
    function ($scope,
              $rootScope,
              $state,
              $ionicModal,
              $cordovaGeolocation,
              $cordovaCamera,
              uiGmapGoogleMapApi) {
        if ($rootScope.started === undefined) {
            $rootScope.started = false;
        }

        $rootScope.positionList = new Array();
        $rootScope.latLngList = new Array();
        $rootScope.markers = new Array();
        $rootScope.imgList = new Array();
        $rootScope.startPosition = {};

        $scope.watchOptions = {
            timeout: 10000,
            enableHighAccuracy: true, // may cause errors if true
            maximumAge: 600000
        };

        $scope.appendPositionToLists = function (lat, lng) {
            var location = {
                latitude: lat,
                longitude: lng,
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
                        $scope.markers.push(marker);

                        $rootScope.started = true;
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
                $rootScope.imgList = new Array();
                $rootScope.startPosition = {};

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

            // uiGmapGoogleMapApi is a promise.
            // The "then" callback function provides the google.maps object.
            uiGmapGoogleMapApi.then(function (maps) {
                showMap(maps);
            });
        }


        var showMap = function (maps) {
            // TODO change default center
            var mapCenter = new maps.LatLng(2, 1);
            if ($rootScope.positionList !== undefined && $rootScope.positionList.length > 0) {
                mapCenter = new maps.LatLng(
                    $rootScope.positionList[$rootScope.positionList.length - 1].latitude,
                    $rootScope.positionList[$rootScope.positionList.length - 1].longitude
                );
            }
            var mapOptions = {
                center: mapCenter,
                zoom: 17,
                mapTypeId: maps.MapTypeId.ROADMAP
            };
            var map = new maps.Map(document.getElementById('map'), mapOptions);

            var latLngBounds = new maps.LatLngBounds();
            for (i = 0; i < $rootScope.markers.length; i++) {
                var data = $rootScope.markers[i];
                var myLatlng = new maps.LatLng(data.lat, data.lng);
                var marker = new maps.Marker({
                    position: myLatlng,
                    map: map,
                    title: data.title
                });

                var infoWindow = new maps.InfoWindow({
                    content:"<div>" + data.description + "</div>"
                });
                marker.addListener('mousedown', function() {
                    infoWindow.open(map, marker);
                });
            }


            // add image markers to map
            for (i = 0; i < $rootScope.imgList.length; i++) {
                var image = $rootScope.imgList[i];
                var imgLatlng = new maps.LatLng(image.lat, image.lng);
                var imgMarker = new maps.Marker({
                    position: imgLatlng,
                    map: map,
                    clickable : true,
                    title: image.title
                });
                latLngBounds.extend(imgMarker.position);
                var imgSrc = "data:image/jpeg;base64," + image.imageData;
                var content = '<img style="width: 200px; height: 200px" src="' + imgSrc + '">';
                var imgInfoWindow = new maps.InfoWindow(
                    {
                        content: content
                    }
                );
                imgMarker.addListener('mousedown', function() {
                    imgInfoWindow.open(map, imgMarker);
                });
            }



//                        map.setCenter(latLngBounds.getCenter());
//                        map.fitBounds(latLngBounds);

            //***********ROUTING****************//

            //Initialize the Path Array
            var path = new maps.MVCArray();

            //Initialize the Direction Service
            var service = new maps.DirectionsService();

            //Set the Path Stroke Color
            var poly = new maps.Polyline({map: map, strokeColor: '#4986E7'});

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
                        travelMode: maps.DirectionsTravelMode.DRIVING
                    }, function (result, status) {
                        if (status == maps.DirectionsStatus.OK) {
                            for (var i = 0, len = result.routes[0].overview_path.length; i < len; i++) {
                                path.push(result.routes[0].overview_path[i]);
                            }
                        }
                    });
                }
            }

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
                $scope.imgURI = "data:image/jpeg;base64," + imageData;

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
            $scope.imgList.push(image);
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
                    $scope.pushImageToList($scope.currentPosition.lat, $scope.currentPosition.lng, imageData)
                });
        }

    });

