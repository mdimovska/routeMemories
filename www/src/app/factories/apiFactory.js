angular.module('starter')
        .factory('apiFactory', function apiFactory($http, $q) {

            var apiFactory = {};

            apiFactory.getBaseUrl = function () {
                return "http://localhost:5000/"; //TODO change when everything is up and running on heroku
//                return "https://shrouded-fjord-6158.herokuapp.com/";
            }
            apiFactory.getRegisterUrl = function () {
                return apiFactory.getBaseUrl() + "register";
            }
            apiFactory.getRoutesByUserUrl = function (userId) {
                return apiFactory.getBaseUrl() + "routes/getRoutesByUser?userId=" + userId;
//                return apiFactory.getBaseUrl() + "routes";
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

                var postData = $.param({
                    'id': id,
                    'name': name,
                    'pictureUrl': pictureUrl
                });
                $http({
                    method: 'POST',
                    url: registerUrl,
                    data: postData,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
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
                console.log(route.positionListString);
                console.log(route.startDate);
                console.log(route.endDate);
                console.log(route.routeName);

                var def = $q.defer();
                var url = apiFactory.getAddRouteUrl();

                var postData = $.param({
                    'userId': userId,
                    'latLngList': route.positionListString,
                    'startDate': route.startDate,
                    'endDate': route.endDate,
                    'routeName': route.routeName
                });

                $http({
                    method: 'POST',
                    url: url,
                    data: postData,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
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