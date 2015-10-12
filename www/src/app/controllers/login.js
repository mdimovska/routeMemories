angular.module('starter')
        .controller('LoginCtrl',
                function ($scope,
                        $rootScope,
                        $state,
                        apiFactory,
                        authenticationFactory,
                        $ionicPlatform
                        ) {

                    $ionicPlatform.registerBackButtonAction(function (event) {
//                        event.preventDefault();
                        navigator.app.exitApp();
                    }, 100);

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
                                    $scope.register($rootScope.userId, $rootScope.userName, "https://graph.facebook.com/" + $rootScope.userId + "/picture?width=80&height=80");
                                }, function (error) {
                            alert('There was problem with logging in, please try again later: ' + JSON.stringify(error));
                        }
                        );
                    };


                    //function checkIfLoggedIn(){
                    //    authenticationFactory.isUserLoggedIn().then(
                    //        function (success) {
                    //            if (success.status === 'connected') {
                    //                $rootScope.isLoggedIn = true;
                    //                $cordovaFacebook.api("me", ["public_profile"])
                    //                    .then(function (success) {
                    //                        console.log("Successfully retrieved user info: " + JSON.stringify(success));
                    //                        $rootScope.userName = success.name;
                    //                        $rootScope.userId = success.id;
                    //                        localStorage.setItem('userId',$rootScope.userId);
                    //                        localStorage.setItem('username',$rootScope.userName);
                    //                        $state.go('app.home');
                    //                    }, function (error) {
                    //                        console.log("An error occured while getting user info: " + JSON.stringify(error));
                    //                        console.log("Logging out...");
                    //                        alert("An error occured while logging in");
                    //                    });
                    //            }else{
                    //                setTimeout(function(){
                    //                    checkIfLoggedIn();
                    //                },3000);
                    //            }
                    //        }, function (error) {
                    //            console.log('Error with authentication ' + JSON.stringify(error));
                    //        }
                    //    );
                    //}
                    //
                    //if(ionic.Platform.isIOS()) {
                    //    checkIfLoggedIn();
                    //}
                });

