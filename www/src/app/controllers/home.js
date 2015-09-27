angular.module('starter')
        .controller('HomeCtrl',
                function (
                        $scope,
                        $rootScope,
                        $state,
                        $ionicSideMenuDelegate,
                        $ionicModal,
                        $timeout
                        ) {
                    if ($rootScope.started === undefined) {
                        $rootScope.started = false;
                    }
                    $scope.startOrStop = function () {
                        if (!$rootScope.started) {
                            $rootScope.started = true;
                        } else {
                            $rootScope.started = false;
                        }

                    }
                });

