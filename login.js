const ENDPOINT_URL = 'http://localhost:8080';

var login = angular.module('loginApp', ['ngCookies']);
login.controller('loginCtrl', function ($scope, $http, $cookies) {
	$scope.user = {
		'email': '',
		'password': ''
	}

	// $cookies.get('session-token') 
	if ($cookies.get('session-token') != null) {
		location.href = "/";
	}

	$scope.login = function () {
		console.log($scope.user.email + ' ' + $scope.user.password + ' ' + ENDPOINT_URL);
		$http
			.post(ENDPOINT_URL + '/api/user/login', $scope.user)
			.then(
				function (response) {
					// Success callback
					$scope.responseMessage = 'User created successfully.';
					console.log(response.data.data.token);
					alert('User Login Successfully.');
					$cookies.put('session-token', response.data.data.token);

					location.href = '/';
					// getList();
				},
				function (error) {
					// Error callback
					$scope.responseMessage = 'Error: ' + error.data.message;
					console.error(error);
					alert('Email or Password incorrectly.');
				}
			);
	}
});