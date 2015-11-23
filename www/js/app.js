// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'app' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'app.services' is found in services.js
// 'app.controllers' is found in controllers.js
angular.module('app', ['ionic','ionic.service.core', 'app.controllers','ngOpenFB'])

.run(function($ionicPlatform, $http, ngFB) {
  ngFB.init({appId: '841208139331064'});
  $ionicPlatform.ready(function() {
     Parse.initialize("nzQI7s3XvgjxJ1ZMBJZQWoiaj8UMliBtjTW3KyTA", "TXM8Ap4P6AA1zSVyk78NP3HBX8vs4vYG5edLLe8n");
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }

    var push = new Ionic.Push({
      "debug": true,
      "onNotification": function(notification) {
        var payload = notification.payload;
        console.log(notification, payload);
      },
      "onRegister": function(data) {
        console.log(data.token);
      }
    });


    push.register(function(token) {
      window.token = token;
      console.log("Device token:",token.token);
      pushCallback();
    });

    function pushCallback(){
      // var privateKey = '4933d7aa4587868fe4be8b53341eb1a42e75d60adcdd7fd8';
      // var tokens = [window.token];
      // console.log(tokens);
      // var appId = 'a4067d1c';

      // // Encode your key
      // var auth = btoa(privateKey + ':');

      // // Build the request object
      // var req = {
      //   method: 'POST',
      //   url: 'https://push.ionic.io/api/v1/push',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'X-Ionic-Application-Id': appId,
      //     'Authorization': 'basic ' + auth
      //   },
      //   data: {
      //     "tokens": tokens,
      //     "notification": {
      //       "alert":"Hello World!"
      //     }
      //   }
      // };

      // // Make the API call
      // $http(req).success(function(resp){
      //   // Handle success
      //   console.log("Ionic Push: Push success!");
      // }).error(function(error){
      //   // Handle error 
      //   console.log(error);
      // });
    }

  });
})
.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  .state('menu', {
      url: "/menu",
      abstract: true,
      templateUrl: "templates/menu.html",
      controller: 'LoginCtrl'
    })

  .state('menu.profile', {
    url: "/profile",
    views: {
        'menuContent': {
            templateUrl: "templates/profile.html",
            controller: "ProfileCtrl"
        }
      }
  })    

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })
  .state('tab.map', {
    url: '/map',
    views: {
      'tab-map': {
        templateUrl: 'templates/tab-map.html',
        controller: 'MapCtrl'
      }
    }
  })
  .state('tab.report', {
    url: '/report',
    views: {
      'tab-report': {
        templateUrl: 'templates/tab-report.html'
      }
    }
  })
  .state('tab.help', {
      url: '/help',
      views: {
        'tab-help': {
          templateUrl: 'templates/tab-help.html'
        }
      }
  })
  .state('tab.alertList', {
      url: '/list',
      views: {
        'tab-list': {
          templateUrl: 'templates/tab-alertList.html'
        }
      }
    })
    .state('tab.settings', {
      url: '/settings',
      views: {
        'tab-settings': {
          templateUrl: 'templates/tab-settings.html',
          controller: 'ProfileCtrl'
        }
      }
    })
  .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl'
  })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});
