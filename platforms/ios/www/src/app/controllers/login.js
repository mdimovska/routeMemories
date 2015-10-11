angular.module('starter')
    .controller('LoginCtrl',
    function ($scope,
              $rootScope,
              $state,
              $ionicSideMenuDelegate,
              $ionicModal,
              $timeout,
              $cordovaFacebook,
              apiFactory,
              authenticationFactory) {

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
            authenticationFactory.logoutUser().then(
                function (success) {
                    console.log('Successfully logged out');
                }, function (error) {
                    console.log('Problem with logging out: ' + JSON.stringify(error));
                    alert('An error occurred during logout, please try again later');
                }
            );
        };
        // Perform the login action when the user clicks the login button
        $scope.loginOrLogout = function () {
            authenticationFactory.loginUser().then(
                function (success) {
                    $scope.register($rootScope.userId, $rootScope.userName, "//graph.facebook.com/" + $rootScope.userId + "/picture?width=80&height=80");
                }, function (error) {

                }
            );
        };
    });

