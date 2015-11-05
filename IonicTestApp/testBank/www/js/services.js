angular.module('starter.services', [])	

.factory('Posts', function($http, $q) {
	var req = {
		method: 'GET',
		url: 'https://www.localresearch.com/api/posts/ucla-test-bank/',
		headers: {
			'Content-Type': undefined
		},
		timeout: 15*1000,
	}

	return {
		all: function() {
			var deferred = $q.defer();
			$http(req).success( function( data, status, headers, config ) {
				var posts = data;
				deferred.resolve({
					result: posts,
				});
			})
			.error( function( data, status, headers, config ) {
				deferred.reject();
			});
			return deferred.promise;
		},
		getPost: function(postID) {
			var deferred = $q.defer();
			$http(req).success( function( data, status, headers, config ) {
				var posts = data;
				for( var i = 0; i < posts.length; i++ )
				{
					if( posts[i]['id'] == postID )
					{
						deferred.resolve({
							result: posts[i],
						});
						break;
					}
				}				
			})
			.error( function( data, status, headers, config ) {
				deferred.reject();
			});
			return deferred.promise;
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
})

.factory('Highlights', function($http, $q) {
	var req = {
		method: 'GET',
		url: 'https://www.localresearch.com/api/profile/ucla-test-bank/',
		headers: {
			'Content-Type': undefined
		},
		timeout: 15*1000,
	}

	return {
		all: function() {
			var deferred = $q.defer();
			$http(req).success( function( data, status, headers, config ) {
				var highlights = data['sections'][0]['highlights'];
				window.localStorage.setItem("profile", JSON.stringify(data['sections'][0]['highlights']));
				deferred.resolve({
					result: highlights,
				});
			})
			.error( function( data, status, headers, config ) {
				if( window.localStorage.getItem("profile") == undefined )
					deferred.reject();
				else 
				{
					deferred.resolve({
						result: JSON.parse(window.localStorage.getItem("profile")),
					});
				}
			});
			return deferred.promise;
		},
		getHighlight: function(highlightID) {
			return window.localStorage.getItem("profile")[highlightID];
		},
		getEntities: function(highlightID) {
			return window.localStorage.getItem("profile")[highlightID]['entities'];		
		},
		getTitle: function(highlightID) {
			return {title: window.localStorage.getItem("profile")[highlightID]['name']};
		}
	}
});