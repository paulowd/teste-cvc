angular.module('testecvc').controller('CarrosController', ['$scope', '$anchorScroll', 'orderByFilter', 'carrosResource', function($scope, $anchorScroll, orderBy, carrosResource) {
	
	$scope.carros = [];
	$scope.filtro = '';
	$scope.mensagem = '';
	$scope.ordem_param = 'none';
	$scope.moeda = 'real';

	$scope.moedas = {
		real: {
			nome: 'Real',
			simbolo: 'R$',
			cotacao: 1
		},
		dolar: {
			nome: 'Dolar',
			simbolo: 'U$',
			cotacao: 2
		},
		euro: {
			nome: 'Euro',
			simbolo: '€',
			cotacao: 3
		},
	}

	$scope.pagination = {
		itemsPerPage: '2',
		page: 1,
		totalItems: 0,
		totalPages: 1
	}

	$scope.alterarPagina = function(i){
		if(i<1)
			i=1;
		
		if(i>$scope.pagination.totalPages)
			i=$scope.pagination.totalPages;
		$scope.pagination.page = i;
		$anchorScroll('resultados-busca');
	}

	$scope.atualizarPagination = function(){
		$scope.pagination.totalItems = $scope.carros.length;
		$scope.pagination.totalPages = Math.ceil($scope.carros.length / $scope.pagination.itemsPerPage);
	}

	carrosResource.query(function(carros) {
		$scope.carros = carros;
		$scope.atualizarPagination();
	}, function(erro) {
		console.log(erro);
	});

	$scope.toggleDetalhe = function(carro){
		carro.showDetalhe = ! carro.showDetalhe;
	}

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


	var numberToMoney = function(numero) {
    var numero = numero.toFixed(2).split('.');
    numero[0] = numero[0].split(/(?=(?:...)*$)/).join('.');
    return numero.join(',');
	}

	$scope.formatarValor = function(valor) {
		return numberToMoney( valor * $scope.moedas[$scope.moeda].cotacao );
	}

}]);