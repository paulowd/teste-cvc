angular.module('testecvc').controller('CarrosController', ['$scope', '$anchorScroll', 'orderByFilter', 'carrosResource', 'estadosResource', function($scope, $anchorScroll, orderBy, carrosResource, estadosResource) {
	
	$scope.carros = [];
	$scope.estados = [];
	$scope.filtro = '';
	$scope.mensagem = '';
	$scope.ordem_param = 'none';
	$scope.moeda = 'real';
	$scope.diasLocacao = 1;
	$scope.devolverOutroLocal = false;

	var data_atual = new Date();
	$scope.dataLocacao = data_atual;
	$scope.minDataLocacao = data_atual;
	$scope.maxDataLocacao = moment(data_atual, "DD/MM/YYYY").add(3, 'months').toDate();;

	$scope.calcularLimitesDataDevolucao = function(){
		var dataLocacao = $scope.dataLocacao;
		$scope.minDataDevolucao = moment(dataLocacao, "DD/MM/YYYY").add(1, 'days').toDate();
		$scope.dataDevolucao = moment(dataLocacao, "DD/MM/YYYY").add(2, 'days').toDate();
		$scope.maxDataDevolucao = moment(dataLocacao, "DD/MM/YYYY").add(30, 'days').toDate();
	}

	$scope.calcularDiasLocacao = function() {
		$scope.diasLocacao = moment($scope.dataDevolucao).diff($scope.dataLocacao, 'days');
	}

	$scope.calcularLimitesDataDevolucao();
	$scope.calcularDiasLocacao();


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
		itemsPerPage: '10',
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

	estadosResource.query(function(estados) {
		$scope.estados = estados;
	}, function(erro) {
		console.log(erro);
	});

	$scope.queryEstado = function(searchText) {
		return $scope.estados.filter(function name(estado) {
			return removeAcento(estado.capital).indexOf(removeAcento(searchText)) >= 0;
		});
	}

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

	$scope.formatarValor = function(valor) {
		return numberToMoney( valor * $scope.moedas[$scope.moeda].cotacao );
	}

}])
.config(function($mdDateLocaleProvider) {
	$mdDateLocaleProvider.formatDate = function(date) {
		return moment(date).format('DD/MM/YYYY');
	};
});