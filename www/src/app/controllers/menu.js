angular.module('starter')
        .controller('MenuCtrl',
                function (
                        $scope,
                        $rootScope,
                        $state,
                        $ionicSideMenuDelegate,
                        $ionicModal,
                        $timeout,
                        $cordovaFacebook
                        ) {
                    // Form data for the login modal
                    $scope.loginData = {};
                    if ($rootScope.isLoggedIn === undefined) {
                        $rootScope.isLoggedIn = false;
                    }

                    // Create the login modal that we will use later
                    $ionicModal.fromTemplateUrl('src/app/views/login.html', {
                        scope: $scope
                    }).then(function (modal) {
                        $scope.modal = modal;
                    });

                    // Triggered in the login modal to close it
                    $scope.closeLogin = function () {
                        $scope.modal.hide();
                    };

                    // Open the login modal
                    $scope.login = function () {
                        $scope.modal.show();
                    };

                    // Perform the login action when the user submits the login form
                    $scope.loginOrLogout = function () {
                        console.log('Doing login', $scope.loginData);

                        if (!$rootScope.isLoggedIn) {
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

                                                }, function (error) {
                                                    console.log("An error occured while getting user info: " + JSON.stringify(error));
                                                });

                                        $scope.closeLogin();
                                    }, function (error) {
                                        console.log("An error occured while logging in: " + JSON.stringify(error));
                                    });
                        } else {
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
                    };

                    $scope.doLogin = function () {
                        // Simulate a login delay. Remove this and replace with your login
                        // code if using a login system
//                        $timeout(function () {
//                            $scope.closeLogin();
//                        }, 1000);
                    }
                });

