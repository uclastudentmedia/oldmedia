// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'firebase', 'ngCordova', 'ngSanitize', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform, $rootScope) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
    if(typeof analytics !== "undefined") {
      // GET TRACKING ID
      analytics.startTrackerWithId("UA-39834942-7");
    } else {
      console.log("Google Analytics Unavailable");
    }
    //$rootScope.authData = JSON.parse(window.localStorage['authData'] || '{}');
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the nav directive
  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/tab.html",
    data: {
      profile: "powersave-campus-ucla",
      adTag: "REC"
    }
  })

  // Each app has its own nav history stack:

  .state('app.home', {
    url: '/home',
    views: {
      'app-home': {
        templateUrl: 'templates/home.html',
        controller: 'HomeCtrl'
      }
    }
  })

  // Entities List State Series Begin

  .state('app.board', {
    url: '/board',
    views: {
      'app-board': {
        templateUrl: 'templates/entities.html',
        controller: 'EntitiesCtrl'
      }
    },
    data: {
      tabID: 0,
      channel: "board",
      title: "Meet the Board"
    }
  })

  .state('app.board-profile', {
    url: '/board/:entity/:slug',
    views: {
      'app-board': {
        templateUrl: 'templates/business-detail.html',
        controller: 'BusinessDetailCtrl'
      }
    },
    data: {
      tabID: 0,
      channel: "board"
    }
  })

  .state('app.board-images', {
    url: '/board/:entity/:slug/images',
    views: {
      'app-board': {
        templateUrl: 'templates/image-gallery.html',
        controller: 'ImageGalleryCtrl'
      }
    }
  })

// End

  // Event States Begin

  .state('app.cal', {
    url: '/cal',
    views: {
      'app-events': {
        templateUrl: 'templates/events.html',
        controller: 'EventsCtrl'
      }
    },
    data: {
      channel: "cal", // This should share the same url from the state
      title: "Calendar",
      tag: "REC"
    }
  })

  .state('app.cal-detail', {
    url: '/cal/:id',
    views: {
      'app-events': {
        templateUrl: 'templates/event-detail.html',
        controller: 'EventDetailCtrl'
      }
    }
  })

// Entities List State Series Begin

  .state('app.events', {
    url: '/events',
    views: {
      'app-more': {
        templateUrl: 'templates/entities.html',
        controller: 'EntitiesCtrl'
      }
    },
    data: {
      tabID: 1,
      channel: "events",
      title: "Major Events"
    }
  })

  .state('app.events-profile', {
    url: '/events/:entity/:slug',
    views: {
      'app-more': {
        templateUrl: 'templates/business-detail.html',
        controller: 'BusinessDetailCtrl'
      }
    },
    data: {
      tabID: 1,
      channel: "events"
    }
  })

  .state('app.events-images', {
    url: '/events/:entity/:slug/images',
    views: {
      'app-more': {
        templateUrl: 'templates/image-gallery.html',
        controller: 'ImageGalleryCtrl'
      }
    }
  })

// End

  .state('app.pledge', {
    url: '/pledge',
    views: {
      'app-more': {
        templateUrl: 'templates/webframe.html',
        controller: 'WebFrameCtrl'
      }
    },
    data: {
      title: "Pledge Now",
      url: "https://docs.google.com/forms/d/1aQJlgAdEZLDxZjFaKB4Ef_CUE0Yz2qInZmmAnB3h5_o/viewform?formkey=dEItdEVINDRNT2U0T1Jqd2NwSWxkWnc6MA#gid=2"
    }
  })

  .state('app.more', {
    url: '/more',
    views: {
      'app-more': {
        templateUrl: 'templates/more.html'
      }
    }
  })

  // Custom
  .state('app.calc', {
    url: '/calc',
    views: {
      'app-calc': {
        templateUrl: 'custom/calculator.html',
        controller: 'PowerCalcCtrl'
      }
    },
    data: {
      title: "Energy Saving Calculator"
    }
  })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');

});
