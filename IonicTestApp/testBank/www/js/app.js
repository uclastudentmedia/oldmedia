// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ngCordova', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
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
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tab.html"
  })

  // Each tab has its own nav history stack:

  .state('tab.tests', {
    url: '/tests',
    views: {
      'tab-tests': {
        templateUrl: 'templates/tab.tests.html',
        controller: 'TestCtrl'
      }
    }
  })

  .state('tab.tests-detail', {
    url: '/tests/:entity',
    views: {
      'tab-tests': {
        templateUrl: 'templates/tab.tests.entities.html',
        controller: 'TestDetailCtrl'
      }
    }
  })

  .state('tab.tests-images', {
    url: '/tests/:entity/:slug',
    views: {
      'tab-tests': {
        templateUrl: 'templates/tab.tests.entity-detail.html',
        controller: 'TestImageDetailCtrl'
      }
    }
  })

  .state('tab.tutors', {
    url: '/tutors',
    views: {
      'tab-tutors': {
        templateUrl: 'templates/tab.tutors.html',
        controller: 'TutorCtrl'
      }
    }
  })

  .state('tab.tutors-detail', {
    url: '/tutors/:post',
    views: {
      'tab-tutors': {
        templateUrl: 'templates/tab.tutors.post-detail.html',
        controller: 'TutorDetailCtrl'
      }
    }
  })

  .state('tab.requests', {
    url: '/requests',
    views: {
      'tab-requests': {
        templateUrl: 'templates/tab.requests.html'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/tests');

});
