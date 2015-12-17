angular.module('app.controllers', ['ngOpenFB'])
.controller('LoginCtrl', function ($scope, $state) {
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
          console.log("Success! You have now signed up.");
          $state.go('tab.map');
        },
        error: function(user, error) {
          alert("We were unable to create your account. Please try again");
        }
      });
     
    };
 
  $scope.loginEmail = function(){
      Parse.User.logIn($scope.data.username.toLowerCase(), $scope.data.password, {
        success: function(user) {
          console.log("Success! You have now logged in.");
          $state.go('tab.map'); // route to map view
        },
        error: function(user, error) {
          // The login failed. Check error to see why.
          alert("You've provided the wrong credentials! Please try again.");
        }
      });
    };
}).controller('ProfileCtrl', function ($scope, contactService) {
    $scope.data = {};
    data = contactService.getContacts();

    /* Pull existing settings for current User */
    var currentUser = Parse.User.current();
    var user = Parse.Object.extend("User");
    var query = new Parse.Query(user);
    query.get(currentUser.id, {
      success: function(curUser) {
        if(curUser.get("contactName") !== undefined){
            $scope.data.name = curUser.get("contactName");
            data.name = curUser.get("contactName");
        }
        if(curUser.get("contactPhone") !== undefined){
            $scope.data.phone = curUser.get("contactPhone");
            data.phone = curUser.get("contactPhone");
        }
        if(curUser.get("Address") !== undefined){
            $scope.data.address = curUser.get("Address");
            data.address = curUser.get("contactPhone");
        }
        $scope.data.username = curUser.get("username");
        contactService.addContact(data);
        curUser.save()
        .then(
          function() {
            console.log('object saved');
          }, 
          function(error) {
            console.log(error);
          });
      },
      error: function(error) {
        console.log("Error: " + error.code + " " + error.message);
      }
    });

    /* save new settings */
    $scope.saveSettings = function(){
        query.get(currentUser.id, {
          success: function(curUser) {
            curUser.set("contactName", $scope.data.name);
            curUser.set("contactPhone", $scope.data.phone);
            curUser.set("Address", $scope.data.address);
            // save settings to contact service
            data.name = curUser.get("contactName");
            data.phone = curUser.get("contactPhone");
            data.address = curUser.get("contactPhone");
            contactService.addContact(data);
            curUser.save()
            .then(
              function() {
                console.log('object saved');
              }, 
              function(error) {
                console.log(error);
              });
          },
          error: function(error) {
            console.log(error);
          }
        });    
    }
})
.controller('HelpCtrl', function ($scope, contactService) {
    // backend to display emergency contact name and phone
    $scope.data = {};
    data = contactService.getContacts();
    console.log(JSON.stringify(data));

    $scope.data.name = data.name;
    $scope.data.phone = data.phone;
})
.controller('MapCtrl', function($scope, $ionicModal, contactService, timeService) {

    $scope.$on( "$ionicView.enter", function( scopes, states ) {
           google.maps.event.trigger( map, 'resize' );
           init();
           loadUserData();
    });

    function loadUserData(){
        var currentUser = Parse.User.current();
        var user = Parse.Object.extend("User");
        var query = new Parse.Query(user);
        data = contactService.getContacts();
        query.get(currentUser.id, {
          success: function(curUser) {
            data.name = curUser.get("contactName");
            data.phone = curUser.get("contactPhone");
            data.address = curUser.get("contactPhone");
            contactService.addContact(data);
            curUser.save()
            .then(
              function() {
                console.log('object saved');
              }, 
              function(error) {
                console.log(error);
              });
          },
          error: function(error) {
            console.log("Error: " + error.code + " " + error.message);
          }
        });
    }

    function init(){
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
                        setMarker(map, alert.get("location")[0], alert.get("location")[1], alert.get("title"), alert.get("description"), alert.get("severity"),alert.get("endorseCount"), alert.get("fraudCount"), alert.get("createdAt")); 
                    }
                }, error: function(error){
                    console.log(error.message);
                }
            });
        });
    };

    function setMarker(map, lat, lon, title, content, severity, endorseCount, fraudCount, createdAt){
        var icon = "img/highAlert.png";
        if (severity=="Low"){
            var icon = "img/lowAlert.png";
        }else if (severity=="Medium"){
            var icon = "img/mediumAlert.png";
        };
        var time = timeService.getTimeElapsed(createdAt)
        var contentString = '<div id="alertTitle">'+ title+'</div><br/><div id="alertDescr">' 
            + content +'<br><div style="margin-top:7px; font-weight:500;">' 
            + time + ' ago</div><div style="margin-top:7px;"><i class="icons ion-thumbsup"> </i> ' 
            + endorseCount + '&nbsp;&nbsp;&nbsp;<i class="icons ion-thumbsdown"> </i> '
            + fraudCount + '</div></div>';
        var alertMarker = new google.maps.Marker({
            position: new google.maps.LatLng(lat, lon),
            map: map,
            title: title,
            icon: icon
        });
        var infowindow = new google.maps.InfoWindow();
            google.maps.event.addListener(alertMarker, 'click', function() {
            if(!alertMarker.open){
                infowindow.setContent(contentString);
                infowindow.open(map,alertMarker);
                alertMarker.open = true;
            }
            else{
                infowindow.close();
                alertMarker.open = false;
            }
            google.maps.event.addListener(map, 'click', function() {
                infowindow.close();
                alertMarker.open = false;
            });
        });
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
            parseAlert.set("severity", $scope.alert.sev);
            parseAlert.set("title", info.title);
            parseAlert.set("description", info.description);
            parseAlert.set("location", [map.latitude, map.longitude]);
            parseAlert.set("endorseCount", 0);
            parseAlert.set("fraudCount", 0);
            parseAlert.set("active", true);
            parseAlert.save(null, {
                success: function(parseAlert){
                    $scope.closeModal();
                    console.log('Alert has been created ' + parseAlert.id);
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
}).controller('ListCtrl', function($scope, $state, alertService, timeService) {
    Parse.initialize("nzQI7s3XvgjxJ1ZMBJZQWoiaj8UMliBtjTW3KyTA", "TXM8Ap4P6AA1zSVyk78NP3HBX8vs4vYG5edLLe8n"); //this needs to be moved later
    $scope.alerts = [];
    $scope.ParseAlert = Parse.Object.extend("Alerts");
    var query = new Parse.Query($scope.ParseAlert);
    $scope.parseQuery = query.descending("createdAt");
    var myPos = [40.4428285, -79.9561175];
    navigator.geolocation.getCurrentPosition(function(pos) {
        myPos[0] = pos.coords.latitude;
        myPos[1] = pos.coords.longitude;
    });

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

    $scope.parseQuery.find({
        success:function(results){
            // $scope.alerts = results;
            for (var i=0; i<results.length; i++){
                var alert = results[i];
                var alertLatLng = new google.maps.LatLng(alert.get("location")[0], alert.get("location")[1]);
                var distance = precise_round(getDistance(myPos[0], myPos[1], alert.get("location")[0], alert.get("location")[1]), 2);  
                var now = new Date();
                var created_at = new Date(alert.get("createdAt"));
                var timeDiff = (now-created_at);
                $scope.timeDifference = timeDiff;
                var timeElapsed = timeService.getTimeElapsed(alert.get("createdAt"));
                $scope.alerts.push({title:alert.get("title"), description:alert.get("description"), severity:alert.get("severity"), created: timeElapsed, distance: distance, timeDiff: $scope.timeDifference});
            }
        }, error: function(error){
            console.log(error);
        }
    });

    /* save current alert to alertService */
    $scope.saveAlert = function(index){
        $scope.parseQuery.find({
            success:function(results){
                console.log(results);
                var alert = results[index];
                var alertLatLng = new google.maps.LatLng(alert.get("location")[0], alert.get("location")[1]);
                var distance = precise_round(getDistance(myPos[0], myPos[1], alert.get("location")[0], alert.get("location")[1]), 2);  
                $scope.timeDifference;
                var timeElapsed = timeService.getTimeElapsed(alert.get("createdAt"));

                alertService.addAlert({id: alert.id, title:alert.get("title"), description:alert.get("description"), severity:alert.get("severity"), created: timeElapsed, distance: distance, timeDiff: $scope.timeDifference});
                $state.go('tab.details');
            }, error: function(error){
                console.log(error);
            }
        });

    }

}).controller('DetailCtrl', function ($scope, alertService) {
    var alerts = Parse.Object.extend("Alerts");
    var query = new Parse.Query(alerts);

    $scope.endorseDisabled = false;
    $scope.fraudDisabled = false;

    // get current alert
    alert = alertService.getAlert();
    $scope.alert = alert;
    $scope.endorse = function(){
        query.get(alert.id, {
          success: function(curAlert) {
            curAlert.set("endorseCount", curAlert.get("endorseCount") + 1);
            alertService.addAlert(curAlert);
            $scope.endorseDisabled = true;
            $scope.$apply();
            curAlert.save()
            .then(
              function() {
                console.log('alert endorsed');
                // disable button on front end
                // document.getElementsByClassName('button button-balanced')[0].className += ' disabled';
              }, 
              function(error) {
                console.log(error);
              });
          },
          error: function(error) {
            console.log(error);
          }
        });    
    }

    $scope.report = function(){
        query.get(alert.id, {
          success: function(curAlert) {
            curAlert.set("fraudCount", curAlert.get("fraudCount") + 1);
            alertService.addAlert(curAlert);
            $scope.fraudDisabled = true;
            curAlert.save()
            .then(
              function() {
                console.log('alert reported');
                // disable button on front end
                document.getElementsByClassName('button button-assertive fraud')[0].className += ' disabled';
              }, 
              function(error) {
                console.log(error);
              });
          },
          error: function(error) {
            console.log(error);
          }
        });  
    }
})
.controller('AlertCtrl', function($scope, $state) {
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
        sev: "low",
        alertType: "Suspicious"
    };
    $scope.changeSeverity = function(sev){
        $scope.alert.sev = sev;
    }
    $scope.severityList = [
        {text: "Low", value: "low"},
        {text: "Medium", value: "med"},
        {text: "High", value: "high"}
    ];

    $scope.changeType = function(alertType){
        $scope.alert.alertType = alertType;
    }
    $scope.typeList = [
        {text: "Suspicious Person/Activity", value: "Suspicious"},
        {text: "Vandalism", value: "Vandalism"},
        {text: "Theft", value: "Theft"},
        {text: "Assault", value: "Assault"}
    ];
    $scope.createAlert = function(info){
        console.log('calling create alert' + info);
        if(info !== undefined){
            if(info.description !== undefined && info.title !== undefined ){
                console.log(info);
                parseAlert.set("severity", $scope.alert.sev);
                parseAlert.set("title", info.title);
                parseAlert.set("description", info.description);
                parseAlert.set("location", [map.latitude, map.longitude]);
                parseAlert.set("endorseCount", 0);
                parseAlert.set("fraudCount", 0);
                parseAlert.set("active", true);
                parseAlert.set("alertType", $scope.alert.alertType);
                parseAlert.save(null, {
                    success: function(parseAlert){
                        console.log('Alert has been created ' + parseAlert.id);
                        $state.go('tab.map');
                    },
                    error: function(parseAlert, error){
                        console.log('Failed to create alert ' + error.message);
                    }
                });
            }
            else{
                alert('Please fill in the entire form');
            }
        }
        else{
            alert('Please fill in the entire form');
        }
        info = {};
    };
});


