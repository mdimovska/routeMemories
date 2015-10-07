angular.module('starter')
        .factory('apiFactory', function apiFactory($http, $q) {

            var apiFactory = {};

            apiFactory.getPlacesUrl = function (categoryId, location) {
                if (location === undefined) {
                    location = {
                        latitude: 1,
                        longitude: 2
                    }
                }
                if (categoryId === undefined || categoryId === '') {
                    categoryId = '4d4b7105d754a06374d81259';
                }
                var ll = location.latitude + ',' + location.longitude;
                return 'https://api.foursquare.com/v2/venues/explore?client_id=WKTSZRJQFBX5LAIGIPTZ0O3XJLX45SOKRRT3JAWQZBNTMDSY&client_secret=X4MV2K10DTQF0O3AEJAF13GRNFIWPXI3PFKPBGJ2OXRTC5TB&ll=' + ll + '&categoryId=' + categoryId + '&v=20150805&venuePhotos=1';
            }

            apiFactory.getTipsUrl = function (placeId) {
                return 'https://api.foursquare.com/v2/venues/' + placeId + '/tips?sort=recent&client_id=WKTSZRJQFBX5LAIGIPTZ0O3XJLX45SOKRRT3JAWQZBNTMDSY&client_secret=X4MV2K10DTQF0O3AEJAF13GRNFIWPXI3PFKPBGJ2OXRTC5TB&v=20150805';
            }

            apiFactory.getSearchUrl = function (query, location) {
                if (location === undefined) {
                    location = {
                        latitude: 1,
                        longitude: 2
                    }
                }
                var ll = location.latitude + ',' + location.longitude;
                var categoryIdList = '';
                var categoryList = apiFactory.getCategories();
                for (var i = 0; i < categoryList.length; i++) {
                    categoryIdList += categoryList[i]['id'];
                    categoryIdList += ',';
                }
                return 'https://api.foursquare.com/v2/venues/search?client_id=WKTSZRJQFBX5LAIGIPTZ0O3XJLX45SOKRRT3JAWQZBNTMDSY&client_secret=X4MV2K10DTQF0O3AEJAF13GRNFIWPXI3PFKPBGJ2OXRTC5TB&v=20150805&ll=' + ll + '&query=' + query + '&categoryId=' + categoryIdList;
            }

            apiFactory.getPlaces = function (categoryId, location) {
                var placesUrl = apiFactory.getPlacesUrl(categoryId, location);
                var def = $q.defer();
                $http.get(placesUrl)
                        .success(function (data) {
                            def.resolve(data);
                        })
                        .error(function () {
                            def.reject("Failed to get place list");
                        });
                return def.promise;
            }

            apiFactory.getTips = function (placeId) {
                var tipsUrl = apiFactory.getTipsUrl(placeId);
                var def = $q.defer();
                $http.get(tipsUrl)
                        .success(function (data) {
                            def.resolve(data);
                        })
                        .error(function () {
                            def.reject("Failed to get tips");
                        });
                return def.promise;
            }

            apiFactory.getSearchResults = function (query, location) {
                var searchUrl = apiFactory.getSearchUrl(query, location);
                var def = $q.defer();
                $http.get(searchUrl)
                        .success(function (data) {
                            def.resolve(data);
                        })
                        .error(function () {
                            def.reject("Failed to get search results");
                        });
                return def.promise;
            }

            function getRandomNumber(toNumber) {
                return Math.floor((Math.random() * toNumber));
            }
            function getRandom(list) {
                return list[Math.floor((Math.random() * list.length))];
            }

            apiFactory.getRandomPlace = function (location) {
                var categories = apiFactory.getCategories();

                //get random category
                var categoryId = getRandom(categories).id;

                var def = $q.defer();
                var placesUrl = apiFactory.getPlacesUrl(categoryId, location);

                $http.get(placesUrl)
                        .success(function (data) {
                            var i = getRandomNumber(data.response.groups[0].items.length);
                            var result = data.response.groups[0].items[i];
                            def.resolve(result);
                        })
                        .error(function () {
                            def.reject("Failed to get random place");
                        });
                return def.promise;
            }
            apiFactory.getBaseUrl = function () {
                return "http://localhost:8080"; //TODO change when everything is up and running on heroku
            }
            apiFactory.getRegisterUrl = function () {
                return apiFactory.getBaseUrl() + "/register";
            }
            apiFactory.register = function (id, name, pictureUrl) {
                console.log(id);
                console.log(name);
                console.log(pictureUrl);
                var def = $q.defer();
                var registerUrl = apiFactory.getRegisterUrl();

                var postData = $.param({
                    json: JSON.stringify({
                        id: id,
                        name: name,
                        pictureUrl: pictureUrl
                    })
                });

                var xsrf = $.param({
                    'id': id,
                    'name': name,
                    'pictureUrl': pictureUrl
                });
                $http({
                    method: 'POST',
                    url: registerUrl,
                    data: xsrf,
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
            return apiFactory;
        })