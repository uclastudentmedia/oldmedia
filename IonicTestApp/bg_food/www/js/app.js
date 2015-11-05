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
    templateUrl: "templates/menu.html"
  })

  // Each app has its own nav history stack:

  .state('app.magPages', {
    url: '/feed',
    views: {
      'menuContent': {
        templateUrl: 'templates/pages.html',
        controller: 'MagazinePagesCtrl'
      }
    }
  })

  .state('app.magPages-detail', {
    url: '/feed/:id',
    views: {
      'menuContent': {
        templateUrl: 'templates/post-detail.html',
        controller: 'PostDetailCtrl'
      }
    }
  })

  .state('app.wall', {
    url: '/wall',
    views: {
      'menuContent': {
        templateUrl: 'templates/wall.html',
        controller: 'WallCtrl'
      }
    }
  })

  .state('app.storyList', {
    url: '/list',
    views: {
      'menuContent': {
        templateUrl: 'templates/story-list.html',
        controller: 'StoryListCtrl'
      }
    }
  })

  .state('app.list-detail', {
    url: '/list/:id',
    views: {
      'menuContent': {
        templateUrl: 'templates/post-detail.html',
        controller: 'PostDetailCtrl'
      }
    }
  })

  .state('app.byType', {
    url: '/type',
    views: {
      'menuContent': {
        templateUrl: 'templates/highlights.html',
        controller: 'HighlightCtrl'
      }
    },
    data: {
      tabID: 0,
      channel: "type"
    }
  })

  .state('app.byType-detail', {
    url: '/type/:entity',
    views: {
      'menuContent': {
        templateUrl: 'templates/entities.html',
        controller: 'HighlightDetailCtrl'
      }
    },
    data: {
      tabID: 0,
      channel: "type"
    }
  })

  .state('app.byType-profile', {
    url: '/type/:entity/:slug',
    views: {
      'menuContent': {
        templateUrl: 'templates/business-detail.html',
        controller: 'BusinessDetailCtrl'
      }
    },
    data: {
      tabID: 0,
      channel: "type"
    }
  })

  .state('app.byType-images', {
    url: '/type/:entity/:slug/images',
    views: {
      'menuContent': {
        templateUrl: 'templates/image-gallery.html',
        controller: 'ImageGalleryCtrl'
      }
    }
  })

  .state('app.byLoc', {
    url: '/loc',
    views: {
      'menuContent': {
        templateUrl: 'templates/highlights.html',
        controller: 'HighlightCtrl'
      }
    },
    data: {
      tabID: 1,
      channel: "loc"
    }
  })

  .state('app.byLoc-detail', {
    url: '/loc/:entity',
    views: {
      'menuContent': {
        templateUrl: 'templates/entities.html',
        controller: 'HighlightDetailCtrl'
      }
    },
    data: {
      tabID: 1,
      channel: "loc"
    }
  })

  .state('app.byLoc-profile', {
    url: '/loc/:entity/:slug',
    views: {
      'menuContent': {
        templateUrl: 'templates/business-detail.html',
        controller: 'BusinessDetailCtrl'
      }
    },
    data: {
      tabID: 1,
      channel: "loc"
    }
  })

  .state('app.byLoc-images', {
    url: '/loc/:entity/:slug/images',
    views: {
      'menuContent': {
        templateUrl: 'templates/image-gallery.html',
        controller: 'ImageGalleryCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/feed');

});
