angular.module('testecvc').controller('CarrosController', ['$scope', 'orderByFilter', 'carrosResource', function($scope, orderBy, carrosResource) {
	
	$scope.carros = [];
	$scope.filtro = '';
	$scope.mensagem = '';
	$scope.ordem_param = 'none';


	carrosResource.query(function(carros) {
		console.log('carros', carros);
		$scope.carros = carros;
	}, function(erro) {
		console.log(erro);
	});

	$scope.reordenar = function(){
		switch($scope.ordem_param){
			case 'low_price':
				$scope.carros = orderBy($scope.carros, 'valor', true);
				break;
			case 'high_price':
				$scope.carros = orderBy($scope.carros, 'valor', false);
				break;
			case 'high_locate':
				$scope.carros = orderBy($scope.carros, 'locacoes', true);
				break;
			default:
				$scope.carros = orderBy($scope.carros, 'id', false);
				break;
		}
	}

	$scope.remover = function(foto) {

		recursoFoto.delete({fotoId: foto._id}, function() {
			var indiceDaFoto = $scope.fotos.indexOf(foto);
			$scope.fotos.splice(indiceDaFoto, 1);
			$scope.mensagem = 'Foto ' + foto.titulo + ' removida com sucesso!';
		}, function(erro) {
			console.log(erro);
			$scope.mensagem = 'Não foi possível apagar a foto ' + foto.titulo;
		});
	};

}]);