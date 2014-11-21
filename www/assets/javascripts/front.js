angular.module('generosity', ['ngRoute', 'templates'])
	.config(['$routeProvider', '$locationProvider',
	  	function($routeProvider, $locationProvider) {
	    	$routeProvider.
	      		when('/', {
	      			templateUrl: "index.html"
	      		}).
	      		when('/profile/:id', {
	        		templateUrl: "profile.html",
	        		controller: 'UsersController as profiledUser'
	      		}).
	      		when('/gift/:id', {
	        		templateUrl: "gift.html",
	        		controller: 'GiftsController as profiledGift'
	      		}).
	      		when('/challenge', {
	      			templateUrl: "challenge.html"
	      		}).
	      		when('/map', {
	      			redirectTo: function() {
        				window.location = "/tracker";
    					}
	      		}).	      		
	      		when('/shop', {
	      			templateUrl: "shop.html"
	      		}).
	      		when('/users-form', {
	        		templateUrl: "users-form.html",
	        		controller: 'UsersController as newUser'
	      		}).
	      		when('/login-form', {
	        		templateUrl: "login-form.html",
	        		controller: 'UsersController as loginUser'
	      		}).
	      		when('/gifts-form', {
	        		templateUrl: "gift-form.html",
	        		controller: 'GiftsController as newGift'
	      		}).
	      		when('/about', {
	      			templateUrl: "about.html"
	      		}).
	      		otherwise({
	        		redirectTo: '/'
	      		});
	  }])

	.controller('UsersController', ['$scope', '$http', '$rootScope', '$location', '$routeParams', function($scope, $http, $rootScope, $location, $routeParams) {
		var self = this;

		self.id;
		self.username;
		self.realName;
		self.password;
		self.availableHours; //How should this be styled?
		self.currentCity;
		self.currentLocation;
		self.recipient; //Should probably be renamed
		self.description;
		self.reputation;
		self.profileUrl;

		self.errCode = 0;

		self.getUserFromUrlParams = function() {
			self.id = $routeParams.id;
			// console.log(self.id);
			self.getUserById(self.id);
		}

		self.getUserById = function(targetId) {
			// console.log(targetId);
			if(targetId == 0) { //Use a user spoof
				self.createDummyUser();
				return;
			}
			$http.post('users/search', {id: targetId}).
				success(function(data, status, headers, config) {
				// this callback will be called asynchronously
				// when the response is available
					// self.errCode = data.errCode;
					var usersList = data["users"];
					console.log(usersList);
					if(usersList.length != 1) {
						// alert("Error: User not found.");
						console.log("Error: User not found.");
						$location.path('/');
						return;
					}
					var foundUser = usersList[0];
					console.log(foundUser["username"]);
					self.username = foundUser["username"];
					self.realName = foundUser["real_name"];
					self.availableHours = foundUser["available_hours"];
					self.currentCity = foundUser["current_city"];
					self.currentLocation = foundUser["current_location"];
					self.reputation = foundUser["score"];
					// self.description = foundUser["description"];
					self.profileUrl = foundUser["profile_url"];
				}).
				error(function(data, status, headers, config) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
					self.errCode = -99;
					// alert("Error.");
					console.log("Error.");
				}).
				then(function(data, status, headers, config) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
					// alert("Done.");
					console.log("Done.");
					return;
				});
		}

		self.addUser = function() {
			// alert("YO DAWG"); //Only called once even when things go awry
			$http.post('users/add', {username: self.username, password: self.password, real_name: self.realName, 
				available_hours: self.availableHours, current_city: self.currentCity, current_location: self.currentLocation, 
				profile_url: self.profileUrl}).
				success(function(data, status, headers, config) {
				// this callback will be called asynchronously
				// when the response is available
					self.errCode = data.errCode;
					if(self.errCode == -2) {
						// alert("Error: This username already exists.");
						console.log("Error: This username already exists.");
					}
					else if(self.errCode == -3) {
						// alert("Error: The username is empty, too long, or has invalid characters.");
						console.log("Error: The username is empty, too long, or has invalid characters.");
					}
					else if(self.errCode == -4) {
						// alert("Error: The password is empty, too long, or has invalid characters.");
						console.log("Error: The password is empty, too long, or has invalid characters.");
					}
					else if(self.errCode == -6) {
						// alert("Error: The real name is empty, too long, or has invalid characters.");
						console.log("Error: The real name is empty, too long, or has invalid characters.");
					}
					else {
						// alert("User created.");
						console.log("User created.");						
						$location.path('/profile');
					}
					console.log(self.errCode);
				}).
				error(function(data, status, headers, config) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
					self.errCode = -99;
					// alert("Error.");
					console.log("Error.");
				}).
				then(function(data, status, headers, config) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
					// alert("Done.");
					console.log("Done.");
					return;
				});
		}

		self.createDummyUser = function() {
			self.username = "LordChristopher";
			self.realName = "Lord Christopher";
			self.password = "Team 61C";
			self.availableHours = "6 to 11 pm";
			self.currentCity = "Berkeley";
			self.currentLocation = "Nowhere";
			self.recipient = "He whose name shall not be spoken";
			self.reputation = 13;
			self.description = "Paul is the biggest troll.";
			self.profileUrl = "http://static.tumblr.com/isuwdsr/EBVlzsy8r/chris_redfield_avatar_by_ryann1220-d36hj2c.jpg";
		};

		self.makeIter = function(l) {
			var f = [];
			var i;
			for(i = 0; i < l; i++) {
				f[i] = i;
			}
			self.iter = f;
		};

		self.makeIter(5);

		self.login = function(name, pw) {
			$http.post('login', {username: name, password: pw}).
				success(function(data, status, headers, config) {
				// this callback will be called asynchronously
				// when the response is available
					// self.errCode = data.errCode;
					self.errCode = data.errCode;
					if(self.errCode == -1) {
						alert("Login failed.");
						console.log("Login failed.");
					}
					else {
						alert("Login succeeded.");
						console.log("Login succeeded.");
						self.password = "";
					}
				}).
				error(function(data, status, headers, config) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
					self.errCode = -99;
					alert("Error.");
					console.log("Error.");
				}).
				then(function(data, status, headers, config) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
					// alert("Done.");
					console.log("Done.");
					return;
				});
		};

		// self.logout = function() {

		// };
	}])

	.controller('GiftsController', ['$scope', '$http', '$rootScope', '$routeParams', function($scope, $http, $rootScope, $routeParams) {
		var self = this;

		self.name;
		self.giver;
		self.recipient;
		self.description;
		self.rating;
		self.imageUrl;

		self.addGift = function() {
			var errCode;
			$http.post('gifts/create', {name: self.name, url: self.url}).
				success(function(data, status, headers, config) {
				// this callback will be called asynchronously
				// when the response is available
					var errCode = data.errCode;
					/*We need actual error codes for this.*/
					if(errCode == -1) {
						alert("Error: Invalid gift.");
					}
					else {
						alert("Gift created.");						
					}
					console.log(errCode);
					// $rootScope.errCode = data.errCode;
				}).
				error(function(data, status, headers, config) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
					alert("Error.");
				});
		};

		self.getGiftFromUrlParams = function() {
			self.id = $routeParams.id;
			// console.log(self.id);
			self.getGiftById(self.id);
		}

		self.getGiftById = function(targetId) {
			// console.log(targetId);
			if(targetId == 0) { //Use a user spoof
				self.createDummyGift();
				return;
			}
			// $http.post('users/search', {id: targetId}).
			// 	success(function(data, status, headers, config) {
			// 	// this callback will be called asynchronously
			// 	// when the response is available
			// 		// self.errCode = data.errCode;
			// 		var usersList = data["users"];
			// 		console.log(usersList);
			// 		if(usersList.length != 1) {
			// 			// alert("Error: User not found.");
			// 			console.log("Error: User not found.");
			// 			$location.path('/');
			// 			return;
			// 		}
			// 		var foundUser = usersList[0];
			// 		console.log(foundUser["username"]);
			// 		self.username = foundUser["username"];
			// 		self.realName = foundUser["real_name"];
			// 		self.availableHours = foundUser["available_hours"];
			// 		self.currentCity = foundUser["current_city"];
			// 		self.currentLocation = foundUser["current_location"];
			// 		self.reputation = foundUser["score"];
			// 		// self.description = foundUser["description"];
			// 		self.profileUrl = foundUser["profile_url"];
			// 	}).
			// 	error(function(data, status, headers, config) {
			// 	// called asynchronously if an error occurs
			// 	// or server returns response with an error status.
			// 		self.errCode = -99;
			// 		// alert("Error.");
			// 		console.log("Error.");
			// 	}).
			// 	then(function(data, status, headers, config) {
			// 	// called asynchronously if an error occurs
			// 	// or server returns response with an error status.
			// 		// alert("Done.");
			// 		console.log("Done.");
			// 		return;
			// 	});
		}

		self.createDummyGift = function() {
			self.name = "Shin Megami Tensei x Fire Emblem";
			self.giver = "Atlus and Intelligent Systems";
			self.recipient = "LordChristopher";
			self.description = "Such hype. Must play. Wow.";
			self.rating = 5.0;
			self.imageUrl="http://i1290.photobucket.com/albums/b531/orangepikmin333/shittypaintjob_zpscbf470a8.jpg";
		};
	}])
	
	.directive('navbar', function() {
		return {
			restrict: 'E',
			templateUrl: "navbar.html"
		};
	})

	.directive('footbar', function() {
		return {
			restrict: 'E',
			templateUrl: "footbar.html"
		};
	})

	.directive('usersTests', function() {
		return {
			restrict: 'E',
			scope: {

			},
			templateUrl: "users-tests.html"
		};
	})

	.directive('giftsTests', function() {
		return {
			restrict: 'E',
			scope: {

			},
			templateUrl: "gifts-tests.html"
		};
	})
	
	.directive('testStatus', function() {
		return {
			restrict: 'C',
			scope: {
			  message: '@'
			},
			link: function(scope, element, attrs) { 
				if(scope.message.search("PASS") > 0) {
					element.css("color", "green");
				}
				else if(scope.message.search("FAIL") > 0) {
					element.css("color", "red");
				}
				else {
					element.css("color", "blue");
				}
			}
		};
	})

	