angular.module('starter')

    .factory('mapFactory', function($rootScope) {

        var mapFactory = {};
        getMapOptions = function (maps, mapCenter) {
            var mapOptions = {
                center: mapCenter,
                zoom: 17,
                mapTypeId: maps.MapTypeId.ROADMAP
            };
            return mapOptions;
        }
        var infoWindow;

        mapFactory.showMap = function (maps, mapCenter, mapElement,
                                       markerList,
                                       imgList,
                                       latLngList,
                                       shouldPositionMapInCenter) {

            var mapOptions = getMapOptions(maps, mapCenter);
            var map = new maps.Map(mapElement, mapOptions);
            var latLngBounds = new maps.LatLngBounds();
            infoWindow = new maps.InfoWindow();

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
                            infoWindow.close();
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

                    (function (imgMarker, image) {
                        maps.event.addListener(imgMarker, "mousedown", function (e) {
                            infoWindow.close();
                            var imgSrc = "data:image/jpeg;base64," + image.imageData;
                            var content = '<div class="info-window"><div class="close" onmousedown="closeInfoWindowGlobal()"></div><img style="width: 200px; height: 200px" src="' + imgSrc + '"></div>';
                            infoWindow.setContent(content);
                            infoWindow.open(map, imgMarker);
                        });
                    })(imgMarker, image);
                }
            }


            //maps.event.addListener(  infoWindow, 'closeclick', function(){
            //    infoWindow.close();
            //});


            if (shouldPositionMapInCenter !== undefined && shouldPositionMapInCenter === true) {
                map.setCenter(latLngBounds.getCenter());
                map.fitBounds(latLngBounds);
            }

            //***********ROUTING****************//

            var path = new maps.Polyline({
                path: latLngList,
                geodesic: true,
                strokeColor: '#16a085',
                strokeOpacity: 1.0,
                strokeWeight: 5
            });
            path.setMap(map);

        };


        mapFactory.closeInfoWindow =function(){
            infoWindow.close();
        };

        return mapFactory;
    });

function closeInfoWindowGlobal(){
    angular.element(document.getElementById("ionViewRoute")).scope().closeInfoWindow();
}