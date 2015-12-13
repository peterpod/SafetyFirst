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

});