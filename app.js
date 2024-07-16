const ENDPOINT_URL = 'http://localhost:8080';


var app = angular.module('myApp', ['ngCookies', 'ngRoute']);
app.config([
	'$routeProvider',
	function ($routeProvider) {
		$routeProvider
			.when('/list', {
				templateUrl: 'list.html',
				controller: 'myAppCtrl',
			})
			.when('/task/:id', {
				templateUrl: 'detail.html',
				controller: 'detailCtrl',
			})
			.otherwise({
				// templateUrl: 'index.html',
				redirectTo: '/list',
				// controller: 'todoController',
			});
	}
]);

app.config([
	'$locationProvider',
	function ($locationProvider) {
		$locationProvider.hashPrefix('');
	}
])

app.controller('myAppCtrl', function ($scope, $http, $cookies) {
	if ($cookies.get('session-token') == null) {
		alert('session got expired time, please log in to continue.');
		location.href = "/login.html";
	}
	$scope.user = JSON.parse($cookies.get('session-token'));
	console.log($scope.user);
	console.log($http);

	if ($scope.user.email == null || $scope.user.email == '' || $scope.user.expired_at == null || $scope.user.expired_at == '') {
		alert('session got expired time, please log in to continue.');
		location.href = "/login.html";
	}

	$scope.tasks = [];
	// $scope.tasks = [
	// 	{
	// 		'id': 1,
	// 		'title': 'ng',
	// 		'is_done': true
	// 	},
	// 	{
	// 		'id': 2,
	// 		'title': 'ng',
	// 		'is_done': false
	// 	}
	// ]

	$scope.task = {}

	$scope.submitTask = function () {
		if ($scope.task.title == null || $scope.task.title == '') {
			alert('Input your task please.')
			return;
		}

		var config = {
			headers: {
				'session-id': $cookies.get('session-token')
			}
		};

		$http
			.post(ENDPOINT_URL + '/api/task/create', $scope.task, config)
			.then(
				function (response) {
					// Success callback
					console.log(response.data);

					$scope.loadMyTasks();
					$scope.task = {}
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

					location.href = '/index.html';
					// getList();
				},
				function (error) {
					// Error callback
					$scope.responseMessage = 'Error: ' + error.data.message;
					console.error(error);
				}
			);
	}

	$scope.deleteTask = function ($taskId) {
		alert($taskId)

		var config = {
			headers: {
				'session-id': $cookies.get('session-token')
			}
		};

		var body = {
			'task_id': $taskId
		}

		$http
			.post(ENDPOINT_URL + '/api/task/delete', body, config)
			.then(
				function (response) {
					// Success callback
					console.log(response.data);

					$scope.loadMyTasks();
					// getList();
				},
				function (error) {
					// Error callback
					$scope.responseMessage = 'Error: ' + error.data.message;
					console.error(error);
				}
			);
	}

	$scope.logout = function () {
		$cookies.remove("session-token");

		location.href = "/login.html";
	}

	$scope.loadMyTasks = function () {
		var config = {
			headers: {
				'session-id': $cookies.get('session-token')
			}
		};

		$http
			.get(ENDPOINT_URL + '/api/task/list', config)
			.then(
				function (response) {
					console.log(response.data);
					$scope.tasks = response.data.data;
				},
				function (error) {
					// Error callback
					$scope.responseMessage = 'Error: ' + error.data.message;
					console.error(error);
				}
			);
	}
	$scope.loadMyTasks();
});

app.controller('detailCtrl', function ($scope, $http, $cookies, $routeParams) {
	// $scope.GetTaskById =  function() {

	// }

	console.log($routeParams.id);
	
});
