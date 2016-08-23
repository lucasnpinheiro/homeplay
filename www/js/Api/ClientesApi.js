angular.module('starter')
        .factory('ClientesApiFactory', ['RequestModuloFactory', 'Config',
            function (RequestModuloFactory, Config) {

                var services = {};

                services.add = function (options, retorno) {
                    RequestModuloFactory.url = Config.url + Config.api;
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
