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

.controller('EntitiesCtrl', function($scope, $stateParams, $ionicLoading, $state, Highlights, Entities, InternetCheck) {
	$scope.valid = function(input) {
		return !(input == "" || typeof input == undefined || typeof input == null || input == undefined);
	}

	$scope.title = $state.current.data.title;
	$ionicLoading.show();
	$scope.channel = $state.current.data.channel;

	var data = Entities.getEntities($state.current.data.tabID);
	data.then( function( val ) {
        ionic.Platform.ready(function () {
            $scope.entity = val;
            var entities = $scope.entity['entities'];
            var internet = InternetCheck.check_promise(true);
            internet.then(function (success) {
                for( var i = 0; i < entities.length && internet; i++ )
                {
                    // ...eff you, that's why. Won't take functions as links
                    var q = function(index) {
                        var result = Highlights.getPreviewImage( entities[index]['slug'] );
                        result.then( function(val) {
                            entities[index]['image_thumbnail_url'] = val;
                        });
                    }
                    q(i);		
                }
    
                $scope.entities = entities;
            }, function (error) {$scope.entities = entities;});
            $ionicLoading.hide();});
        });	

	$scope.doRefresh = function() {
		var newResult = Entities.refreshEntities($state.current.data.tabID);
		newResult.then( function( val ) {
			ionic.Platform.ready(function () {
            $scope.entity = val;
            var entities = $scope.entity['entities'];
            var internet = InternetCheck.check_promise(true);
            internet.then(function (success) {
                for( var i = 0; i < entities.length && internet; i++ )
                {
                    // ...eff you, that's why. Won't take functions as links
                    var q = function(index) {
                        var result = Highlights.getPreviewImage( entities[index]['slug'] );
                        result.then( function(val) {
                            entities[index]['image_thumbnail_url'] = val;
                        });
                    }
                    q(i);		
                }
    
                $scope.entities = entities;
            }, function (error) {$scope.entities = entities;});
            
			$scope.$broadcast('scroll.refreshComplete');});
		});
	}
})

.controller('EventsCtrl', function($scope, $ionicLoading, $state, Events) {
	$ionicLoading.show();
	$scope.tag = $state.current.data.tag;
	$scope.title = $state.current.data.title;
	$scope.channel = $state.current.data.channel;
	var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

	$scope.valid = function(input) {
		return !(input == "" || typeof input == undefined || typeof input == null);
	}

	var result = Events.getEvents();
	result.then( function( val ) {
		var data = val;
		data.sort(function(a, b) {return a.start_date_unix.timestamp - b.start_date_unix.timestamp;});

		var currMonth = -1;
		var currYear = -1;
		for( var i = 0; i < data.length; ++i )
		{
			var date = new Date( data[i].start_date );
			if( date.getMonth() != currMonth || date.getFullYear() != currYear )
			{
				currMonth = date.getMonth();
				currYear = date.getFullYear();

				data.splice(i, 0, { type: "Divider", title: months[currMonth] + " " + currYear, start_date: ""});
			}
		}

		$scope.events = data;
		$ionicLoading.hide();
	});

	$scope.isDivider = function(obj) {
		return typeof obj.type != "undefined";
	}

	$scope.doRefresh = function() {
		var newResult = Events.refreshEvents();
		newResult.then( function( val ) {
            val.sort(function(a, b) {return a.start_date_unix.timestamp - b.start_date_unix.timestamp;});
            var data = val;
            var currMonth = -1;
		var currYear = -1;
		for( var i = 0; i < data.length; ++i )
		{
			var date = new Date( data[i].start_date );
			if( date.getMonth() != currMonth || date.getFullYear() != currYear )
			{
				currMonth = date.getMonth();
				currYear = date.getFullYear();

				data.splice(i, 0, { type: "Divider", title: months[currMonth] + " " + currYear, start_date: ""});
			}
		}
			$scope.events = val;
			$scope.$broadcast('scroll.refreshComplete');
		});
	}

	$scope.showDate = function( dateString )
	{
		var date = new Date(dateString);
		return date.toLocaleDateString();
	}
})

.controller('EventDetailCtrl', function($scope, $stateParams, Events) {
	$scope.valid = function(input) {
		return !(input == "" || input == null || typeof input == undefined || typeof input == null);
	}
    var event = Events.getEventByID($stateParams.id);
	$scope.event = Events.getEventByID($stateParams.id);
	//console.log($scope.event.end_date);

	$scope.showDate = function( dateString )
	{
		var date = new Date(dateString);
		return date.toLocaleDateString();
	}

	$scope.showTime = function( dateString )
	{
		var date = new Date(dateString);
		return date.toLocaleTimeString();
	}
})

.controller('HomeCtrl', function($scope, $ionicLoading, $state, $ionicModal, $ionicPlatform, Home, Highlights) {
	$ionicLoading.show();

	$scope.valid = function(input) {
		return !(input == "" || typeof input == undefined || typeof input == null);
	}    
	var otherResult = Highlights.getPreviewImage($state.current.data.profile);
	$scope.previewImage = "";
	otherResult.then( function( val ) {
		$scope.previewImage = val;
		$scope.imageClass = {
			"background": "url(" + $scope.previewImage + ")",
			"height": "350px",
			"background-position": "center",
			"background-repeat": "no-repeat",
			"background-size": "contain",
			"background-color": "#fcfcfa"
		};
	}, function (error) {
        //ionic.Platform.ready(function () {InternetCheck.check(true);});
    });

	var result = Home.getHome();
	result.then( function( val ) {
		$scope.entity = val;
		$scope.sections = val['sections'];
		$ionicLoading.hide();
	});

	$ionicModal.fromTemplateUrl('templates/business-desc.html', {
		scope: $scope
	}).then( function( modal ) {
		$scope.modal = modal;
	});

    $scope.$on('$destroy', function() {
        $scope.modal.remove();
    });
})

.controller('BusinessDetailCtrl', function($scope, $stateParams, $ionicLoading, $ionicModal, $state, $cordovaInAppBrowser, Highlights, Businesses) {
	$ionicLoading.show();

	$scope.valid = function(input) {
		return !(input == "" || typeof input == undefined || typeof input == null);
	}

	$scope.channel = $state.current.data.channel;
	$scope.entityID = $stateParams.entity;
	$scope.slug = $stateParams.slug;

	var otherResult = Highlights.getPreviewImage($stateParams.slug);
	$scope.previewImage = "";
	otherResult.then( function( val ) {
		$scope.previewImage = val;
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
		$scope.entity = val;
		console.log($scope.entity);
		$ionicLoading.hide();
	}, function (error) {
        //ionic.Platform.ready(function () {InternetCheck.check(true);});
        //$state.transitionTo("app.dark");
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
})

.controller('ImageGalleryCtrl', function($scope, $stateParams, $ionicLoading, $ionicSlideBoxDelegate, $ionicModal, ImageGallery, Highlights) {
	$ionicLoading.show();
    
	var result = ImageGallery.loadImages($stateParams['slug']);
	result.then( function( val ) {
		$scope.imageList = val['result'];
		$ionicLoading.hide();
	}, function (error) {
        //ionic.Platform.ready(function () {InternetCheck.check(true);});
        
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

.controller('AdPagesCtrl', function($scope, $state, $ionicLoading, $ionicActionSheet, $ionicSlideBoxDelegate, Ads) {
	$ionicLoading.show();
	$scope.title = $state.current.data.title;

	var result = Ads.getAllAds();
	result.then( function( val ) {
		console.log(val);
		$scope.ads = val;
		$ionicLoading.hide();
	})

	$scope.clickHandler = function() {
		var index = $ionicSlideBoxDelegate.currentIndex();
		switch( $scope.ads[index].ad_type )
		{
			case "image":
				$scope.displayActionSheet();
				break;
		}
	}

	$scope.displayActionSheet = function() {
    	var buttonArray = new Array();
    	var index = $ionicSlideBoxDelegate.currentIndex();
    	if( $scope.valid( $scope.ads[index].data.phone ))
    		buttonArray.push( {text: 'Phone: ' + $scope.ads[index].data.phone} );
    	if( $scope.valid( $scope.ads[index].data.email ))
    		buttonArray.push( {text: 'Email: ' + $scope.ads[index].data.email} );
    	if( $scope.valid( $scope.ads[index].data.website ))
			buttonArray.push( {text: $scope.ads[index].data.website} );
    	
    	var hideSheet = $ionicActionSheet.show({
    		buttons: buttonArray,
    		cancelText: 'Cancel',
    		titleText: 'Contact',
    		cancel: function() {
    			// do nothing
    		},
    		buttonClicked: function(index) {
    			switch(index) {
    				case 0: 
    					window.open("tel:" + $scope.posts[$scope.adIndex].data.phone);
    					break;
    				case 1:
    					window.open("mailto:" + $scope.posts[$scope.adIndex].data.email);
    					break;
    			}
    		}
    	});
    }

	$scope.valid = function(input) {
		return !(input == "" || typeof input == undefined || typeof input == null);
	}

	$scope.updateSlider = function() {
		$ionicSlideBoxDelegate.update();
	}

/*
	var adRequestArray = new Array();
	for( var i = 0; i < 5; i++ )
	{
		adRequestArray.push( Ads.getRandomAd() );
	}

	$q.all( adRequestArray ).then( function( val ) {
		var posts = new Array();
		for( var j = 0; j < val.length; j++ )
			posts.push(val[j]);
		$scope.ads = posts;
		$ionicLoading.hide();
	});
 */
})

.controller('MagazinePagesCtrl', function($scope, $state, $ionicLoading, $ionicSlideBoxDelegate, $ionicPopup, $ionicPlatform, Posts) {
	$ionicLoading.show();
    $ionicLoading.show({ template: 'Item Added!', noBackdrop: true, duration: 2000 });
    
	$scope.offset = 0;
	$scope.title = $state.current.data.title;
	$scope.tag = $state.current.data.tag;
    
	var result = Posts.initialLoad($scope.tag);
	result.then( function( val ) {
		$scope.posts = val['result'];
		$scope.offset = typeof val['offset'] == "undefined" ? 9 : val['offset'];
        
		$ionicLoading.hide();
	}, function (error) {
        //ionic.Platform.ready(function () {InternetCheck.check(true);});
        console.log("Did not get any magazine pages!");
        $ionicLoading.hide();
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
		var result = Posts.getNextPost($scope.offset, $scope.tag);
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

.controller('PostListCtrl', function($scope, $state, $ionicLoading, Posts) {
	$ionicLoading.show();
	$scope.channel = $state.current.data.channel;
	$scope.title = $state.current.data.title;
	$scope.tag = $state.current.data.tag;

	var data = Posts.getAllPosts($scope.tag);
	data.then( function( val ) {
		console.log(val);
		$scope.posts = val;
		$ionicLoading.hide();
	}, function(error) {
        $ionicLoading.show();
    });
})

.controller('PostDetailCtrl', function($scope, $stateParams, $ionicLoading, Posts, Ads) {
	$ionicLoading.show();
	var result = Posts.getPost($stateParams.id);

	result.then( function( val ) {
		$scope.post = val;
		$ionicLoading.hide();
	}, function(error) {
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

.controller('StoryListCtrl', function($scope, $state, $ionicModal, $ionicActionSheet, $q, Posts, Ads) {
	$scope.posts = new Array();
	$scope.title = $state.current.data.title;
	$scope.offset = 0;
	$scope.tag = $state.current.data.tag;
    $scope.more = true;

	var adfrequency = $state.current.data.adfreq;

	$scope.valid = function(input) {
		return !(input == "" || typeof input == undefined || typeof input == null);
	}

	// Begin Ad code
	$scope.isAd = function(obj) {
		return (typeof obj.ad_type == "undefined") ? "post" : "ad";
	}

	$scope.getAdClass = function(obj) {
		if( typeof obj.ad_type == "undefined" )
			return;
		return {
			"background-color": obj.banner_bg_color,
			"color": obj.banner_text_color
		};
	}

	$scope.getAdString = function(string, line) {
		switch(line) {
			case "1":
				return string.substring(0, string.indexOf('\r'));
				break;
			case "2":
				return string.substring(string.indexOf('\r'), string.length);
				break;
		}
	}

	$ionicModal.fromTemplateUrl('templates/ad-modal.html', {
		scope: $scope
	}).then( function( modal ) {
		$scope.modal = modal;
	});

    $scope.$on('$destroy', function() {
        $scope.modal.remove();
        $scope.hours.remove();
    });
    
    $scope.displayActionSheet = function() {
    	var buttonArray = new Array();
    	if( $scope.valid( $scope.posts[$scope.adIndex].data.phone ))
    		buttonArray.push( {text: 'Phone: ' + $scope.posts[$scope.adIndex].data.phone} );
    	if( $scope.valid( $scope.posts[$scope.adIndex].data.email ))
    		buttonArray.push( {text: 'Email: ' + $scope.posts[$scope.adIndex].data.email} );
    	if( $scope.valid( $scope.posts[$scope.adIndex].data.website ))
    		buttonArray.push( {text: $scope.posts[$scope.adIndex].data.website} );   	
    	
    	var hideSheet = $ionicActionSheet.show({
    		buttons: buttonArray,
    		cancelText: 'Cancel',
    		titleText: 'Contact',
    		cancel: function() {
    			// do nothing
    		},
    		buttonClicked: function(index) {
    			switch(index) {
    				case 0: 
    					window.open("tel:" + $scope.posts[$scope.adIndex].data.phone);
    					break;
    				case 1:
    					window.open("mailto:" + $scope.posts[$scope.adIndex].data.email);
    					break;
    			}
    		}
    	});
    }

	$scope.urlRoute = function(postid, type, index) {
		switch($scope.isAd(type)) {
			case "post":
				$state.go('app.list-detail', {id: postid});
				break;

			case "ad":
				$scope.adIndex = index;
				$scope.modal.show();
				break;
		}
	}

	// End Ad code

	$scope.formatDate = function( date ) {
		return new Date(date).toLocaleDateString();
	}

	$scope.loadMore = function() {
		console.log($scope.posts.length);
		if( $scope.posts.length == 0 )
		{
			var postArray = new Array();
			postArray.push(Posts.initialLoad($scope.tag));

			for( var i = 0; i < 10; i += Math.floor(1/adfrequency))
			{
				postArray.push(Ads.getRandomAd());
			}

			$q.all(postArray).then( function( val ) {
				// This for loop is the proudest moment of my entire coding career :P
				for( var j = Math.floor(1/adfrequency) - 1, k = 1; j < val[0].length; j += Math.floor(1/adfrequency), k++ )
				{
					val[0].splice(j, 0, val[k]);
				}
				$scope.posts = val[0];

				$scope.offset = typeof val['offset'] == "undefined" ? 9 : val['offset'];
				$scope.$broadcast('scroll.infiniteScrollComplete');
			});
		}
		else
		{
			var otherPostArray = new Array();
			otherPostArray.push(Posts.getNextPost($scope.offset, $scope.tag));
			for( var i = 0; i < 10; i += Math.floor(1/adfrequency))
			{
				otherPostArray.push(Ads.getRandomAd());
			}

			$q.all(otherPostArray).then( function( val ) {
                if(val[0].length == 0)
                {
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    $scope.more = false;
                    return;
                }
				$scope.offset += 10;

				for( var j = Math.floor(1/adfrequency) - 1, k = 1; j < val[0].length; j += Math.floor(1/adfrequency), k++ )
				{
					val[0].splice(j, 0, val[k]);
				}
				var data = val[0];

				for( var i = 0; i < data.length; i++ )
				{
					$scope.posts.push(data[i]);
				}

				$scope.$broadcast('scroll.infiniteScrollComplete');
			});	
		}
	}

	$scope.doRefresh = function() {
		var postArray = new Array();
		postArray.push( Posts.refreshPosts($scope.offset, $scope.tag));

		for( var i = 0; i < $scope.offset + 10; i += Math.floor(1/adfrequency))
		{
			postArray.push(Ads.getRandomAd());
		}

		$q.all(postArray).then( function( val ) {
			// This for loop is the proudest moment of my entire coding career :P
			for( var j = Math.floor(1/adfrequency) - 1, k = 1; j < val[0].length; j += Math.floor(1/adfrequency), k++ )
			{
				val[0].splice(j, 0, val[k]);
			}
			$scope.posts = val[0];

			$scope.$broadcast('scroll.refreshComplete');
		});
	}

	$scope.showLoader = function() {
		if( $scope.offset == 0 )
			return true;
		var potential = Posts.lastPost($scope.offset);
		potential.then( function( val ) {
			return val;
		});
	}
})

.controller('WallCtrl', function($scope, $ionicLoading, $cordovaInAppBrowser, $ionicPlatform, Cards) {
	$ionicLoading.show();
	$scope.offset = 0;

	var rss = Cards.getRSS($scope.offset);
	rss.then( function( val ) {
		$scope.rssCards = val.reverse();
		$scope.offset += 10;
		$ionicLoading.hide();
	}, function (error) {
        //ionic.Platform.ready(function () {InternetCheck.check(true);});
        $ionicLoading.hide();
    });

	$scope.formatDate = function( date ) {
		return new Date(date).toLocaleDateString();
	}

	$scope.loadMore = function() {
		$ionicLoading.show();
		var moreRSS = Cards.getRSS($scope.offset);
		moreRSS.then( function( val ) {
			$scope.rssCards = val.reverse();
			$scope.offset += 10;
			$ionicLoading.hide();
		}, function (error) {
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