// add services here
angular.module('app.services', [])
.service('contactService', function() {
  var contacts = {};

  var addContact = function(newObj) {
      contacts = newObj;
  };

  var getContacts = function(){
      return contacts;
  };

  return {
    addContact: addContact,
    getContacts: getContacts
  };

})
.service('loginService', function() {
  var loggedIn = false;

  var login = function() {
      loggedIn = true;
  };

  var getLoginStats = function(){
      return loggedIn;
  };

  return {
    login: login,
    getLoginStats: getLoginStats
  };

})
.service('alertService', function() {
  // service used to store the current alert being viewed
  // in the alert detail page
  var curAlert = {};

  var addAlert= function(newObj) {
      curAlert = newObj;
  };

  var getAlert = function(){
      return curAlert;
  };

  return {
    addAlert: addAlert,
    getAlert: getAlert
  };

})
.service('timeService', function(){

  var getTimeElapsed = function(createdAt){
        var now = new Date();
        var created_at = new Date(createdAt);
        var timeDiff = (now-created_at);
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
            else{
              timeElapsed = minutes + " Minutes";
            }
        }if(hours!=0){
            if (hours ==1){
                if (minutes ==1){
                    timeElapsed = hours + " Hour " + minutes + " Minute";
                }
                else{
                    timeElapsed = hours + " Hour " + minutes + " Minutes";
                }
            }
            else{
              if (minutes ==1){
                    timeElapsed = hours + " Hours " + minutes + " Minute";
                }
                else{
                    timeElapsed = hours + " Hours " + minutes + " Minutes";
                }              
            }
        }if(days!=0){
            if (days==1){
                timeElapsed = days + " Day";
            }
            else{
            timeElapsed = days + " Days";
          }
        }
        return timeElapsed;
    }

  return {
    getTimeElapsed: getTimeElapsed
  };

});