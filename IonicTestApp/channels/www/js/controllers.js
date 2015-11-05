angular.module('ionic.controllers', [])

.controller('highlights', function($scope) {
	
})

.controller('homeList', function ($scope) {
  $scope.items = [
    {'channel': 'Home', 'url': 'home'},
    {'channel': 'Entities List', 'url': '#'},
    {'channel': 'Highlight Section', 'url': 'highlights'},
    {'channel': 'Favorites', 'url': '#'},
    {'channel': 'Magazine Pages', 'url': '#'},
    {'channel': 'Standard Story List', 'url': '#'},
    {'channel': 'Newspaper Story List', 'url': '#'}, 
    {'channel': 'Gallery', 'url': '#'},
    {'channel': 'Twitter Web View', 'url': '#'},
    {'channel': 'Social Gallery', 'url': '#'},
    {'channel': 'Feed', 'url': '#'},
    {'channel': 'Events', 'url': '#'},
    {'channel': 'Members', 'url': '#'},
    {'channel': 'Menus', 'url': '#'},
    {'channel': 'Products', 'url': '#'},
    {'channel': 'Product Categories', 'url': '#'},
    {'channel': 'Roster', 'url': '#'},
    {'channel': 'Ad Network', 'url': '#'},
    {'channel': 'Coupons', 'url': '#'},
    {'channel': 'Housing Classifieds', 'url': '#'},
    {'channel': 'Job Classifieds', 'url': '#'},
    {'channel': 'Shoutcast Radio', 'url': '#'},
    {'channel': 'HTTP Radio', 'url': '#'},
    {'channel': 'Website', 'url': '#'}
  ];
})