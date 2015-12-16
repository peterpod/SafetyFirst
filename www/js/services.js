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

});