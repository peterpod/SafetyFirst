// add controllers here
angular.module('app.controllers', [])
.controller('MapCtrl', function($scope, $ionicLoading, $ionicModal) {
 
    google.maps.event.addDomListener(window, 'load', function() {
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
            var myLocation = new google.maps.Marker({
                position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
                map: map,
                title: "My Location"
            });
        });
 
        $scope.map = map;
    });

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
        $scope.createAlert = function(info){
            parseAlert.set("severity", info.sev);
            parseAlert.set("title", info.title);
            parseAlert.set("description", info.description);
            parseAlert.set("Location", [40.4428285, -79.9561175])
            parseAlert.set("active", true);
            parseAlert.save(null, {
                success: function(parseAlert){
                    alert('Alert has been created ' + parseAlert.id);
                },
                error: function(parseAlert, error){
                    alert('Failed to create alert ' + error.message);
                }
            });
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

 
});
