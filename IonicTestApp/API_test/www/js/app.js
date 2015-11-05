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
       analytics.startTrackerWithId("UA-39834942-10");
    } else {
      console.log("Google Analytics Unavailable");
    }
    //$rootScope.authData = JSON.parse(window.localStorage['authData'] || '{}');
  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

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
      profile: "dashew-center-for-international-students-and-schol",
      adTag: "ucladashew"
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

  // Magazine Pages
  
  .state('app.magPages', {
    url: '/feed',
    views: {
      'app-events': {
        templateUrl: 'templates/pages.html',
        controller: 'MagazinePagesCtrl'
      }
    },
    data: {
        tag: "events",
        title: "Events",
    }
  })

  .state('app.magPages-detail', {
    url: '/feed/:id',
    views: {
      'app-events': {
        templateUrl: 'templates/post-detail.html',
        controller: 'PostDetailCtrl'
      }
    }
  })
  
  // End Magazine Pages
  
  // Highlights Pages
  
  .state('app.handbooks', {
    url: '/handbooks',
    views: {
      'app-handbooks': {
        templateUrl: 'templates/highlights.html',
        controller: 'HighlightCtrl'
      }
    },
    data: {
        tabID: 0,
        channel: "handbooks",
        title: "Handbooks"
    }   
  })

  .state('app.handbooks-detail', {
    url: '/handbooks/:entity',
    views: {
      'app-handbooks': {
        templateUrl: 'templates/entities.html',
        controller: 'HighlightDetailCtrl'
      }
    },
    data: {
      tabID: 0,
      channel: "handbooks"
    }
  })
  
  .state('app.handbooks-profile', {
    url: '/handbooks/:entity/:slug',
    views: {
      'app-handbooks': {
        templateUrl: 'templates/business-detail.html',
        controller: 'BusinessDetailCtrl'
      }
    },
    data: {
      tabID: 0,
      channel: "handbooks"
    }
  })
  
  
  .state('app.handbooks-images', {
    url: '/handbooks/:entity/:slug/images',
    views: {
      'app-handbooks': {
        templateUrl: 'templates/image-gallery.html',
        controller: 'ImageGalleryCtrl'
      }
    },
    data: {
        title: "Handbooks"
    }
  })
  
  .state('app.programs', {
    url: '/programs',
    views: {
      'app-more': {
        templateUrl: 'templates/highlights.html',
        controller: 'HighlightCtrl'
      }
    },
    data: {
      tabID: 2,
      channel: "programs",
      title: "Programs"
    }
  })

  .state('app.programs-detail', {
    url: '/programs/:entity',
    views: {
      'app-more': {
        templateUrl: 'templates/entities.html',
        controller: 'HighlightDetailCtrl'
      }
    },
    data: {
      tabID: 2,
      channel: "programs",
      title: "Programs"
    }
  })
  
  
  .state('app.programs-profile', {
    url: '/programs/:entity/:slug',
    views: {
      'app-more': {
        templateUrl: 'templates/business-detail.html',
        controller: 'BusinessDetailCtrl'
      }
    },
    data: {
      tabID: 2,
      channel: "programs"
    }
  })
  
  .state('app.staff', {
    url: '/staff',
    views: {
      'app-more': {
        templateUrl: 'templates/highlights.html',
        controller: 'HighlightCtrl'
      }
    },
    data: {
      tabID: 1,
      channel: "staff",
      title: "Staff"
    }
  })

  .state('app.staff-detail', {
    url: '/staff/:entity',
    views: {
      'app-more': {
        templateUrl: 'templates/entities.html',
        controller: 'HighlightDetailCtrl'
      }
    },
    data: {
      tabID: 1,
      channel: "staff",
      title: "Staff"
    }
  })
  
  .state('app.staff-profile', {
    url: '/staff/:entity/:slug',
    views: {
      'app-more': {
        templateUrl: 'templates/business-detail.html',
        controller: 'BusinessDetailCtrl'
      }
    },
    data: {
      tabID: 1,
      channel: "staff"
    }
  })
  
  .state('app.staff-images', {
    url: '/staff/:entity/:slug/images',
    views: {
      'app-more': {
        templateUrl: 'templates/image-gallery.html',
        controller: 'ImageGalleryCtrl'
      }
    },
    data: {
        title: "Staff"
    }
  })
  // End Highlights Pages
  
  // Entities List State Series Begin
/*
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
*/
// End

  // Storylist states here
/*  .state('app.storyList', {
    url: '/list',
    views: {
      'app-classifieds': {
        templateUrl: 'templates/story-list.html',
        controller: 'StoryListCtrl'
      }
    },
    data: {
        adfreq: .33,
        tag: "classifieds",
        title: "Classifieds"
    }
  })

  .state('app.list-detail', {
    url: '/list/:id',
    views: {
      'app-classifieds': {
        templateUrl: 'templates/post-detail.html',
        controller: 'PostDetailCtrl'
      }
    }
  })
*/
.state('app.classifieds', {
    url: '/classifieds',
    views: {
      'app-classifieds': {
        templateUrl: 'templates/story-list.html',
        controller: 'StoryListCtrl'
      }
    },
    data: {
      adfreq: .33,
      tag: "classifieds",
      title: "Classifieds"
    }
  })

  .state('app.classifieds-detail', {
    url: '/classifieds/:id',
    views: {
      'app-classifieds': {
        templateUrl: 'templates/post-detail.html',
        controller: 'PostDetailCtrl'
      }
    }
  })  
  
  .state('app.wip', {
    url: '/wip',
    views: {
      'app-more': {
        templateUrl: 'templates/story-list.html',
        controller: 'StoryListCtrl'
      }
    },
    data: {
      tag: "wip",
      title: "The WIP",
      adfreq: 0.33
    }
  })

  .state('app.wip-detail', {
    url: '/wip/:id',
    views: {
      'app-more': {
        templateUrl: 'templates/post-detail.html',
        controller: 'PostDetailCtrl'
      }
    }
  })  
  
  .state('app.news', {
    url: '/news',
    views: {
      'app-more': {
        templateUrl: 'templates/story-list.html',
        controller: 'StoryListCtrl'
      }
    },
    data: {
      tag: "news",
      title: "News",
      adfreq: 0.33
    }
  })

  .state('app.news-detail', {
    url: '/news/:id',
    views: {
      'app-more': {
        templateUrl: 'templates/post-detail.html',
        controller: 'PostDetailCtrl'
      }
    }
  })  
  
  .state('app.contact', {
    url: '/contact',
    views: {
      'app-more': {
        templateUrl: 'templates/post-list.html',
        controller: 'PostListCtrl'
      }
    },
    data: {
      tag: "contact",
      title: "Contact Us",
      channel: "contact"
    }
  })

  .state('app.contact-detail', {
    url: '/contact/:id',
    views: {
      'app-more': {
        templateUrl: 'templates/post-detail.html',
        controller: 'PostDetailCtrl'
      }
    }
  })  
  
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
  /*
  
  */
  // End Storylist states

  // Event States Begin
/*
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
*/

// Event States End

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
    },
    data: {
        title: "Events"
    }
  })

// End

// Ad Page begin

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
      adTag: "ucladashew"
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

// Gallery begin

  .state('app.gallery', {
    url: '/gallery',
    views: {
      'app-more': {
        templateUrl: 'templates/image-gallery.html',
        controller: 'ImageGalleryCtrl'
      }
    },
    data: {
        title: "Gallery"
    }
  })

//Gallery end

// Ad Page end
  .state('app.more', {
    url: '/more',
    views: {
      'app-more': {
        templateUrl: 'templates/more.html'
      }
    }
  })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
  
});
