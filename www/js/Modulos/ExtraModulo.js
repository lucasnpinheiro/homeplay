angular.module('starter')
        .factory('ExtraModuloFactory',
                function (ValidacaoModuloFactory) {

                    var services = {};

                    services.color = function (key) {
                        if (key % 2 === 0) {
                            return 'item-mydark';
                        } else {
                            return 'item-stable';
                        }
                    };
                    services.img = function (dados) {
                        if (ValidacaoModuloFactory.isNotNull(dados.foto)) {
                            return dados.url;
                        } else {
                            return 'img/ionic.png';
                        }
                    };

                    return services;
                }
        );