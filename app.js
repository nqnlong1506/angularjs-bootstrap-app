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
					if (error.status == 511) {
						alert('session is expired, login to continue.');
						$cookies.remove('session-token');
						location.href = '/login.html';
					}
				}
			);
	}

	$scope.deleteTask = function ($taskId) {
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
					if (error.status == 511) {
						alert('session is expired, login to continue.');
						$cookies.remove('session-token');
						location.href = '/login.html';
					}
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
					if (error.status == 511) {
						alert('session is expired, login to continue.');
						$cookies.remove('session-token');
						location.href = '/login.html';
					}
				}
			);
	}
	$scope.loadMyTasks();
});

app.controller('detailCtrl', function ($scope, $http, $cookies, $routeParams) {
	console.log($routeParams.id);
	// $scope.GetTaskById =  function() {

	// }

	$scope.task = {
		'id': $routeParams.id,
		'title': 'sample title',
		'is_done': 1,
		'created_at': '2024-07-16 00:00:00'
	}

	// $scope.complete = $scope.task.is_done == 1 ? true : false;

	$scope.updateTask = function () {
		if ($scope.task.title == '') {
			alert('Title REQUIRED.');

			return;
		}

		var config = {
			headers: {
				'session-id': $cookies.get('session-token')
			}
		};

		var body = {
			'id': $scope.task.id,
			'title': $scope.task.title,
			'isDone': $scope.complete ? 1 : 0
		}

		console.log(body);

		$http
			.post(ENDPOINT_URL + '/api/task/update', body, config)
			.then(
				function (response) {
					// Success callback
					console.log(response.data);
					// getList();
				},
				function (error) {
					// Error callback
					$scope.responseMessage = 'Error: ' + error.data.message;
					console.error(error);
					if (error.status == 511) {
						alert('session is expired, login to continue.');
						$cookies.remove('session-token');
						location.href = '/login.html';
					}
				}
			);
	}

	$scope.getTaskById = function ($taskId) {
		var config = {
			headers: {
				'session-id': $cookies.get('session-token')
			}
		};

		$http
			.get(ENDPOINT_URL + '/api/task/task/' + $taskId, config)
			.then(
				function (response) {
					console.log(response);
					$scope.task = response.data.data;
					$scope.complete = $scope.task.is_done == 1 ? true : false;
				},
				function (error) {
					// Error callback
					$scope.responseMessage = 'Error: ' + error.data.message;
					console.error(error);
					if (error.status == 511) {
						alert('session is expired, login to continue.');
						$cookies.remove('session-token');
						location.href = '/login.html';
					}
				}
			);
	}
	$scope.getTaskById($routeParams.id);

});
