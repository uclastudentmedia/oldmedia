angular.module('starter.controllers', [])

.controller('HighlightCtrl', function($scope, $ionicLoading, $state, Highlights) {
	$ionicLoading.show();

	$scope.channel = $state.current.data.channel;
	switch($scope.channel) {
		case "loc":
			$scope.title = "By Location";
			break;
		case "type":
			$scope.title = "By Type";
			break;
	}

	var result = Highlights.all($state.current.data.tabID);
	result.then( function( val ) {
		$scope.highlights = val['result'];
		$ionicLoading.hide();
	});

	$scope.doRefresh = function() {
		var newResult = Highlights.refreshAll($state.current.data.tabID);
		newResult.then( function( val ) {
			$scope.highlights = val['result'];
			$scope.$broadcast('scroll.refreshComplete');
		});
	}

	$scope.valid = function(input) {
		return !(input == "" || typeof input == undefined || typeof input == null);
	}
})

.controller('HighlightDetailCtrl', function($scope, $stateParams, $ionicLoading, $state, Highlights) {
	$ionicLoading.show();

	var data = Highlights.getHighlight($stateParams.entity, $state.current.data.tabID);

	$scope.channel = $state.current.data.channel;

	$scope.entity = data;
	var data = $scope.entity['entities'];
	for( var i = 0; i < data.length; i++ )
	{
		// ...eff you, that's why. Won't take functions as links
		var q = function(index) {
			var result = Highlights.getPreviewImage( data[index]['slug'] );
			result.then( function(val) {
				$scope.stdAvatar = {
					"width": "3em !important",
					"height": "3em !important"
				};
				data[index]['image_thumbnail_url'] = val['result'];
			});
		}

		q(i);		
	}

	$scope.valid = function(input) {
		return !(input == "" || typeof input == undefined || typeof input == null);
	}

	$scope.entities = data;
	$ionicLoading.hide();
})

.controller('BusinessDetailCtrl', function($scope, $stateParams, $ionicLoading, $ionicModal, $state, $cordovaInAppBrowser, Highlights, Businesses) {
	$ionicLoading.show();

	$scope.channel = $state.current.data.channel;
	$scope.entityID = $stateParams.entity;
	$scope.slug = $stateParams.slug;
    $scope.testing = "THIS IS A TEST";

	var otherResult = Highlights.getPreviewImage($stateParams.slug);
	$scope.previewImage = "";
	otherResult.then( function( val ) {
		$scope.previewImage = val['result'];
		$scope.imageClass = {
			"background": "url(" + $scope.previewImage + ")",
			"height": "200px",
			"background-position": "center",
			"background-repeat": "no-repeat",
			"background-size": "contain"
		};
	});

	var result = Businesses.getBusiness($stateParams.slug);
	result.then( function( val ) {
		$scope.entity = val['result'];
		console.log($scope.entity.entity);
		$ionicLoading.hide();
	});

	$ionicModal.fromTemplateUrl('templates/business-desc.html', {
		scope: $scope
	}).then( function( modal ) {
		$scope.modal = modal;
	});

	$ionicModal.fromTemplateUrl('templates/business-hours.html', {
		scope: $scope
	}).then( function( modal ) {
		$scope.hours = modal;
	});
    
    $scope.$on('$destroy', function() {
        $scope.modal.remove();
        $scope.hours.remove();
    });
    
    //Requires Cordova InAppBrowser plugin: org.apache.cordova.inappbrowser. Import $cordovaInAppBrowser
    $scope.openURL = function(url) {
        
        //Set location to 'yes' to show address bar on top of the InAppBrowser. Set location to 'no' to not show address bar in InAppBrowser
        //Set clear cache to 'yes' clear browser's cookiecache  before url opens
        var options = {
            location: 'no',
            clearcache: 'no'
        };
        //Use '_system' to open the url in the system's default browser. Use '_blank' to open the url in an InAppBrowser. Use '_self' to open url in Cordova Web View
        $cordovaInAppBrowser.open(url, '_system', options);
        return false;
    }
    
	$scope.valid = function(input) {
		return !(input == "" || typeof input == undefined || typeof input == null);
	}
})

.controller('ImageGalleryCtrl', function($scope, $stateParams, $ionicLoading, $ionicSlideBoxDelegate, $ionicModal, ImageGallery, Highlights) {
	$ionicLoading.show();
    
	var result = ImageGallery.loadImages($stateParams['slug']);
	result.then( function( val ) {
		$scope.imageList = val['result'];
		$ionicLoading.hide();
	});
    
    $ionicModal.fromTemplateUrl('templates/image-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal
    })

    $scope.get_slug = function() {
        return $stateParams['slug'];
    }
	$scope.updateSlider = function() {
		$ionicSlideBoxDelegate.update();
	}

    $scope.cur_index = function() {
        return $ionicSlideBoxDelegate.currentIndex();
    }

    $scope.nextImg = function() {
    	$ionicSlideBoxDelegate.next();
    }

    $scope.prevImg = function() {
    	$ionicSlideBoxDelegate.previous();
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

.controller('MagazinePagesCtrl', function($scope, $state, $ionicLoading, $ionicSlideBoxDelegate, $ionicPopup, $ionicPlatform, Posts, InternetCheck) {
	$ionicLoading.show();
    $ionicLoading.show({ template: 'Item Added!', noBackdrop: true, duration: 2000 });
    
	$scope.offset = 0;
    
	var result = Posts.initialLoad();
	result.then( function( val ) {
		$scope.posts = val['result'];
		$scope.offset = typeof val['offset'] == "undefined" ? 9 : val['offset'];
        
		$ionicLoading.hide();
	}, function (error) {
        
        $ionicLoading.hide();
        alert("Load failed! Please check your internet connection");
    });

	$scope.updateSlider = function() {
		$ionicSlideBoxDelegate.update();
	}
    
    $scope.$on('$ionicView.beforeEnter', function() {
        $scope.updateSlider();
    });

	$scope.clickHandler = function(postID) {
		$state.go('app.magPages-detail', {id: postID});
	}

	$scope.valid = function(input) {
		return !(input == "" || typeof input == undefined || typeof input == null);
	}

	$scope.loadMorePosts = function() {
		if( $ionicSlideBoxDelegate.currentIndex() != $ionicSlideBoxDelegate.slidesCount() - 1 )
			return;

		$ionicLoading.show();
		var result = Posts.getNextPost($scope.offset);
		result.then( function( val ) {
			$scope.offset += 10;
			for( var i = 0; i < val['result'].length; i++ )
			{
				$scope.posts.push(val['result'][i]);
			}
			$ionicSlideBoxDelegate.update();
			$ionicLoading.hide();
		});
	}
})

.controller('PostDetailCtrl', function($scope, $stateParams, $ionicLoading, Posts) {
	$ionicLoading.show();
	var result = Posts.getPost($stateParams.id);

	result.then( function( val ) {
		$scope.post = val;
		$ionicLoading.hide();
	});

	$scope.valid = function(input) {
		return !(input == "" || typeof input == undefined || typeof input == null);
	}

	$scope.doRefresh = function() {
		var resultAgain = Posts.getPost($stateParams.id);

		resultAgain.then( function( val ) {
			$scope.post = val;
			$scope.$broadcast('scroll.refreshComplete');
		});
	}
})

.controller('StoryListCtrl', function($scope, Posts) {
	$scope.posts = new Array();
	$scope.offset = 0;

	$scope.valid = function(input) {
		return !(input == "" || typeof input == undefined || typeof input == null);
	}

	$scope.formatDate = function( date ) {
		return new Date(date).toLocaleDateString();
	}

	$scope.loadMore = function() {
		if( $scope.posts.length == 0 )
		{
			var result = Posts.initialLoad();
			result.then( function( val ) {
				$scope.posts = val['result'];
				$scope.offset = typeof val['offset'] == "undefined" ? 9 : val['offset'];
				$scope.$broadcast('scroll.infiniteScrollComplete');
			});
		}
		else
		{
			var result = Posts.getNextPost($scope.offset);
			result.then( function( val ) {
				console.log("received");
				$scope.offset += 10;
				for( var i = 0; i < val['result'].length; i++ )
				{
					$scope.posts.push(val['result'][i]);
				}
				$scope.$broadcast('scroll.infiniteScrollComplete');
			});	
		}
	}

	$scope.doRefresh = function() {
		var newResult = Posts.refreshPosts( $scope.offset );
		newResult.then( function( val ) {
			$scope.posts = val;
			$scope.$broadcast('scroll.refreshComplete');
		});
	}

	$scope.showLoader = function() {
		if( $scope.posts.length == 0 )
			return false;
		else 
		{
			var potential = Posts.lastPost($scope.offset);
			potential.then( function( val ) {
				return val;
			});
		}
	}
})

.controller('WallCtrl', function($scope, $ionicLoading, $cordovaInAppBrowser, $ionicPlatform, Cards, InternetCheck) {
	$ionicLoading.show();
	$scope.offset = 0;

   $ionicPlatform.ready(function() {
        if(InternetCheck.check(true))
            $ionicLoading.hide();
    });
    
	var rss = Cards.getRSS($scope.offset);
	rss.then( function( val ) {
		$scope.rssCards = val.reverse();
		$scope.offset += 10;
		$ionicLoading.hide();
	}, function (error) {
        $cordovaToast.showLongBottom("Loading failed! Please check your internet connection");
        $ionicLoading.hide();
    });

	$scope.formatDate = function( date ) {
		return new Date(date).toLocaleDateString();
	}

	$scope.loadMore = function() {
        if(InternetCheck.check(true))
        {
            $ionicLoading.hide();
            return;
        }
		$ionicLoading.show();
		var moreRSS = Cards.getRSS($scope.offset);
		moreRSS.then( function( val ) {
			$scope.rssCards = val.reverse();
			$scope.offset += 10;
			$ionicLoading.hide();
		});
        
        $cordovaToast.showLongBottom("Testing");
	}
    
    $scope.openURL = function(url) {
        
        //Set location to 'yes' to show address bar on top of the InAppBrowser. Set location to 'no' to not show address bar in InAppBrowser
        //Set clear cache to 'yes' clear browser's cookiecache  before url opens
        var options = {
            location: 'no',
            clearcache: 'no'
        };
        //Use '_system' to open the url in the system's default browser. Use '_blank' to open the url in an InAppBrowser. Use '_self' to open url in Cordova Web View
        $cordovaInAppBrowser.open(url, '_system', options);
        return false;
    }
});