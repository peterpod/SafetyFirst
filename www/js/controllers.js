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

    $scope.$on( "$ionicView.enter", function( scopes, states ) {
           google.maps.event.trigger( map, 'resize' );
           init();
    });

    function init(){
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
                    for (var i=0; i<results.length; i++){
                        var alert = results[i];
                        setMarker(map, alert.get("location")[0], alert.get("location")[1], alert.get("title"), alert.get("description"), alert.get("severity")); 
                    }
                }, error: function(error){
                    console.log(error.message);
                }
            });
        });
    };

    function setMarker(map, lat, lon, title, content, severity){
        var icon = "../img/highAlert.png";
        if (severity=="Low"){
            var icon = "../img/lowAlert.png";
        }else if (severity=="Medium"){
            var icon = "../img/mediumAlert.png";
        };
        var contentString = '<div id="alertTitle">'+ title+'</div>'+'<br/>'+'<div id="alertDescr">' 
            + content + '</div>';
        var alertMarker = new google.maps.Marker({
            position: new google.maps.LatLng(lat, lon),
            map: map,
            title: title,
            icon: icon
        });
        var infowindow = new google.maps.InfoWindow();
            google.maps.event.addListener(alertMarker, 'click', (function(alertMarker) {
                return function() {
                    infowindow.setContent(contentString);
                    infowindow.open(map, alertMarker);
                }
            })(alertMarker));
        console.log(alertMarker);
        console.log(title);
        console.log(lat, lon);
    }

    function alertControl(alertDiv, map){
        var ParseAlert = Parse.Object.extend("Alerts");
        var parseAlert = new ParseAlert();
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
}).controller('ListCtrl', function($scope) {
    Parse.initialize("nzQI7s3XvgjxJ1ZMBJZQWoiaj8UMliBtjTW3KyTA", "TXM8Ap4P6AA1zSVyk78NP3HBX8vs4vYG5edLLe8n"); //this needs to be moved later
    $scope.alerts = [];
    $scope.ParseAlert = Parse.Object.extend("Alerts");
    $scope.parseQuery = new Parse.Query($scope.ParseAlert);
    var myPos = [40.4428285, -79.9561175];
    navigator.geolocation.getCurrentPosition(function(pos) {
        myPos[0] = pos.coords.latitude;
        myPos[1] = pos.coords.longitude;
    });
    console.log(myPos);

    function getDistance(lat1, lon1, lat2, lon2) {
        var radlat1 = Math.PI * lat1/180
        var radlat2 = Math.PI * lat2/180
        var radlon1 = Math.PI * lon1/180
        var radlon2 = Math.PI * lon2/180
        var theta = lon1-lon2
        var radtheta = Math.PI * theta/180
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        dist = Math.acos(dist)
        dist = dist * 180/Math.PI
        dist = dist * 60 * 1.1515
        return dist* 0.8684
    }

        function sign(num) {
        // IE does not support method sign here
        if (typeof Math.sign === 'undefined') {
            if (num > 0) {
                return 1;
            }
            if (num < 0) {
                return -1;
            }
            return 0;
        }
        return Math.sign(num);
    }

    function precise_round(num, decimals) {
        var t=Math.pow(10, decimals);
        return (Math.round((num * t) + (decimals>0?1:0)*(sign(num) * (10 / Math.pow(100, decimals)))) / t).toFixed(decimals);
    }

    function getTimeElapsed(createdAt){
        var now = new Date();
        var created_at = new Date(createdAt);
        var timeDiff = (now-created_at)
        $scope.timeDifference = timeDiff;
        // strip the ms
        timeDiff /= 1000;

        // get seconds (Original had 'round' which incorrectly counts 0:28, 0:29, 1:30 ... 1:59, 1:0)
        var seconds = Math.round(timeDiff % 60);
        var timeElapsed = seconds + " Seconds";
        // remove seconds from the date
        timeDiff = Math.floor(timeDiff / 60);

        // get minutes
        var minutes = Math.round(timeDiff % 60);

        // remove minutes from the date
        timeDiff = Math.floor(timeDiff / 60);

        // get hours
        var hours = Math.round(timeDiff % 24);

        // remove hours from the date
        timeDiff = Math.floor(timeDiff / 24);

        // the rest of timeDiff is number of days
        var days = timeDiff ;

        if (minutes!=0){
            if (minutes ==1){
                timeElapsed = minutes + "Minute";
            }
            timeElapsed = minutes + " Minutes";
        }if(hours!=0){
            if (hours ==1){
                if (minutes ==1){
                    timeElapsed = hours + "Hour" + minutes + " Minute";
                }
                timeElapsed = hours + "Hour" + minutes + " Minutes";
            }
            timeElapsed = hours + " Hours " + minutes + " Minutes";
        }if(days!=0){
            if (days==1){
                timeElapsed = days + " Day";
            }
            timeElapsed = days + " Days";
        }
        return timeElapsed;
    }
    $scope.parseQuery.find({
        success:function(results){
            // $scope.alerts = results;
            for (var i=0; i<results.length; i++){
                var alert = results[i];
                var alertLatLng = new google.maps.LatLng(alert.get("location")[0], alert.get("location")[1]);
                console.log("alert loc" + [alert.get("location")[0], alert.get("location")[1]]);
                var distance = precise_round(getDistance(myPos[0], myPos[1], alert.get("location")[0], alert.get("location")[1]), 2);  
                $scope.timeDifference;
                var timeElapsed = getTimeElapsed(alert.get("createdAt"));
                // var distance = google.maps.geometry.spherical.computeDistanceBetween(myLatLng, alertLatLng)
                $scope.alerts.push({title:alert.get("title"), description:alert.get("description"), severity:alert.get("severity"), created: timeElapsed, distance: distance, timeDiff: $scope.timeDifference});
                console.log($scope.alerts);
            }
        }, error: function(error){
            console.log(error.message);
        }
    });
}).controller('AlertCtrl', function($scope) {
    var ParseAlert = Parse.Object.extend("Alerts");
    var parseAlert = new ParseAlert();
    var myLatlng = new google.maps.LatLng(40.4428285, -79.9561175);

    var mapOptions = {
        center: myLatlng,
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var map = new google.maps.Map(document.getElementById("map"), mapOptions);
    navigator.geolocation.getCurrentPosition(function(pos) {
            map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
            map.latitude = pos.coords.latitude;
            map.longitude = pos.coords.longitude;
    });

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
                alert('Alert has been created ' + parseAlert.id);
            },
            error: function(parseAlert, error){
                alert('Failed to create alert ' + error.message);
            }
        });
        info = {};
    };
});


