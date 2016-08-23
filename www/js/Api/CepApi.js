angular.module('starter')
        .factory('CepApiFactory', ['RequestModuloFactory',
            function (RequestModuloFactory) {

                var services = {};
                
                services.busca = function (cep, retorno) {
                    RequestModuloFactory.url = 'http://cep.agenciavoxel.com.br/';
                    RequestModuloFactory.get(cep + '.json', null, function (response) {
                        retorno(response);
                    });
                };

                return services;
            }
        ]);
