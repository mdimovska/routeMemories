angular.module('starter')
    .controller('LoadingCtrl',
    function ($scope,
              $rootScope,
              $state,
              authenticationFactory) {


        var initialTiming = 0;
        //if(!window.cordova){
            initialTiming = 3000;
        //}

        setTimeout(function(){
            authenticationFactory.isUserLoggedIn().then(
                function (success) {
                    if (success.status === 'connected') {
                        $rootScope.isLoggedIn = true;
                        $rootScope.userId = localStorage.getItem('userId');
                        $rootScope.userName = localStorage.getItem('username');
                        console.log("User logged in. Redirecting to home page.");
                        $state.go('app.home');
                    } else {
                        $state.go('login');
                    }

                }, function (error) {
                    console.log('Error with authentication ' + JSON.stringify(error));
                }
            );
        },initialTiming);


    });

