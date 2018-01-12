angular.module('carrosServices', ['ngResource'])
	.factory('carrosResource', function($resource) {

		return $resource('https://5a550e3ba3ba810012c00956.mockapi.io/api/v1/carros', null, {
			'query' : { 
				method: 'GET',
				isArray:true
			}
		});
	})
	.factory('estadosResource', function($resource) {

		return $resource('https://5a550e3ba3ba810012c00956.mockapi.io/api/v1/estados', null, {
			'query' : { 
				method: 'GET',
				isArray:true
			}
		});
	});