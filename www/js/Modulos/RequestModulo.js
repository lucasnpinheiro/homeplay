angular.module('starter')
        .factory('RequestModuloFactory', ['Config', '$http',
            function (Config, $http) {

                var services = {};
                
                services.url = Config.url + Config.api;

                services.header = function () {
                    delete $http.defaults.headers.common['Access-Control-Allow-Origin'];
                    $http.defaults.headers.common['Content-Type'] = 'application/json;charset=UTF-8';
                    $http.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';
                    $http.defaults.headers.patch['Content-Type'] = 'application/json;charset=UTF-8';
                    $http.defaults.headers.put['Content-Type'] = 'application/json;charset=UTF-8';
                };

                services.post = function (url, options, retorno) {
                    services.header();
                    services.debug(options);
                    $http.post(services.url + url, options).then(
                            function (response) {
                                services.debug(response);
                                retorno(response);
                            },
                            function (error) {
                                services.debug(error);
                                retorno(error);
                            });
                };

                services.put = function (url, options, retorno) {
                    services.header();
                    services.debug(options);
                    $http.put(services.url + url, options).then(
                            function (response) {
                                services.debug(response);
                                retorno(response);
                            },
                            function (error) {
                                services.debug(error);
                                retorno(error);
                            });
                };

                services.get = function (url, options, retorno) {
                    services.header();
                    options = angular.merge({
                        timeout: Config.timeout,
                        limit: 1000
                    }, options);
                    services.debug(options);
                    $http.get(services.url + url, {params: options
                    }).then(function (response) {
                        services.debug(response);
                        retorno(response);
                    }).catch(function (response) {
                        services.debug(response);
                        retorno(response);
                    });
                };

                services.delete = function (url, options, retorno) {
                    services.header();
                    services.debug(options);
                    $http.delete(services.url + url, options).then(
                            function (response) {
                                services.debug(response);
                                retorno(response);
                            },
                            function (error) {
                                services.debug(error);
                                retorno(error);
                            });
                };

                services.debug = function (val) {
                    console.log(val);
                };

                return services;
            }
        ]);
