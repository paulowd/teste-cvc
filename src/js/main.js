angular.module('testecvc', ['carrosDirectives','ngAnimate', 'ngResource', 'carrosServices'])
	.filter('startFrom', function() {
		return function(input, start) {
				start = +start; //parse to int
				return input.slice(start);
		}
	})
	.filter('rangePagination', function() {
		return function(input, total) {
			total = parseInt(total);
	
			for (var i=1; i<=total; i++) {
				input.push(i);
			}
	
			return input;
		};
	});