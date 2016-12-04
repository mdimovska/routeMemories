angular.module('starter')
    .controller('MenuCtrl',
    function ($scope,
              $rootScope,
              $state,
              $ionicModal,
              $timeout,
              authenticationFactory) {
        // Form data for the login modal
        $scope.loginData = {};

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
                authenticationFactory.logoutUser().then(
                    function (success) {
                        console.log('Successfully logged out');
                        $rootScope.stopWatchingPositionChanges();
                        $state.go('login');
                    }, function (error) {
                        console.log('Problem with logging out: ' + JSON.stringify(error));
                        alert('An error occurred during logout, please try again later');
                    }
                );
            }
        };
    });

