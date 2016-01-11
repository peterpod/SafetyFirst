/* Send a push notification to all users when an alert is added to the database */
Parse.Cloud.afterSave("Alerts", function(request) {
  // only send push on create not update
  var createdAt = request.object.get("createdAt");
  var updatedAt = request.object.get("updatedAt");
  var objectExisted = (createdAt.getTime() != updatedAt.getTime());

  if(!objectExisted){
    // Our "Alerts" class has a "title" key and description
    var alertTitle = request.object.get('type');
    var description = request.object.get('description');

    var pushQuery = new Parse.Query(Parse.Installation);

    Parse.Push.send({
      where: pushQuery, // Set our Installation query
      data: {
        alert: "New Alert in your area: " + description
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
  }
});