angular.module('starter')

        .factory('mapFactory', function mapFactory() {

            var mapFactory = {};
            getMapOptions = function (maps, mapCenter) {
                var mapOptions = {
                    center: mapCenter,
                    zoom: 17,
                    mapTypeId: maps.MapTypeId.ROADMAP
                };
                return mapOptions;
            }

            mapFactory.showMap = function (
                    maps, mapCenter, mapElement,
                    markerList,
                    imgList,
                    latLngList,
                    shouldPositionMapInCenter) {

                var mapOptions = getMapOptions(maps, mapCenter);
                var map = new maps.Map(mapElement, mapOptions);
                var latLngBounds = new maps.LatLngBounds();
                var infoWindow = new maps.InfoWindow();
                if (markerList !== undefined && markerList !== null) {
                    for (var i = 0; i < markerList.length; i++) {
                        var data = markerList[i];
                        var myLatlng = new maps.LatLng(data.lat, data.lng);
                        var markerIcon = {
                            url: data.iconUrl,
                            scaledSize: new maps.Size(31, 50) //25, 40
                        };
                        var marker = new maps.Marker({
                            position: myLatlng,
                            map: map,
                            title: data.title,
                            icon: markerIcon
                        });
                        latLngBounds.extend(marker.position);
                        (function (marker, data) {
                            maps.event.addListener(marker, "mousedown", function (e) {
                                infoWindow.setContent("<div>" + data.description + "</div>");
                                infoWindow.open(map, marker);
                            });
                        })(marker, data);
                    }
                }

                if (imgList !== undefined && imgList !== null) {
                    // add image markers to map
                    for (var i = 0; i < imgList.length; i++) {
                        var image = imgList[i];
                        var imgLatlng = new maps.LatLng(image.lat, image.lng);
                        var imageMarkerIcon = {
                            url: 'src/assets/img/imageMarker.png',
                            scaledSize: new maps.Size(40, 40)
                        };
                        var imgMarker = new maps.Marker({
                            position: imgLatlng,
                            map: map,
                            clickable: true,
                            title: image.title,
                            icon: imageMarkerIcon
                        });
                        latLngBounds.extend(imgMarker.position);
                        var imgSrc = "data:image/jpeg;base64," + image.imageData;
                        var content = '<img style="width: 200px; height: 200px" src="' + imgSrc + '">';
//                        var imgInfoWindow = new maps.InfoWindow(
//                                {
//                                    content: content
//                                }
//                        );
//                        imgMarker.addListener('mousedown', function () {
//                            imgInfoWindow.open(map, imgMarker);
//                        });

                        (function (imgMarker, data) {
                            maps.event.addListener(imgMarker, "mousedown", function (e) {
                                infoWindow.setContent(content);
                                infoWindow.open(map, imgMarker);
                            });
                        })(imgMarker, data);
                    }
                }
                if (shouldPositionMapInCenter !== undefined && shouldPositionMapInCenter === true) {
                    map.setCenter(latLngBounds.getCenter());
                    map.fitBounds(latLngBounds);
                }

                //***********ROUTING****************//

                var directionsService = new maps.DirectionsService;
                var directionsDisplay = new maps.DirectionsRenderer;
                directionsDisplay.setMap(map);
                calculateAndDisplayRoute(maps, directionsService, directionsDisplay, latLngList);
//                //Initialize the Path Array
//                var path = new maps.MVCArray();
//
//                //Initialize the Direction Service
//                var service = new maps.DirectionsService();
//
//                //Set the Path Stroke Color
//                var poly = new maps.Polyline({map: map, strokeColor: '#16a085'});
//
//                //Loop and Draw Path Route between the Points on MAP
//                if (latLngList !== undefined && latLngList !== null) {
//
//                    for (var i = 0; i < latLngList.length; i++) {
//                        if ((i + 1) < latLngList.length) {
//                            var src = latLngList[i];
//                            var des = latLngList[i + 1];
//                            path.push(src);
//                            poly.setPath(path);
//                            service.route({
//                                origin: src,
//                                destination: des,
//                                travelMode: maps.DirectionsTravelMode.WALKING
//                            }, function (result, status) {
//                                if (status == maps.DirectionsStatus.OK) {
//                                    for (var i = 0, len = result.routes[0].overview_path.length; i < len; i++) {
//                                        path.push(result.routes[0].overview_path[i]);
//                                    }
//                                }
//                            });
//                        }
//                    }
//                }
            }
            function calculateAndDisplayRoute(maps, directionsService, directionsDisplay, latLngList) {
                var waypts = [];

                var array = [];
//                if (latLngList % 9 == 0)
                for (var i = 0; i < latLngList.length; i++) {
                    if (array.length === 0) {
                        array.push([]);
                    }
                    var lastArray = array[array.length - 1];
                    if (lastArray.length === 8) {
                        array.push([]);
                    }
//                    lastArray = array[array.length];
                    //it was waypts.push..
                    array[array.length - 1].push({
                        stopover: true,
                        location: latLngList[i]
                    });
                }

                for (var i = 0; i < array.length; i++) {
                    var subarray = array[i];
                    var src = subarray[0].location;
                    var des = subarray[subarray.length - 1].location;
                    
                    directionsService.route({
                        origin: src,
                        destination: des,
                        waypoints: subarray,
                        optimizeWaypoints: true,
                        travelMode: maps.TravelMode.WALKING
                    }, function (response, status) {
                        if (status === maps.DirectionsStatus.OK) {
                            directionsDisplay.setDirections(response);
                            var route = response.routes[0];
                        } else {
                            window.alert('Directions request failed due to ' + status);
                        }
                    });
                }

//                var src = latLngList[0];
//                var des = latLngList[latLngList.length - 1];
//                directionsService.route({
//                    origin: src,
//                    destination: des,
//                    waypoints: waypts,
//                    optimizeWaypoints: true,
//                    travelMode: maps.TravelMode.WALKING
//                }, function (response, status) {
//                    if (status === maps.DirectionsStatus.OK) {
//                        directionsDisplay.setDirections(response);
//                        var route = response.routes[0];
//                    } else {
//                        window.alert('Directions request failed due to ' + status);
//                    }
//                });
            }


            return mapFactory;
        })