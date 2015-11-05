angular.module('starter.services', [])	

.factory('Posts', function($http, $q, $cordovaToast, $cordovaNetwork, $ionicPlatform) {
	var slug = "bruin-football-by-daily-bruin-sports"; // Change this

	var req = {
		method: 'GET',
		url: 'https://www.localresearch.com/api/posts/' + slug + '/?limit=10&offset=0',
		headers: {
			'Content-Type': undefined
		},
		timeout: 15*1000,
	}

	var backup = {
		method: 'GET',
		url: '/data/posts.json?limit=10&offset=0',
		headers: {
			'Content-Type': undefined
		},
		timeout: 15*1000,
	}
    $ionicPlatform.ready(function() {console.log("In Posts");});
	return {
		initialLoad: function() {
			var deferred = $q.defer(); 
                
            /*
			if( window.localStorage.getItem(slug + "posts") != "" && window.localStorage.getItem(slug + "posts") != null) {
				var cached = JSON.parse(window.localStorage.getItem(slug + "posts"));
				deferred.resolve({ result: cached });
				return deferred.promise;
			} */
			$http(req).success( function( data, status, headers, config ) {
				deferred.resolve({
					result: data,
				});
			})
			.error( function( data, status, headers, config ) {
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

			var req = {
				method: 'GET',
				url: '/data/detail.json',
				headers: {
					'Content-Type': undefined
				},
				timeout: 15*1000,
			}
			var deferred = $q.defer();
			$http(reqMore).success( function( data, status, headers, config ) {
				deferred.resolve(data);
			});
			return deferred.promise;
		},
		getNextPost: function(nextID) {
			var reqMore = {
				method: 'GET',
				url: 'https://www.localresearch.com/api/posts/' + slug + '/?limit=10&offset=' + nextID,
				headers: {
					'Content-Type': undefined
				},
				timeout: 15*1000,
			}

			var req = {
				method: 'GET',
				url: '/data/posts.json?limit=10&offset=' + nextID,
				headers: {
					'Content-Type': undefined
				},
				timeout: 15*1000,
			}


			var deferred = $q.defer();
			$http(reqMore).success( function( data, status, headers, config ) {
				deferred.resolve({
					result: data,
				});
			});
			return deferred.promise;
		},
		refreshPosts: function(numPosts) {
			var reqMore = {
				method: 'GET',
				url: 'https://www.localresearch.com/api/posts/' + slug + '/?limit=' + numPosts + '&offset=0',
				headers: {
					'Content-Type': undefined
				},
				timeout: 15*1000,
			}

			var req = {
				method: 'GET',
				url: '/data/posts.json?limit=' + numPosts + '&offset=0',
				headers: {
					'Content-Type': undefined
				},
				timeout: 15*1000,
			}

			var deferred = $q.defer();
			$http(reqMore).success( function( data, status, headers, config ) {
				deferred.resolve( data );
			});
			return deferred.promise;
		},
		lastPost: function(id) {
			var reqMore = {
				method: 'GET',
				url: 'https://www.localresearch.com/api/posts/' + slug + '/?limit=10&offset=' + id,
				headers: {
					'Content-Type': undefined
				},
				timeout: 15*1000,
			}

			var deferred = $q.defer();
			$http(reqMore).success( function( data, status, headers, config ) {
				if( data.length == 0 )
					deferred.resolve(true);
				else
					deferred.resolve(false);
			});
			return deferred.promise;
		}
	}
})

.factory('Businesses', function($http, $q) {
	return {
		getBusiness: function(slug) {
			var deferred = $q.defer();

			$http.get("https://www.localresearch.com/api/business/" + slug + "/")
			.success( function( data, status, headers, config ) {
				window.localStorage.setItem("tempBusinessProf", JSON.stringify(data));
				deferred.resolve({
					result: data,
				})
			})
			.error( function( data, status, headers, config ) {
				if( window.localStorage.getItem("tempBusinessProf") == undefined )
					deferred.reject();
				else if( JSON.parse( window.localStorage.getItem("tempBusinessProf"))['entity']['slug'] != slug )
					deferred.reject();
				else
					deferred.resolve({
						result: data,
					})
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

.factory('Entities', function($http, $q) {
	var slug = "bruin-guide-to-food"; // Change this

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
				$http(req).success( function( data, status, headers, config ) {
					for( var i = 0, j = 0; i < data['sections'].length; i++ )
					{
						if( data['sections'][i]['section_type'] == "entities" )
							if( j == index ) {
								window.localStorage.setItem(slug + index + "ent", data['sections'][i]);
								deferred.resolve(data['sections'][i]);
							}
							else
								j++;
					}
				});
			}
			else
				deferred.resolve(window.localStorage.getItem(slug + index + "ent"));
			
			return deferred.promise;
		},
		getEntity: function(entSlug, index) {
			var data = window.localStorage.getItem(slug + index + "ent");
			for( var i = 0; i < data.length; i++ )
				if( data[i]['slug'] == entSlug )
					return data[i];					
		}
	}
})

.factory('Highlights', function($http, $q) {
	var slug = "bruin-guide-to-food"; // Change this

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
		getEntity: function(entityID, index, slug) {
			var data = this.getHighlight(entityID, index)['entities'];
			for( var i = 0; i < data.length; i++ )
				if( data[i]['slug'] == slug )
					return data[i];					
		},
		getPreviewImage: function(imgSlug) {
			var deferred = $q.defer();

			$http.get("https://www.localresearch.com/api/media/" + imgSlug + "/")
			.success( function( data, status, headers, config ) {
				if( data.length > 0 )
					deferred.resolve({
						result: data[0]['image_thumbnail_url'],
					});
				else
					deferred.reject();
			})
			.error( function( data, status, headers, config ) {
				deferred.reject();
			});
			return deferred.promise;
		}
	}
})

.factory('Calendar', function($http, $q, $cordovaCalendar) {
	var slug = "bruin-guide-to-speakers"; // Change this

	var req = {
		method: 'GET',
		url: 'https://www.localresearch.com/api/events/' + slug + '/',
		headers: {
			'Content-Type': undefined
		},
		timeout: 15*1000,
	}

	return {
		getEventsByTag: function(tag) {

		}
	}
})

.factory('InternetCheck', function($ionicPlatform, $cordovaNetwork, $cordovaToast) {
    return {
        check: function(toast) {
            if($cordovaNetwork.isOffline())
            {
                if(toast)
                    $cordovaToast.showLongBottom("Loading failed! Please check your internet connection.");
                return true;
            }
            return false;
        }
    }
})

.factory('ImageGallery', function($http, $q, $cordovaFileTransfer, $cordovaFile) {
	return {
		loadImages: function(slug) {
			var deferred = $q.defer();
			$http.get("https://www.localresearch.com/api/media/" + slug + "/").success( function( data, status, headers, config ) {
				
                //Make sure you have org.apache.cordova.file and org.apache.cordova.file-transfer installed for this project
				deferred.resolve({
					result: data,
				});
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
			});
		}
	}
});