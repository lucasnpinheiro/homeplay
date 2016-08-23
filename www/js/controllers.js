angular.module('starter.controllers', [])

        .controller('AppCtrl', function ($scope) {

        })
        .controller('FormCtrl', function ($scope, $ionicScrollDelegate, ClientesTable, ValidacaoModuloFactory, LoadModuloFactory, CepApiFactory) {
            //ClientesTable.drop();
            ClientesTable.create(function (retorno) {
                console.log(retorno);
            });

            $scope.formulario = {};

            $scope.campos = function () {
                $scope.formulario = {
                    nome: null,
                    cep: null,
                    endereco: null,
                    numero: null,
                    complemento: null,
                    bairro: null,
                    cidade: null,
                    estado: null,
                    cpf: null,
                    rg: null,
                    telefone: null,
                    celular: null,
                    email: null,
                    atividade: null,
                    preferencias: {
                        arquitetura: false,
                        automacao: false,
                        construtora: false,
                        cortinas: false,
                        decoracao: false,
                        eletricista: false,
                        estofados: false,
                        gesseiro: false,
                        iluminacao: false,
                        marcenaria: false,
                        marmoraria: false,
                        pedras_decorativas: false,
                        propagandas: false,
                        sonorizacao: false,
                        outros: false
                    },
                    outros: null
                };
            }

            $scope.campos();

            $scope.iconeSave = 'ion-checkmark';

            $scope.novo = function () {
                LoadModuloFactory.show();
                $scope.campos();
                $scope.msg = '';
                $ionicScrollDelegate.scrollTop();
                LoadModuloFactory.hide();
            };

            $scope.msg = '';

            $scope.buscaCep = function (cep) {
                CepApiFactory.busca(cep, function (ret) {
                    if (ValidacaoModuloFactory.isOk(ret.status)) {
                        if (ret.data.result.status === 'OK') {
                            $scope.formulario.cep = cep;
                            $scope.formulario.endereco = ret.data.result.Cep.logradouro;
                            $scope.formulario.bairro = ret.data.result.Cep.bairro;
                            $scope.formulario.cidade = ret.data.result.Cep.cidade;
                            $scope.formulario.estado = ret.data.result.Cep.uf;
                        }
                    }
                });
            }

            $scope.salvar = function () {
                LoadModuloFactory.show();
                $scope.iconeSave = 'ion-checkmark-circled';
                $scope.msg = '';

                if (!ValidacaoModuloFactory.isNotNull($scope.formulario.nome)) {
                    LoadModuloFactory.hide();
                    ValidacaoModuloFactory.alert('Informe um nome.');
                    $ionicScrollDelegate.scrollTop();
                    $scope.iconeSave = 'ion-checkmark';
                    return;
                }

                var inst = $scope.formulario;
                var arr = [];

                angular.forEach($scope.formulario.preferencias, function (v, k) {
                    if (v === true) {
                        arr.push(k);
                    }
                });

                $scope.msg = 'Aguarde salvando dados.';
                inst.preferencias = arr.join(',');
                console.log(inst);
                ClientesTable.insert(inst, function (retorno) {
                    $scope.msg = '';
                    if (!retorno === true) {
                        $scope.msg = 'Não foi possivel salvar o registro, verifique os dados.';
                    } else {
                        $scope.campos();
                        $scope.msg = 'Registro salvo com sucesso.';
                    }
                    $ionicScrollDelegate.scrollTop();
                    $scope.iconeSave = 'ion-checkmark';
                    LoadModuloFactory.hide();
                });

            };
        })

        .controller('SincronizarCtrl', function ($scope, ClientesTable, ClientesApiFactory, ValidacaoModuloFactory, LoadModuloFactory) {
            $scope.dados = {
                total: 0,
                sincronizados: 0,
                sincronizando: 0
            };
            ClientesTable.all({}, function (retorno) {
                angular.forEach(retorno, function (value, key) {
                    $scope.dados.total++;
                });
            });

            $scope.startSincronizar = function () {
                $scope.iconeClass = 'fa fa-refresh fa-spin fa-fw';
                $scope.iconeText = 'Sincronizando ...';
                $scope.buttonClass = 'button-dark';
            };

            $scope.stopSincronizar = function () {
                $scope.buttonClass = 'button-royal';
                $scope.iconeClass = 'fa fa-play';
                $scope.iconeText = 'Sincronizar';
            };

            $scope.stopSincronizar();

            $scope.sincronizar = function () {
                LoadModuloFactory.show();
                $scope.startSincronizar();
                ClientesTable.all({}, function (retorno) {
                    if (retorno !== null) {
                        angular.forEach(retorno, function (value, key) {
                            var _value = {};
                            angular.forEach(value, function (v, k) {
                                if (k !== 'id') {
                                    if (v !== null || v !== '') {
                                        _value[k] = v;
                                    }
                                }

                            });
                            $scope.dados.sincronizando++;
                            ClientesApiFactory.add(_value, function (retorno) {
                                console.log(retorno);
                                if (ValidacaoModuloFactory.isCreate(retorno.status)) {
                                    ClientesTable.delete('id', value.id, function (ret) {
                                        console.log(ret);
                                        if (ret === true) {
                                            $scope.dados.sincronizados++;
                                        }
                                        if ($scope.dados.sincronizados === $scope.dados.total) {
                                            LoadModuloFactory.hide();
                                            $scope.stopSincronizar();
                                        }
                                    });
                                } else {
                                    LoadModuloFactory.hide();
                                    $scope.stopSincronizar();
                                }
                            });
                        });
                    } else {
                        LoadModuloFactory.hide();
                        $scope.stopSincronizar();
                    }
                });
            };
        });
