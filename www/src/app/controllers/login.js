angular.module('starter')
        .controller('LoginCtrl',
                function (
                        $scope,
                        $rootScope,
                        $state,
                        $ionicSideMenuDelegate,
                        $ionicModal,
                        $timeout,
                        $cordovaFacebook
                        ) {

                    if ($rootScope.isLoggedIn) {
                        console.log("User logged in. Redirecting to home page.");
                        $state.go('app.home');
                    }

                    // Perform the login action when the user clicks the login button
                    $scope.loginOrLogout = function () {
                        console.log('Doing login');

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

                                                console.log("User successfully logged in. Redirecting to home page.");
                                                $state.go('app.home');
                                            }, function (error) {
                                                console.log("An error occured while getting user info: " + JSON.stringify(error));
                                                console.log("Logging out...");
                                                alert("An error occured while logging in");

                                                // logging out...
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
                                            });

                                }, function (error) {
                                    console.log("An error occured while logging in: " + JSON.stringify(error));
                                    alert("An error occured while logging in");
                                });
                    };

                });

