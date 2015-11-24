
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:

// Parse.Cloud.define("hello", function(request, response) {
//   response.success("Hello world!");
// });

/* Send a push notification to all users when an alert is added to the database */
Parse.Cloud.afterSave("Alerts", function(request) {
  // Our "Alerts" class has a "title" key and description
  var alertTitle = request.object.get('title');
  var description = request.object.get('description');

  var pushQuery = new Parse.Query(Parse.Installation);

  Parse.Push.send({
    where: pushQuery, // Set our Installation query
    data: {
      alert: "New Alert in your area: " + alertTitle,
      Description: "Description: " + description
    }
  	}, {
    success: function() {
      // Push was successful
      console.log("Push was successful");
    },
    error: function(error) {
      throw "Got an error " + error.code + " : " + error.message;
    }
  });
});