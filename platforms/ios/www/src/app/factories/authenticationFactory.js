angular.module('starter')
    .factory('authenticationFactory',
    function authenticationFactory($cordovaFacebook,
                                   $rootScope,
                                   $q) {
        var authenticationFactory = {};

        authenticationFactory.isUserLoggedIn = function () {
            return $cordovaFacebook.getLoginStatus();
        };


        authenticationFactory.logoutUser = function () {
            var def = $q.defer();
            $cordovaFacebook.logout().then(
                function () {
                    $rootScope.userName = "";
                    $rootScope.userId = "";
                    $rootScope.isLoggedIn = false;
                    def.resolve("LoggedOut");
                }, function (error) {
                    def.reject(error);
                });
            return def.promise;
        };


        authenticationFactory.loginUser = function () {
            var def = $q.defer();
            $cordovaFacebook.login(["public_profile", "email"])
                .then(function (success) {
                    console.log(JSON.stringify(success));

                    $rootScope.isLoggedIn = true;

                    $cordovaFacebook.api("me", ["public_profile"])
                        .then(function (success) {
                            console.log("Successfully retrieved user info: " + JSON.stringify(success));
                            $rootScope.userName = success.name;
                            $rootScope.userId = success.id;

                            localStorage.setItem('userId',$rootScope.userId);
                            localStorage.setItem('username',$rootScope.userName);

                            def.resolve('UserInfoRetrieved');
                        }, function (error) {
                            console.log("An error occured while getting user info: " + JSON.stringify(error));
                            console.log("Logging out...");
                            alert("An error occured while logging in");
                            def.reject('UserInfoNOTRetrieved');
                        });

                }, function (error) {
                    console.log("An error occured while logging in: " + JSON.stringify(error));
                    alert("An error occured while logging in");
                    def.reject('userNotAbleToLogIn');
                });
            return def.promise;
        };


        return authenticationFactory;
    });
