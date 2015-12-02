// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'app' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'app.services' is found in services.js
// 'app.controllers' is found in controllers.js
angular.module('app', ['ionic', 'app.controllers','ngOpenFB'])

.run(function($ionicPlatform, ngFB) {
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
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

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
        templateUrl: 'templates/tab-report.html',
        controller: 'AlertCtrl'
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
          templateUrl: 'templates/tab-alertList.html',
          controller: 'ListCtrl'
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
  .state('signup', {
    url: '/signup',
    templateUrl: 'templates/signup.html',
    controller: 'LoginCtrl'
  })
  .state('signin', {
    url: '/signin',
    templateUrl: 'templates/signin.html',
    controller: 'LoginCtrl'
  })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});
