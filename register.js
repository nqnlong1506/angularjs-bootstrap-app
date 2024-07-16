const ENDPOINT_URL = 'http://localhost:8080';

var register = angular.module('registerApp', []);
register.controller('registerCtrl', function ($scope, $http) {
	$scope.register = function () {
		console.log($scope.user);

		$http
			.post(ENDPOINT_URL + '/api/user/register', $scope.user)
			.then(
				function (response) {
					// Success callback
					$scope.responseMessage = 'User created successfully.';
					console.log(response.data);
					alert('User Created Successfully.')

					location.href = '/login.html';
					// getList();
				},
				function (error) {
					// Error callback
					$scope.responseMessage = 'Error: ' + error.data.message;
					console.error(error);
				}
			);
	}


});