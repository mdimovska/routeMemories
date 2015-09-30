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
                for (i = 0; i < markerList.length; i++) {
                    var data = markerList[i];
                    var myLatlng = new maps.LatLng(data.lat, data.lng);
                    var marker = new maps.Marker({
                        position: myLatlng,
                        map: map,
                        title: data.title
                    });

                    var infoWindow = new maps.InfoWindow({
                        content: "<div>" + data.description + "</div>"
                    });
                    marker.addListener('mousedown', function () {
                        infoWindow.open(map, marker);
                    });
                }

                // add image markers to map
                for (i = 0; i < imgList.length; i++) {
                    var image = imgList[i];
                    var imgLatlng = new maps.LatLng(image.lat, image.lng);
                    var imgMarker = new maps.Marker({
                        position: imgLatlng,
                        map: map,
                        clickable: true,
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
                    imgMarker.addListener('mousedown', function () {
                        imgInfoWindow.open(map, imgMarker);
                    });
                }
                if (shouldPositionMapInCenter !== undefined && shouldPositionMapInCenter === true) {
                    map.setCenter(latLngBounds.getCenter());
                    map.fitBounds(latLngBounds);
                }

                //***********ROUTING****************//

                //Initialize the Path Array
                var path = new maps.MVCArray();

                //Initialize the Direction Service
                var service = new maps.DirectionsService();

                //Set the Path Stroke Color
                var poly = new maps.Polyline({map: map, strokeColor: '#4986E7'});

                //Loop and Draw Path Route between the Points on MAP
                for (var i = 0; i < latLngList.length; i++) {
                    if ((i + 1) < latLngList.length) {
                        var src = latLngList[i];
                        var des = latLngList[i + 1];
                        path.push(src);
                        poly.setPath(path);
                        service.route({
                            origin: src,
                            destination: des,
                            travelMode: maps.DirectionsTravelMode.WALKING
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

            return mapFactory;
        })