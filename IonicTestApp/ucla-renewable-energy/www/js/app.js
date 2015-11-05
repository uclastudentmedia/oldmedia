// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'firebase', 'ngCordova','starter.controllers', 'starter.services'])

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
    if(typeof analytics !== "undefined") {
      analytics.startTrackerWithId("UA-39834942-7");
      analytics.trackView("app-home");
      analytics.trackView("app-events");
      analytics.trackView("app-dark");
      analytics.trackView("app-more");
    } else {
      console.log("Google Analytics Unavailable");
    }
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
      profile: "ucla-renewable-energy-2",
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
      title: "Events",
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

  .state('app.dark', {
    url: '/dark',
    views: {
      'app-dark': {
        templateUrl: 'templates/entities.html',
        controller: 'EntitiesCtrl'
      }
    },
    data: {
      tabID: 0,
      channel: "dark",
      title: "Do It in the Dark"
    }
  })

  .state('app.dark-profile', {
    url: '/dark/:entity/:slug',
    views: {
      'app-dark': {
        templateUrl: 'templates/business-detail.html',
        controller: 'BusinessDetailCtrl'
      }
    },
    data: {
      tabID: 0,
      channel: "dark"
    }
  })

  .state('app.dark-images', {
    url: '/dark/:entity/:slug/images',
    views: {
      'app-dark': {
        templateUrl: 'templates/image-gallery.html',
        controller: 'ImageGalleryCtrl'
      }
    }
  })

// End

  .state('app.more', {
    url: '/more',
    views: {
      'app-more': {
        templateUrl: 'templates/more.html'
      }
    }
  })

// Story List States Begin

  .state('app.storyList', {
    url: '/list',
    views: {
      'app-list': {
        templateUrl: 'templates/story-list.html',
        controller: 'StoryListCtrl'
      }
    },
    data: {
      title: "Weekly Highlights",
      tag: "stories",
      adfreq: 0.33 // this is the percentage of total items that are ads
    }
  })

  .state('app.list-detail', {
    url: '/list/:id',
    views: {
      'app-list': {
        templateUrl: 'templates/post-detail.html',
        controller: 'PostDetailCtrl'
      }
    }
  })

// Story List States End

// Ad Pages States Begin

.state('app.deals', {
    url: '/deals',
    views: {
      'app-more': {
        templateUrl: 'templates/ad-pages.html',
        controller: 'AdPagesCtrl'
      }
    },
    data: {
      title: "Deals and Offers",
      adTag: "REC"
    }
  })

  .state('app.deals-detail', {
    url: '/deals/:id',
    views: {
      'app-more': {
        templateUrl: 'templates/post-detail.html',
        controller: 'PostDetailCtrl'
      }
    }
  })

// Ad Pages States End

// Classic Story List States Begin

  .state('app.info', {
    url: '/info',
    views: {
      'app-more': {
        templateUrl: 'templates/post-list.html',
        controller: 'PostListCtrl'
      }
    },
    data: {
      tag: "info",
      title: "Info",
      channel: "info"
    }
  })

  .state('app.info-detail', {
    url: '/info/:id',
    views: {
      'app-more': {
        templateUrl: 'templates/post-detail.html',
        controller: 'PostDetailCtrl'
      }
    }
  })

// Story List States End

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');

});
