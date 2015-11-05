// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

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
  })

})

.controller('global', function($scope) {
  var winHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

  function genColor() {
    return '#'+Math.floor(Math.random()*16777215).toString(16);
  }

  $scope.questions = [
      {
        "header": "Question One",
        "text": "This is sample question text which is approximately the right length",
        "color": {
          "background-color": genColor(),
          "height": winHeight + "px"
        },
        "textcolor": {
          "color": "#FFF"
        },
        "timer": 400
      },
      {
        "header": "Question One",
        "text": "This is sample question text which is approximately the right length",
        "color": {
          "background-color": genColor(),
          "height": winHeight + "px"
        },
        "textcolor": {
          "color": "#FFF"
        },
        "timer": null
      }
    ];     
});
