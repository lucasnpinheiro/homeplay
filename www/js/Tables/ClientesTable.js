angular.module('starter')
        .factory('ClientesTable', ['TableModuloFactory',
            function (TableModuloFactory) {
                var services = TableModuloFactory;

                services.table = 'clientes';

                services.campos = {
                    id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
                    nome: 'VARCHAR(500)',
                    cep: 'VARCHAR(500)',
                    endereco: 'VARCHAR(500)',
                    numero: 'VARCHAR(15)',
                    complemento: 'VARCHAR(500)',
                    bairro: 'VARCHAR(500)',
                    cidade: 'VARCHAR(500)',
                    estado: 'VARCHAR(2)',
                    cpf: 'VARCHAR(11)',
                    rg: 'VARCHAR(11)',
                    telefone: 'VARCHAR(15)',
                    celular: 'VARCHAR(15)',
                    email: 'VARCHAR(500)',
                    atividade: 'VARCHAR(500)',
                    preferencias: 'VARCHAR(900)',
                    outros: 'VARCHAR(255)',
                };

                return services;
            }
        ]);
