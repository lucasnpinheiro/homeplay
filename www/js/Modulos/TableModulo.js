angular.module('starter')
        .factory('TableModuloFactory', ['Config', 'ValidacaoModuloFactory',
            function (Config, ValidacaoModuloFactory) {
                var db = null;
                db = openDatabase(Config.database + ".db", "1", "Test DB", 10 * 1024 * 1024);
                var services = {};

                services.table = null;
                services.campos = null;

                services.merge = function (dados) {
                    return angular.merge(services, dados);
                };

                services.drop = function (retorno) {
                    var sql = 'DROP TABLE ' + services.table + ';';
                    services.query(sql, function (e) {
                        services.create(retorno);
                    });
                };

                services.create = function (retorno) {

                    var campos = [];
                    angular.forEach(services.campos, function (value, key) {
                        campos.push(key + ' ' + value);
                    });
                    var sql = 'CREATE TABLE IF NOT EXISTS ' + services.table + ' (' + campos.join(', ') + ');';
                    console.log(sql);
                    services.query(sql, function (e) {
                        retorno(e);
                    });
                };

                services.getColumm = function (retorno) {

                    services.query("SELECT name, sql FROM sqlite_master WHERE name = '" + services.table + "' AND type = 'table'", function (results) {
                        var columnNames = [];
                        if (results !== null) {
                            var columnParts = results.rows.item(0).sql.replace(/^[^\(]+\(([^\)]+)\)/g, '$1').split(',');

                            for (i in columnParts) {
                                if (typeof columnParts[i] === 'string')
                                    columnParts[i] = ValidacaoModuloFactory.trim(columnParts[i]);
                                columnParts[i] = columnParts[i].split(" ");
                                var _type = columnParts[i][1].indexOf("(");
                                _type = columnParts[i][1].substr(0, _type);
                                if (_type === '') {
                                    _type = columnParts[i][1];
                                }
                                if (_type.indexOf(")") >= 0) {
                                    _type = _type.substr(0, _type.indexOf(")"));
                                }
                                var dados = {
                                    columm: columnParts[i][0],
                                    type: _type,
                                    primary: (columnParts[i][2] + '_' + columnParts[i][3] + '_' + columnParts[i][4] === 'PRIMARY KEY AUTOINCREMENT' ? true : false),
                                }
                                columnNames.push(dados);
                            }
                        }
                        retorno(columnNames);
                    });
                }

                services.save = function (options, retorno, forceCreate) {
                    if (forceCreate === true) {
                        services.insert(services.table, options, retorno);
                    } else {
                        if (options.id !== null) {
                            services.update(services.table, options, options.id, retorno);
                        } else {
                            if (options.id === undefined || options.id === 'undefined' || options.id === '' || options.id === null) {
                                delete options.id;
                            }
                            services.insert(services.table, options, retorno);
                        }
                    }
                };

                services.insert = function (options, retorno) {
                    var key = [];
                    var value = [];
                    angular.forEach(options, function (v, k) {
                        if (!ValidacaoModuloFactory.empty(v) || ValidacaoModuloFactory.is_numeric(v)) {
                            key.push(k);
                            value.push('"' + ValidacaoModuloFactory.trim(v) + '"');
                        }
                    });
                    var query = "INSERT INTO " + services.table + " (" + key.join(', ') + ") VALUES (" + value.join(', ') + ");";
                    services.query(query, function (res) {
                        if (res !== null) {
                            options.id = res.insertId;
                            retorno(options);
                        } else {
                            retorno(null);
                        }
                    });

                };

                services.replace = function (options, retorno) {
                    var key = [];
                    var value = [];
                    angular.forEach(options, function (v, k) {
                        if (!ValidacaoModuloFactory.empty(v) || ValidacaoModuloFactory.is_numeric(v)) {
                            key.push(k);
                            value.push('"' + ValidacaoModuloFactory.trim(v) + '"');
                        }
                    });
                    var query = "INSERT OR REPLACE INTO " + services.table + " (" + key.join(', ') + ") VALUES (" + value.join(', ') + ");";
                    services.query(query, function (res) {
                        if (res !== null) {
                            retorno(options);
                        } else {
                            retorno(null);
                        }
                    });

                };

                services.update = function (options, id, retorno) {
                    var key = [];
                    angular.forEach(options, function (v, k) {
                        if (!ValidacaoModuloFactory.empty(v) || ValidacaoModuloFactory.is_numeric(v)) {
                            key.push(k + '="' + ValidacaoModuloFactory.trim(v) + '"');
                        } else {
                            key.push(k + '=null');
                        }
                    });
                    var query = "UPDATE " + services.table + " SET " + key.join(', ') + " WHERE id = '" + id + "'";
                    services.query(query, function (res) {
                        if (res !== null) {
                            retorno(options);
                        } else {
                            retorno(null);
                        }
                    });

                };

                services.get = function (key, val, retorno) {
                    var query = "SELECT * FROM " + services.table + " WHERE " + key + " = '" + val + "' LIMIT 1";
                    services.query(query, function (res) {
                        if (res !== null) {
                            var len = res.rows.length;
                            if (len > 0) {
                                var obj = res.rows.item(0);
                                retorno(obj);
                            } else {
                                retorno(null);
                            }
                        } else {
                            retorno(null);
                        }
                    });

                };

                services.first = function (options, retorno) {
                    var conditions = angular.merge({
                        from: '*',
                        alias: null,
                        where: null,
                        order: null,
                        group: null,
                        limit: null,
                        join: null
                    }, options);
                    conditions.limit = 1;
                    services.all(services.table, conditions, function (r) {
                        if (r === null) {
                            retorno(null);
                        } else {
                            retorno(r[0]);
                        }
                    });
                };

                services.all = function (options, retorno) {
                    var conditions = angular.merge({
                        from: '*',
                        alias: null,
                        where: null,
                        order: null,
                        group: null,
                        limit: null,
                        join: null
                    }, options);
                    var query = [];
                    query.push("SELECT");
                    query.push(conditions.from);
                    query.push('FROM');
                    query.push(services.table);
                    if (!ValidacaoModuloFactory.empty(conditions.alias)) {
                        query.push("AS " + conditions.alias);
                    }
                    if (!ValidacaoModuloFactory.empty(conditions.join)) {
                        query.push(conditions.join);
                    }
                    if (!ValidacaoModuloFactory.empty(conditions.where)) {
                        query.push('WHERE');
                        query.push(conditions.where);
                    }
                    if (!ValidacaoModuloFactory.empty(conditions.group)) {
                        query.push('GROUP BY');
                        query.push(conditions.group);
                    }
                    if (!ValidacaoModuloFactory.empty(conditions.order)) {
                        query.push('ORDER BY');
                        query.push(conditions.order);
                    }
                    if (!ValidacaoModuloFactory.empty(conditions.limit)) {
                        query.push('LIMIT');
                        query.push(conditions.limit);
                    }
                    query = query.join(' ');
                    services.query(query, function (res) {
                        if (res !== null) {
                            var len = res.rows.length;
                            if (len > 0) {
                                var obj = [];
                                for (var i = 0; i < len; i++) {
                                    obj.push(res.rows.item(i));
                                }
                                retorno(obj);
                            } else {
                                retorno(null);
                            }
                        } else {
                            retorno(null);
                        }
                    });
                };


                services.deleteAll = function (options, retorno) {
                    var conditions = angular.merge({
                        where: null,
                    }, options);
                    var query = [];
                    query.push("DELETE");
                    query.push('FROM');
                    query.push(services.table);
                    if (!ValidacaoModuloFactory.empty(conditions.where)) {
                        query.push('WHERE');
                        query.push(conditions.where);
                    }

                    query = query.join(' ');
                    services.query(query, function (res) {
                        if (res !== null) {
                            var len = res.rows.length;
                            if (len > 0) {
                                var obj = [];
                                for (var i = 0; i < len; i++) {
                                    obj.push(res.rows.item(i));
                                }
                                retorno(obj);
                            } else {
                                retorno(null);
                            }
                        } else {
                            retorno(null);
                        }
                    });
                };


                services.count = function (retorno) {
                    var query = "SELECT COALESCE(COUNT(*), 0) as total FROM " + services.table;
                    services.query(query, function (res) {
                        if (res !== null) {
                            var obj = res.rows.item(0);
                            retorno(obj.total);
                        } else {
                            retorno(null);
                        }
                    });
                };

                services.delete = function (chave, valor, retorno) {
                    var query = "DELETE FROM " + services.table + ' WHERE ' + chave + ' = ' + valor;
                    services.query(query, function (res) {
                        if (res !== null) {
                            retorno(true);
                        } else {
                            retorno(false);
                        }
                    });
                };

                services.query = function (query, retorno) {
                    db.transaction(function (transaction) {
                        transaction.executeSql(query, [],
                                function (tx, result) {
                                    services.debug(tx);
                                    services.debug(query);
                                    retorno(result);
                                },
                                function (error) {
                                    services.debug(query);
                                    services.debug(error);
                                    retorno(null);
                                });
                    });
                };

                services.debug = function (val) {
                    console.log(val);
                };

                services.addslashes = function (str) {
                    return (str + '').replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
                };

                return services;
            }
        ]);
