
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");
});

// Parse.Cloud.afterSave("Alerts", function(request) {
//   // Our "Comment" class has a "text" key with the body of the comment itself
//   var alertTitle = request.object.get('title');
//   var description = request.object.get('description');

//   var pushQuery = new Parse.Query(Parse.Installation);
//   pushQuery.equalTo('deviceType', 'ios');

//   Parse.Push.send({
//     where: pushQuery, // Set our Installation query
//     data: {
//       alert: "New Alert in your area: " + alertTitle + "\nDescription: " + description
//     }
//   }, {
//     success: function() {
//       // Push was successful
//       console.log("Push was successful");
//     },
//     error: function(error) {
//       throw "Got an error " + error.code + " : " + error.message;
//     }
//   });
// });