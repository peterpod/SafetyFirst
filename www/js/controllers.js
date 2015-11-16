// add controllers here
angular.module('app.controllers', ['ngOpenFB'])
.controller('LoginCtrl', function ($scope, $rootScope, $ionicModal, $state, $ionicSideMenuDelegate, $timeout, ngFB) {
  // Form data for the login modal
  $scope.loginData = {};

  $scope.fbLogin = function () {
    ngFB.login({scope: 'email'}).then(
        function (response) {
            if (response.status === 'connected') {
                console.log('Facebook login succeeded');
            } else {
                alert('Facebook login failed');
            }
        });
  };

  $scope.fbLogout = function () {
    openFB.logout().then(function(){
            $rootScope.$broadcast('logged-out');
        });
  };


}).controller('ProfileCtrl', function ($scope, ngFB) {
    ngFB.api({
        path: '/me',
        params: {fields: 'id,name'}
    }).then(
        function (user) {
            $scope.user = user;
        },
        function (error) {
            alert('Facebook error: ' + error.error_description);
        });
})
.controller('MapCtrl', function($scope, $ionicLoading, $ionicSideMenuDelegate) {
    console.log("here is our map");
  
    $scope.toggleLeftSideMenu = function() {
        console.log("calling toggle");
        setTimeout(function(){
            $ionicSideMenuDelegate.toggleLeft(true);
        }, 1000);
    };
 
    var myLatlng = new google.maps.LatLng(40.4428285, -79.9561175);

    var mapOptions = {
        center: myLatlng,
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var map = new google.maps.Map(document.getElementById("map"), mapOptions);

    navigator.geolocation.getCurrentPosition(function(pos) {
        map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
        var myLocation = new google.maps.Marker({
            position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
            map: map,
            title: "My Location"
        });
    });

    $scope.map = map;

});
