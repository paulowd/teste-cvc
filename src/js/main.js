angular.module('testecvc', ['ngAnimate', 'ngResource', 'ngMaterial', 'carrosServices'])
	.filter('startFrom', function() {
		// Filtro utilizado para gerar botoes de paginação
		return function(input, start) {
				start = +start; 
				return input.slice(start);
		}
	})
	.filter('rangePagination', function() {
		// Filtro utilizado para gerar botoes de paginação
		return function(input, total) {
			total = parseInt(total);
	
			for (var i=1; i<=total; i++) {
				input.push(i);
			}
	
			return input;
		};
	});