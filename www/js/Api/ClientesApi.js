angular.module('starter')
        .factory('ClientesApiFactory', ['RequestModuloFactory',
            function (RequestModuloFactory) {

                var services = {};

                services.add = function (options, retorno) {
                    options = angular.merge({
                        id: '',
                        nome: '',
                        cep: '',
                        endereco: '',
                        numero: '',
                        complemento: '',
                        bairro: '',
                        cidade: '',
                        estado: '',
                        cpf: '',
                        rg: '',
                        telefone: '',
                        celular: '',
                        email: '',
                        atividade: '',
                        preferencias: '',
                        outros: ''
                    }, options);
                    RequestModuloFactory.post('index.php', options, function (response) {
                        retorno(response);
                    });
                };

                return services;
            }
        ]);
