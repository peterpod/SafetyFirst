// add controllers here
angular.module('app.controllers', ['ngOpenFB'])
.controller('LoginCtrl', function ($scope, $state, ngFB) {
  // Form data for the login modal
  $scope.data = {};
    
  $scope.signup = function(){
    $state.go('signup');
  }
  $scope.login = function(){
    $state.go('signin');
  }

  $scope.signupEmail = function(){
      //Create a new user on Parse
      var user = new Parse.User();
      user.set("username", $scope.data.username);
      user.set("password", $scope.data.password);
      user.set("email", $scope.data.email);
     
     
      user.signUp(null, {
        success: function(user) {
          // Hooray! Let them use the app now.
          alert("Success! You have now signed up.");
          $state.go('tab.map');
        },
        error: function(user, error) {
          // Show the error message somewhere and let the user try again.
          alert("Error: " + error.code + " " + error.message);
        }
      });
     
    };
 
  $scope.loginEmail = function(){
      Parse.User.logIn($scope.data.username, $scope.data.password, {
        success: function(user) {
          // Do stuff after successful login.
          console.log(user);
          alert("Success! You have now logged in.");
          $state.go('tab.map');
        },
        error: function(user, error) {
          // The login failed. Check error to see why.
          alert("You've provided the wrong credentials! Please try again.");
        }
      });
    };


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
.controller('MapCtrl', function($scope, $ionicModal) {
    console.log("here is our map");
    $scope.ParseAlert = Parse.Object.extend("Alerts");
    $scope.parseQuery = new Parse.Query($scope.ParseAlert);
 
    var myLatlng = new google.maps.LatLng(40.4428285, -79.9561175);

    var mapOptions = {
        center: myLatlng,
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var map = new google.maps.Map(document.getElementById("map"), mapOptions);
    var alertDiv = document.createElement('div');
    var myAlert = new alertControl(alertDiv, map);
    map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(alertDiv);

    navigator.geolocation.getCurrentPosition(function(pos) {
        map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
        map.latitude = pos.coords.latitude;
        map.longitude = pos.coords.longitude;
        var myLocation = new google.maps.Marker({
            position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
            map: map,
            title: "My Location"
        });
        Parse.initialize("nzQI7s3XvgjxJ1ZMBJZQWoiaj8UMliBtjTW3KyTA", "TXM8Ap4P6AA1zSVyk78NP3HBX8vs4vYG5edLLe8n"); //this needs to be moved later
        $scope.parseQuery.find({
            success:function(results){
                console.log(results);
                for (var i=0; i<results.length; i++){
                    var alert = results[i];
                    var alertMarker = new google.maps.Marker({
                        position: new google.maps.LatLng(alert.get("location")[0], alert.get("location")[1]),
                        map: map,
                        title: alert.get("title")
                    });
                }
            }, error: function(error){
                console.log(error.message);
            }
        });
    });

    function alertControl(alertDiv, map){
        parseAlert = new $scope.ParseAlert();
        $ionicModal.fromTemplateUrl('my-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });
        $scope.openModal = function() {
            $scope.modal.show();
        };
        $scope.closeModal = function() {
            $scope.modal.hide();
        };
        $scope.alert = {
            sev: "high"
        };
        $scope.changeSeverity = function(sev){
            $scope.alert.sev = sev;
        }
        $scope.severityList = [
            {text: "Low", value: "low"},
            {text: "Medium", value: "med"},
            {text: "High", value: "high"}
        ];
        $scope.createAlert = function(info){
            console.log(info);
            parseAlert.set("severity", $scope.alert.sev);
            parseAlert.set("title", info.title);
            parseAlert.set("description", info.description);
            parseAlert.set("location", [map.latitude, map.longitude])
            parseAlert.set("active", true);
            parseAlert.save(null, {
                success: function(parseAlert){
                    $scope.closeModal();
                    alert('Alert has been created ' + parseAlert.id);
                },
                error: function(parseAlert, error){
                    $scope.closeModal();
                    alert('Failed to create alert ' + error.message);
                }
            });
            info = {};
            
        };
          //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {
            $scope.modal.remove();
        });
          // Execute action on hide modal
        $scope.$on('modal.hidden', function() {
            // Execute action
        });
          // Execute action on remove modal
        $scope.$on('modal.removed', function() {
            // Execute action
          });

        //Set CSS for control div
        var alertUI = document.createElement('div');
        alertUI.id = "alertUI";
        alertUI.title = "Click to create alert"
        alertDiv.appendChild(alertUI);
        //set CSS for control interior
        var alertText = document.createElement('div');
        alertText.id = 'alertText';
        alertText.innerHTML = 'Create Alert';
        alertUI.appendChild(alertText);

        //click event listener
        alertUI.addEventListener('click', function(){
            $scope.openModal()
        });
    }
    $scope.map = map;
});
