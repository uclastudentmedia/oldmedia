angular.module('starter.services', [])	

.factory('InternetCheck', function($q, $state, $ionicPlatform, $cordovaNetwork, $cordovaToast) {
    var reload = function() {
        var cur_state = $state.current.url;
        var url = "app.home";
        if(cur_state.indexOf("dark") != -1)
            url = "app.dark";
        else if(cur_state.indexOf("cal") != -1)
            url = "app.cal";
        else if(cur_state.indexOf("list") != -1 || cur_state.indexOf("info") != -1 || cur_state.indexOf("more") != -1)
            url = "app.more";
        $state.transitionTo(url);
        window.location.reload();
    }
    return {
        check: function(toast, message) {
            message = message || "Loading failed! Please check your internet connection.";
            if($cordovaNetwork.isOffline())
            {
                if(toast)
                {
                    $cordovaToast.showLongBottom(message);
                    document.addEventListener("online", reload, false);
                }
                return false;
            }
            return true;
        },
        check_promise: function(toast)  {
            var deferred = $q.defer();
            if($cordovaNetwork.isOffline())
            {
                if(toast)
                {
                    $cordovaToast.showLongBottom("Loading failed! Please check your internet connection.");
                    document.addEventListener("online", reload, false);
                }
                deferred.reject("Not connected to Internet!!!");
            }
            else
                deferred.resolve("Connected to Internet.");
            return deferred.promise
        }
    }
})

.factory('Posts', function($http, $q, $cordovaToast, $cordovaNetwork, $ionicPlatform, $state, InternetCheck) {
	var slug = $state.current.data.profile;

    $ionicPlatform.ready(function() {console.log("In Posts");});
	return {
		initialLoad: function(tag) {
			var req = {
				method: 'GET',
				url: 'https://www.localresearch.com/api/posts/' + slug + '/',
				headers: {
					'Content-Type': undefined
				},
				params: {
					limit: 10,
					offset: 0,
					tags: tag
				},
				timeout: 15*1000,
			}
			var deferred = $q.defer(); 
                
            /*
			if( window.localStorage.getItem(slug + "posts") != "" && window.localStorage.getItem(slug + "posts") != null) {
				var cached = JSON.parse(window.localStorage.getItem(slug + "posts"));
				deferred.resolve({ result: cached });
				return deferred.promise;
			} */
			$http(req).success( function( data, status, headers, config ) {
                //console.log(data);
				deferred.resolve(data);
			})
			.error( function( data, status, headers, config ) {
                ionic.Platform.ready(function () {InternetCheck.check(true);});
				deferred.reject();
			});
			return deferred.promise;
		},
		getAllPosts: function(tag) {
			var reqAll = {
				method: 'GET',
				url: 'https://www.localresearch.com/api/posts/' + slug + '/',
				headers: {
					'Content-Type': undefined
				},
				params: {
					tags: tag
				},
				timeout: 15*1000,
			}
			var deferred = $q.defer();
			$http(reqAll).success( function( data, status, headers, config ) {
				deferred.resolve(data);
			}).error( function( data, status, headers, config ) {
                ionic.Platform.ready(function () {InternetCheck.check(true);});
				deferred.reject();
			});
			return deferred.promise;
		},
		getPost: function(postID) {
			var reqMore = {
				method: 'GET',
				url: 'https://www.localresearch.com/api/posts/' + postID + '/detail',
				headers: {
					'Content-Type': undefined
				},
				timeout: 15*1000,
			}
			var deferred = $q.defer();
			$http(reqMore).success( function( data, status, headers, config ) {
				deferred.resolve(data);
			}).error( function( data, status, headers, config ) {
                ionic.Platform.ready(function () {InternetCheck.check(true);});
				deferred.reject();
			});
			return deferred.promise;
		},
		getNextPost: function(nextID, tag) {
			var reqMore = {
				method: 'GET',
				url: 'https://www.localresearch.com/api/posts/' + slug + '/',
				params: {
					limit: 10,
					offset: nextID,
					tags: tag
				},
				headers: {
					'Content-Type': undefined
				},
				timeout: 15*1000,
			}
			var deferred = $q.defer();
			$http(reqMore).success( function( data, status, headers, config ) {
				deferred.resolve(data);
			}).error( function( data, status, headers, config ) {
                ionic.Platform.ready(function () {InternetCheck.check(true);});
				deferred.reject();
			});
			return deferred.promise;
		},
		refreshPosts: function(numPosts, tag) {
			var reqMore = {
				method: 'GET',
				url: 'https://www.localresearch.com/api/posts/' + slug + '/',
				params: {
					limit: numPosts,
					offset: 0,
					tags: tag
				},
				headers: {
					'Content-Type': undefined
				},
				timeout: 15*1000,
			}
			var deferred = $q.defer();
			$http(reqMore).success( function( data, status, headers, config ) {
				deferred.resolve( data );
			}).error( function( data, status, headers, config ) {
                ionic.Platform.ready(function () {InternetCheck.check(true);});
				deferred.reject();
			});
			return deferred.promise;
		},
		lastPost: function(off) {
			var reqMore = {
				method: 'GET',
				url: 'https://www.localresearch.com/api/posts/' + slug + '/',
				params: {
					limit: 1,
					offset: off
				},
				headers: {
					'Content-Type': undefined
				},
				timeout: 15*1000,
			}
			var deferred = $q.defer();
			$http(reqMore).success( function( data, status, headers, config ) {
				deferred.resolve(data.length > 0);
			}).error( function( data, status, headers, config ) {
                ionic.Platform.ready(function () {InternetCheck.check(true);});
				deferred.resolve(false);
			});
			return deferred.promise;
		}
	}
})

.factory('Businesses', function($http, $q, InternetCheck) {
	return {
		getBusiness: function(slug) {
			var deferred = $q.defer();

			$http.get("https://www.localresearch.com/api/business/" + slug + "/")
			.success( function( data, status, headers, config ) {
				window.localStorage.setItem("tempBusinessProf", JSON.stringify(data));
				deferred.resolve(data);
			})
			.error( function( data, status, headers, config ) {
				if( window.localStorage.getItem("tempBusinessProf") == undefined )
                {
                    ionic.Platform.ready(function () {InternetCheck.check(true);});
					deferred.reject();
                }
				else if( JSON.parse( window.localStorage.getItem("tempBusinessProf"))['entity']['slug'] != slug )
                {
                    ionic.Platform.ready(function () {InternetCheck.check(true);});
					deferred.reject();
                }
				else
					deferred.resolve(data);
			});
			return deferred.promise;
		},
		getBusinessFromCache: function() {
			return JSON.parse(window.localStorage.getItem("tempBusinessProf"));
		}
	}
})

.factory('Cards', function($firebase, $cordovaNetwork) {
	var rss = new Firebase("https://wallsucla.firebaseio.com/sports/football/rss");
	var tweets = new Firebase("https://wallsucla.firebaseio.com/sports/football/rss");
	return {
		getRSS: function( offset ) {
			var sync = $firebase(rss.limitToLast(10 + offset));
			var result = sync.$asArray();
            return result.$loaded();
		}
	}
})

.factory('Home', function($http, $q, $state, InternetCheck) {
	var slug = $state.current.data.profile;

	var req = {
		method: 'GET',
		url: 'https://www.localresearch.com/api/profile/' + slug + '/',
		headers: {
			'Content-Type': undefined
		},
		timeout: 15*1000,
	}

	return {
		getHome: function() {
			var deferred = $q.defer();
			if( window.localStorage.getItem(slug + "home") == undefined )
			{
				$http(req).success( function( data, status, headers, config ) {
					window.localStorage.setItem(slug + "home", JSON.stringify(data));
					deferred.resolve(data);
				}).error( function( data, status, headers, config ) {
                    ionic.Platform.ready(function () {InternetCheck.check(true);});
                    deferred.reject();
                });
			}
			else
				deferred.resolve(JSON.parse(window.localStorage.getItem(slug + "home")));
			
			return deferred.promise;
		}
	}
})

.factory('Entities', function($http, $q, $state, Highlights, InternetCheck) {
	var slug = $state.current.data.profile;
    //console.log(slug);
	var req = {
		method: 'GET',
		url: 'https://www.localresearch.com/api/profile/' + slug + '/',
		headers: {
			'Content-Type': undefined
		},
		timeout: 15*1000,
	}

	return {
		getEntities: function(index) {
			var deferred = $q.defer();
			if( window.localStorage.getItem(slug + index + "ent") == undefined )
			{
                console.log("Gotta get the entity");
				$http(req).success( function( data, status, headers, config ) {
					for( var i = 0, j = 0; i < data['sections'].length; i++ )
					{
						if( data['sections'][i]['section_type'] == "entities" )
							if( j == index ) {
								window.localStorage.setItem(slug + j + "ent", JSON.stringify(data['sections'][i]));
								deferred.resolve(data['sections'][i]);
								break;
							}
							else
								j++;
					}
                    if(i == data['sections'].length)
                        deferred.reject("This failed");
				}).error( function( data, status, headers, config ) {
                    ionic.Platform.ready(function () {InternetCheck.check(true);});
                    deferred.reject();
                });
			}
			else
            {
                console.log("Found entities in storage");
				deferred.resolve(JSON.parse(window.localStorage.getItem(slug + index + "ent")));
            }
			
			return deferred.promise;
		},
		refreshEntities: function(index) {
			var deferred = $q.defer();
			//console.log(index);
			$http(req).success( function( data, status, headers, config ) {
				for( var i = 0, j = 0; i < data['sections'].length; i++ )
				{
					if( data['sections'][i]['section_type'] == "entities" )
						if( j == index ) {
							window.localStorage.setItem(slug + j + "ent", JSON.stringify(data['sections'][i]));
							deferred.resolve(data['sections'][i]);
							break;
						}
						else
							j++;
				}
			})
			.error( function( data, status, headers, config ) {
                    ionic.Platform.ready(function () {InternetCheck.check(true);});
                    deferred.resolve(JSON.parse(window.localStorage.getItem(slug + index + "ent")));
            });
			
			return deferred.promise;
		},
		getEntity: function(entSlug, index) {
			var data = window.localStorage.getItem(slug + index + "ent");
			for( var i = 0; i < data.length; i++ )
				if( data[i]['slug'] == entSlug )
					return data[i];					
		},
		getEntityFromHighlight: function(entityID, index, entSlug) {
			var data = Highlights.getHighlight(entityID, index)['entities'];
			for( var i = 0; i < data.length; i++ )
				if( data[i]['slug'] == entSlug )
					return data[i];					
		}
	}
})

.factory('Highlights', function($http, $q, $state, InternetCheck) {
	var slug = $state.current.data.profile;

	var req = {
		method: 'GET',
		url: 'https://www.localresearch.com/api/profile/' + slug + '/',
		headers: {
			'Content-Type': undefined
		},
		timeout: 15*1000,
	}

	return {
		all: function(index) {
			var deferred = $q.defer();
			if( window.localStorage.getItem(slug + index + "high") == undefined )
			{				
				$http(req).success( function( data, status, headers, config ) {
					var highlights = data['sections'];
					for( var i = 0; i < highlights.length; i++ )
					{
						window.localStorage.setItem(slug + index + "high", JSON.stringify(data['sections'][index]['highlights']));	
					}					
					deferred.resolve({
						result: highlights[index]['highlights'],
					});
				})
				.error( function( data, status, headers, config ) {
                    ionic.Platform.ready(function () {InternetCheck.check(true);});
					deferred.reject();
				});
			}
			else
				deferred.resolve({
					result: JSON.parse(window.localStorage.getItem(slug + index + "high")),
				});

			return deferred.promise;
		},
		refreshAll: function(index) {
			window.localStorage.clear();
			var deferred = $q.defer();
			if( window.localStorage.getItem(slug + index + "high") == undefined )
			{				
				$http(req).success( function( data, status, headers, config ) {
					var highlights = data['sections'];
					for( var i = 0; i < highlights.length; i++ )
					{
						window.localStorage.setItem(slug + index + "high", JSON.stringify(data['sections'][index]['highlights']));	
					}					
					deferred.resolve({
						result: highlights[index]['highlights'],
					});
				})
				.error( function( data, status, headers, config ) {
                    ionic.Platform.ready(function () {InternetCheck.check(true);});
					deferred.reject();
				});
			}
			else
				deferred.resolve({
					result: JSON.parse(window.localStorage.getItem(slug + index + "high")),
				});

			return deferred.promise;
		},
		getHighlight: function(entityID, index) {
			var data = JSON.parse(window.localStorage.getItem(slug + index + "high"));
			for( var i = 0; i < data.length; i++ )
				if( data[i]['id'] == entityID )
					return data[i];
		},
		getPreviewImage: function(imgSlug) {
			var deferred = $q.defer();
			$http.get("https://www.localresearch.com/api/media/" + imgSlug + "/")
			.success( function( data, status, headers, config ) {
				if( data.length > 0 ) {
					deferred.resolve(data[0]);
                }
				else
					deferred.reject();
			})
			.error( function( data, status, headers, config ) {
                ionic.Platform.ready(function () {InternetCheck.check(true);});
				deferred.reject();
			});
			return deferred.promise;
		}
	}
})

.factory('Ads', function($http, $q, $state) {
	var tag = $state.current.data.adTag;

	var req = {
		method: 'GET',
		url: 'https://www.localresearch.com/api/ads/random/',
		headers: {
			'Content-Type': undefined
		},
		params: {
			tags: tag
		},
		timeout: 15*1000,
	}

	var all = {
		method: 'GET',
		url: 'https://www.localresearch.com/api/ads/',
		headers: {
			'Content-Type': undefined
		},
		params: {
			tags: tag
		},
		timeout: 15*1000,
	}

	return {
		getRandomAd: function() {
			var deferred = $q.defer();
			$http(req).success( function( data, status, headers, config ) {
				deferred.resolve(data);
			})
			return deferred.promise;
		},
		getAllAds: function() {
			var deferred = $q.defer();
			$http(all).success( function( data, status, headers, config ) {
				deferred.resolve(data);
			})
			return deferred.promise;
		}
	}
})

.factory('Events', function($http, $q, $state, $cordovaCalendar, InternetCheck) {
	var slug = $state.current.data.profile;

	var req = {
		method: 'GET',
		url: 'https://www.localresearch.com/api/events/' + slug + '/',
		headers: {
			'Content-Type': undefined
		},
		timeout: 15*1000,
	}

	return {
		getEvents: function() {
			var deferred = $q.defer();
			if( window.localStorage.getItem(slug + "events") == undefined )
			{
				$http(req).success( function( data, status, headers, config ) {
					window.localStorage.setItem(slug + "events", JSON.stringify(data));
					deferred.resolve(data);
				}).error( function( data, status, headers, config ) {
                ionic.Platform.ready(function () {InternetCheck.check(true);});
				deferred.reject();
			});
			}
			else
				deferred.resolve(JSON.parse(window.localStorage.getItem(slug + "events")));
			
			return deferred.promise;
		},
		refreshEvents: function() {
			window.localStorage.removeItem(slug + "events");
			var deferred = $q.defer();
			$http(req).success( function( data, status, headers, config ) {
				window.localStorage.setItem(slug + "events", JSON.stringify(data));
				deferred.resolve(data);
			}).error( function( data, status, headers, config ) {
                ionic.Platform.ready(function () {InternetCheck.check(true);});
				deferred.reject();
			});
			return deferred.promise;
		},
		getEventByID: function( id ) {
			var data = JSON.parse(window.localStorage.getItem(slug + "events"));
			for( var i = 0; i < data.length; i++ )
				if( data[i]['id'] == id )
					return data[i];
		}
	}
})


.factory('ImageGallery', function($http, $q, $cordovaFileTransfer, $cordovaFile, InternetCheck) {
	return {
		loadImages: function(slug) {
			var deferred = $q.defer();
			$http.get("https://www.localresearch.com/api/media/" + slug + "/").success( function( data, status, headers, config ) {
				
                //Make sure you have org.apache.cordova.file and org.apache.cordova.file-transfer installed for this project
				deferred.resolve({
					result: data,
				});
			}).error( function( data, status, headers, config ) {
                console.log("Testing");
                ionic.Platform.ready(function () {InternetCheck.check(true);});
				deferred.reject();
			});

			return deferred.promise;
		},
        saveImages: function() {
			$http.get("https://www.localresearch.com/api/media/" + slug + "/").success( function( data, status, headers, config ) {
				
                //Make sure you have org.apache.cordova.file and org.apache.cordova.file-transfer installed for this project
                
				for( var i = 0; i < data.length; i++ )
				{
					var targetPath = cordova.file.dataDirectory + "Documents/" + i + ".jpg";
					$cordovaFileTransfer.download( data[i]['image_url'], targetPath, {}, true)
						.then(function(result) {
                           
						// Success!
						}, function(err) {
                            
						// Error
						}, function (progress) {
							$timeout(function () {
								var downloadProgress = (progress.loaded / progress.total) * 100;
                                })
                            }, false);
				}
			}).error( function( data, status, headers, config ) {
                ionic.Platform.ready(function () {InternetCheck.check(true);});
				deferred.reject();
			});
		}
	}
});