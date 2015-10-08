angular.module('starter')
        .controller('MenuCtrl',
                function (
                        $scope,
                        $rootScope,
                        $state,
                        $ionicModal,
                        $timeout,
                        $cordovaFacebook
                        ) {
                    // Form data for the login modal
                    $scope.loginData = {};
                    if ($rootScope.isLoggedIn === undefined) {
                        $rootScope.isLoggedIn = false;
                    }
                    if (!$rootScope.isLoggedIn) {
                        $state.go('login');
                    }

                    // Create the login modal that we will use later
                    $ionicModal.fromTemplateUrl('src/app/views/loginDialog.html', {
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
                        console.log('Logging out');

                        if ($rootScope.isLoggedIn) {
                            // logout
                            $cordovaFacebook.logout()
                                    .then(function (success) {
                                        // success
                                        console.log("Successfully logged out");
                                        $rootScope.userName = "";
                                        $rootScope.userId = "";
                                        $rootScope.isLoggedIn = false;
                                        $state.go('login');
                                    }, function (error) {
                                        console.log("An error occured while logging out: " + JSON.stringify(error));
                                    });
                        }
                    };
                });

