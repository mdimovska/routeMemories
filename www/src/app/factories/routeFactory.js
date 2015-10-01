angular.module('starter')

        .factory('routeDetailsFactory', function routeDetailsFactory() {

            var routeDetailsFactory = {};
            var tempRouteDetails = {};

            routeDetailsFactory.setTempRouteDetails = function (routeDetails) {
                tempRouteDetails = routeDetails;
            };
            
            routeDetailsFactory.getTempRouteDetails = function () {
                return tempRouteDetails;
            };

            return routeDetailsFactory;
        });