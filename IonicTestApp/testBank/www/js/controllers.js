angular.module('starter.controllers', [])

.controller('TestCtrl', function($scope, $ionicLoading, $http, Highlights) {
	$ionicLoading.show();

	var result = Highlights.all();
	result.then( function( val ) {
		$scope.highlights = val['result'];
		$ionicLoading.hide();
	});

	$scope.doRefresh = function() {
		var newResult = Highlights.all();
		newResult.then( function( val ) {
			$scope.highlights = val['result'];
			$scope.$broadcast('scroll.refreshComplete');
		});
	}
})

.controller('TestDetailCtrl', function($scope, $stateParams, $ionicLoading, Highlights) {
	$ionicLoading.show();

	var data = JSON.parse(window.localStorage.getItem("profile"));
	for( var i = 0; i < data.length; i++ )
	{
		if( data[i]['id'] == $stateParams['entity'] )
		{
			$scope.entity = data[i];
			$scope.entities = $scope.entity['entities'];
			$ionicLoading.hide();
			break;
		}
	}
})

.controller('TestImageDetailCtrl', function($scope, $stateParams, $ionicLoading, $ionicSlideBoxDelegate, $ionicModal, ImageGallery, Highlights) {
	$ionicLoading.show();
    
	var result = ImageGallery.loadImages($stateParams['slug']);
	result.then( function( val ) {
		$scope.imageList = val['result'];
		$ionicLoading.hide();
	});
    
    $ionicModal.fromTemplateUrl('tab.tests.entity-detail.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal
    })
    
	$scope.title = Highlights.getTitle($stateParams['entity']);

    $scope.get_slug = function() {
        return $stateParams['slug'];
    }
	$scope.updateSlider = function() {
		$ionicSlideBoxDelegate.update();
	}

    $scope.cur_index = function() {
        return $ionicSlideBoxDelegate.currentIndex();
    }
    
	$scope.saveImages = function() {
        ImageGallery.saveImages();
	}
    
    $scope.openModal = function() {
        $scope.modal.show();
    } 

    $scope.closeModal = function() {
        $scope.modal.hide();
    }
    $scope.$on('$destroy', function() {
        $scope.modal.remove();
    });
})
		
.controller('TutorCtrl', function($scope, Posts) {
	var result = Posts.all();
	result.then( function( val ) {
		$scope.posts = val['result'];
	});

	$scope.doRefresh = function() {
		var newResult = Posts.all();
		newResult.then( function( val ) { 
			$scope.posts = val['result'];
			$scope.$broadcast('scroll.refreshComplete');
		});
	}
})

.controller('TutorDetailCtrl', function($scope, $stateParams, Posts) {
	var result = Posts.getPost($stateParams['post']);
	result.then( function( val ) {
		$scope.post = val['result'];
	});
});