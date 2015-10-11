angular.module('starter')
        .controller('LoadingCtrl',
                function (
                        $scope,
                        $rootScope,
                        $state,
                        $ionicSideMenuDelegate,
                        $ionicModal,
                        $timeout,
                        $cordovaFacebook
                        ) {

                    if ($rootScope.isLoggedIn === undefined) {
                        $rootScope.isLoggedIn = false;
                    }

                    // Perform the login action when the user submits the login form
                    if (!$rootScope.isLoggedIn) {
                        console.log("User not logged in. Redirecting to login page.");
                        $state.go('login');
                    } else {
                        console.log("User logged in. Redirecting to home page.");
                        $state.go('app.home');
                    }

                });

