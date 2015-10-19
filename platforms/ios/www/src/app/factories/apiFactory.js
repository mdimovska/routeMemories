angular.module('starter')
        .factory('apiFactory', function apiFactory($http, $q) {

            var apiFactory = {};

            apiFactory.getBaseUrl = function () {
//            return "http://localhost:5000/";
                return "https://shrouded-fjord-6158.herokuapp.com/";
            }
            apiFactory.getRegisterUrl = function () {
                return apiFactory.getBaseUrl() + "register";
            }
            apiFactory.getRoutesByUserUrl = function (userId) {
//            return apiFactory.getBaseUrl() + "routes/getRoutesByUser?userId=" + userId;
                return apiFactory.getBaseUrl() + "routes";
            }
            apiFactory.getPhotosByRouteUrl = function (routeId) {
                return apiFactory.getBaseUrl() + "images/getImagesByRoute?routeId=" + routeId;
            }
            apiFactory.getAddRouteUrl = function () {
                return apiFactory.getBaseUrl() + "routes";
            }
            apiFactory.getDeleteRouteUrl = function (routeId) {
                return apiFactory.getBaseUrl() + "routes/" + routeId;
            }

            apiFactory.register = function (id, name, pictureUrl) {
                console.log(id);
                console.log(name);
                console.log(pictureUrl);
                var def = $q.defer();
                var registerUrl = apiFactory.getRegisterUrl();

                var postData = {
                    'id': id,
                    'name': name,
                    'pictureUrl': pictureUrl
                };
                $http({
                    method: 'POST',
                    url: registerUrl,
                    data: postData,
                    headers: {'Content-Type': 'application/json'}
                })
                        .then(function () {
                            // success
                            def.resolve("User successfully registered or logged in");
                        }, function () {
                            // failed
                            def.reject("Failed to register");
                        });

                return def.promise;
            }

            /***** route services *****/

            apiFactory.addRoute = function (route, userId) {
                console.log(userId);
                //console.log(route.positionListString);
                //console.log(route.startDate);
                //console.log(route.endDate);
                //console.log(route.routeName);
                //console.log(JSON.stringify(route.imgList));

                // TODO delete
//                var image = {
//                    "dateTaken": route.startDate,
//                    "lat": "42.0049747",
//                    "lng": "21.3962856",
//                    "imageData": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxNy4xLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgNTAgNTAiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDUwIDUwIiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxwb2x5bGluZSBmaWxsPSJub25lIiBzdHJva2U9IiNjODI3MjciIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHBvaW50cz0iDQoJNywyOC44NTIgMjEuOTIxLDQyLjM0OCA0Myw5LjY1MiAiLz4NCjwvc3ZnPg0K"
//                }
//                route.imgList.push(image);

                var def = $q.defer();
                var url = apiFactory.getAddRouteUrl();

                var postData = {
                    'userId': userId,
                    'latLngList': route.positionListString,
                    'startDate': route.startDate,
                    'endDate': route.endDate,
                    'routeName': route.routeName,
                    'imgList': route.imgList
                };

                $http({
                    method: 'POST',
                    url: url,
                    data: postData,
                    headers: {'Content-Type': 'application/json'}
                })
                        .then(function () {
                            // success
                            def.resolve("Route successfully added");
                        }, function () {
                            // failed
                            def.reject("Failed to add route");
                        });

                return def.promise;
            }

            apiFactory.getRoutesByUser = function (userId) {
                var url = apiFactory.getRoutesByUserUrl(userId);
                var def = $q.defer();
                $http.get(url)
                        .success(function (data) {
                            def.resolve(data);
                        })
                        .error(function () {
                            def.reject("Failed to get route list by user");
                        });
                return def.promise;
            }

            apiFactory.getPhotosByRoute = function (routeId) {
                var url = apiFactory.getPhotosByRouteUrl(routeId);
                var def = $q.defer();
                $http.get(url)
                        .success(function (data) {
                            def.resolve(data);
                        })
                        .error(function () {
                            def.reject("Failed to get photo list by route");
                        });
                return def.promise;
            }

            apiFactory.deleteRoute = function (routeId) {
                var url = apiFactory.getDeleteRouteUrl(routeId);
                var def = $q.defer();
                $http.delete(url)
                        .success(function (data) {
                            def.resolve(data);
                        })
                        .error(function () {
                            def.reject("Failed to delete route");
                        });
                return def.promise;
            }

            return apiFactory;
        })