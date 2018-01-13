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
var numberToMoney = function(numero) {
  var numero = numero.toFixed(2).split('.');
  numero[0] = numero[0].split(/(?=(?:...)*$)/).join('.');
  return numero.join(',');
}
var removeAcento = function (text)
{       
    text = text.toLowerCase();                                                         
    text = text.replace(new RegExp('[ÁÀÂÃ]','gi'), 'a');
    text = text.replace(new RegExp('[ÉÈÊ]','gi'), 'e');
    text = text.replace(new RegExp('[ÍÌÎ]','gi'), 'i');
    text = text.replace(new RegExp('[ÓÒÔÕ]','gi'), 'o');
    text = text.replace(new RegExp('[ÚÙÛ]','gi'), 'u');
    text = text.replace(new RegExp('[Ç]','gi'), 'c');
    return text;                 
}
angular.module('testecvc').controller('CarrosController', ['$scope', '$anchorScroll', 'orderByFilter', 'carrosResource', 'estadosResource', function($scope, $anchorScroll, orderBy, carrosResource, estadosResource) {
	// Define variavel do status para controle de exibição
	// do feedback fake de atualização de página
	$scope.feedbackAtualizacaoLista = false;
	$scope.atualizarLista = function()
	{
		$scope.feedbackAtualizacaoLista = true;
		setTimeout(function(){ $scope.feedbackAtualizacaoLista = false; $scope.$apply(); }, 500);
	}
	
	// Inicializa variaveis do controlle
	$scope.carros = [];
	$scope.estados = [];
	$scope.filtro = '';
	$scope.mensagem = '';
	$scope.ordem_param = 'none';
	$scope.moeda = 'real';
	$scope.diasLocacao = 1;
	$scope.devolverOutroLocal = false;
	$scope.opcoesHorarios = [];

	// Preenche array de horários disponíveis com valores a cada meia hora do dia
	for(i=0; i<24; i++){
		let hora = i < 10 ? '0' + i : i;
		$scope.opcoesHorarios.push(hora + ':00');
		$scope.opcoesHorarios.push(hora + ':30');
	}

	// Define valores iniciais de horário de retirada e devolução
	$scope.horarioRetirada = '08:00'
	$scope.horarioDevolucao = '13:00'

	// Define datas e limites iniciais para datas de reirada
	var data_atual = new Date();
	$scope.dataRetirada = data_atual;
	$scope.minDataRetirada = data_atual;
	$scope.maxDataRetirada = moment(data_atual, "DD/MM/YYYY").add(3, 'months').toDate();

	// FUnção que calcula limites inicias para datas de devolução do veículo
	$scope.calcularLimitesDataDevolucao = function(){
		var dataLocacao = $scope.dataRetirada;
		$scope.minDataDevolucao = moment(dataLocacao, "DD/MM/YYYY").add(1, 'days').toDate();
		$scope.dataDevolucao = moment(dataLocacao, "DD/MM/YYYY").add(2, 'days').toDate();
		$scope.maxDataDevolucao = moment(dataLocacao, "DD/MM/YYYY").add(30, 'days').toDate();
		$scope.atualizarLista();
	}

	// Função que calcula a diferença entre dia de devolução
	// e dia de retirada. Obtendo assim quantidade de dias
	// que o veículo ficará algudo
	$scope.calcularDiasLocacao = function() {
		$scope.diasLocacao = moment($scope.dataDevolucao).diff($scope.dataLocacao, 'days');
		$scope.atualizarLista();
	}

	// Executa funções que definem valores iniciais para o controller
	$scope.calcularLimitesDataDevolucao();
	$scope.calcularDiasLocacao();

	// Define Moedas disponíveis com nome, simbolo e cotação a partir do Real(R$)
	$scope.moedas = {
		real: {
			nome: 'Real',
			simbolo: 'R$',
			cotacao: 1
		},
		dolar: {
			nome: 'Dolar',
			simbolo: 'U$',
			cotacao: 0.7
		},
		euro: {
			nome: 'Euro',
			simbolo: '€',
			cotacao: 0.4
		},
	}

	// Define parametros iniciais de paginção
	$scope.pagination = {
		itemsPerPage: '10',
		page: 1,
		totalItems: 0,
		totalPages: 1
	}

	// Função que é executada ao clicar no botões
	// de paginação
	// Obs: Como não é realizada uma nova consulta à API para
	// obter carros de determinada página esta paginação é "Fake"
	$scope.alterarPagina = function(i){
		if(i<1)
			i=1;
		
		if(i>$scope.pagination.totalPages)
			i=$scope.pagination.totalPages;
		$scope.pagination.page = i;
		$anchorScroll('resultados-busca');
	}

	// Função que atualiza parametros da paginação
	$scope.atualizarPagination = function(){
		$scope.atualizarLista();
		$scope.pagination.totalItems = $scope.carros.length;
		$scope.pagination.totalPages = Math.ceil($scope.carros.length / $scope.pagination.itemsPerPage);
	}

	// Função que realiza a consulta a API de carros trazendo os dados de todos os carros
	carrosResource.query(function(carros) {
		$scope.carros = carros;
		$scope.atualizarPagination();
	}, function(erro) {
		console.log(erro);
	});

	// Consulta a API para obter dados dos estados brasileiros (Locais de retirada e devolução)
	estadosResource.query(function(estados) {
		$scope.estados = estados;
	}, function(erro) {
		console.log(erro);
	});

	// Filtro do autocomplete de Locais de retirada e devolução
	$scope.queryEstado = function(searchText) {
		return $scope.estados.filter(function name(estado) {
			return removeAcento(estado.capital).indexOf(removeAcento(searchText)) >= 0;
		});
	}

	// Função que oculta/exibe os detalhes de um veículo
	$scope.toggleDetalhe = function(carro){
		carro.showDetalhe = ! carro.showDetalhe;
	}

	// Função que é chamada através dos filtros de ordenação
	// e reordena o array de veículso conforme selecionado pelo usuário
	$scope.reordenar = function(){
		$scope.atualizarLista();
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

	// Função que faz a conversão de cotação pela moeda e formata o valor como moeda para exibição na tela
	$scope.formatarValor = function(valor) {
		return numberToMoney( valor * $scope.moedas[$scope.moeda].cotacao );
	}

	// Função que 'favorita' um carro
	$scope.favoritarCarro = function (carro) {
		carro.favorito = ! carro.favorito;
	}

	// Função que marca um carro como alugado
	$scope.alugarCarro = function(carro)
	{
		carro.alugado = true;
	}

}])
.config(["$mdDateLocaleProvider", function($mdDateLocaleProvider) {

	// Configuração do formato de data utilizado
	$mdDateLocaleProvider.formatDate = function(date) {
		return moment(date).format('DD/MM/YYYY');
	};
}]);
angular.module('carrosServices', ['ngResource'])
	.factory('carrosResource', ["$resource", function($resource) {
		// Recuro da API de carros
		return $resource('https://5a550e3ba3ba810012c00956.mockapi.io/api/v1/carros', null, {
			'query' : { 
				method: 'GET',
				isArray:true
			}
		});
	}])
	.factory('estadosResource', ["$resource", function($resource) {
		// Recuro da API de Estados
		return $resource('https://5a550e3ba3ba810012c00956.mockapi.io/api/v1/estados', null, {
			'query' : { 
				method: 'GET',
				isArray:true
			}
		});
	}]);