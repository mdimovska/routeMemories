angular.module('starter')
        .controller('LoginCtrl',
                function (
                        $scope,
                        $rootScope,
                        $state,
                        $ionicSideMenuDelegate,
                        $ionicModal,
                        $timeout,
                        $cordovaFacebook,
                        apiFactory
                        ) {

                    if ($rootScope.isLoggedIn) {
                        console.log("User logged in. Redirecting to home page.");
                        $state.go('app.home');
                    }

                    $scope.register = function (id, firstName, lastName, pictureUrl) {
                        apiFactory.register(id, firstName, lastName, pictureUrl)
                                .then(function (success) {
                                    console.log("User successfully registered or logged in. Redirecting to home page.");
                                    $state.go('app.home');
                                }, function (error) {
                                    console.log('Registering failed. Error: ' + JSON.stringify(error));
                                    console.log("Logging out from fb...");
                                    $scope.logoutFromFb();
                                });
                    };

                    $scope.logoutFromFb = function () {
                        // logout
                        $cordovaFacebook.logout()
                                .then(function (success) {
                                    // success
                                    console.log("Successfully logged out");
                                    $rootScope.userName = "";
                                    $rootScope.userId = "";
                                    $rootScope.isLoggedIn = false;
                                }, function (error) {
                                    console.log("An error occured while logging out: " + JSON.stringify(error));
                                });
                    }
                    // Perform the login action when the user clicks the login button
                    $scope.loginOrLogout = function () {
                        console.log('Doing login');

//                        // new
//                        if (!window.cordova) {
//                            var appID = 907283522693609;
//                            facebookConnectPlugin.browserInit(appID);
//                        }


                        $cordovaFacebook.login(["public_profile", "email", "user_friends"])
                                .then(function (success) {
                                    // { id: "634565435",
                                    //   lastName: "bob"
                                    //   ...
                                    // }
                                    console.log(JSON.stringify(success));
                                    $rootScope.isLoggedIn = true;

                                    // get info about logged in user
                                    $cordovaFacebook.api("me", ["public_profile"])
                                            .then(function (success) {
                                                // success
                                                console.log("Successfully retrieved user info: " + JSON.stringify(success));
                                                $rootScope.userName = success.name;
                                                $rootScope.userId = success.id;

                                                $scope.register($rootScope.userId, $rootScope.userName, "//graph.facebook.com/" + $rootScope.userId + "/picture?width=80&height=80");
                                            }, function (error) {
                                                console.log("An error occured while getting user info: " + JSON.stringify(error));
                                                console.log("Logging out...");
                                                alert("An error occured while logging in");

                                                // logging out...
                                                $scope.logoutFromFb();
                                            });

                                }, function (error) {
                                    console.log("An error occured while logging in: " + JSON.stringify(error));
                                    alert("An error occured while logging in");
                                });
                    };

                });

