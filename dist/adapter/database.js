'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _md = require('md5');

var _md2 = _interopRequireDefault(_md);

var _databaseError = require('../error/databaseError');

var _databaseError2 = _interopRequireDefault(_databaseError);

var _sequelize = require('sequelize');

var _sequelize2 = _interopRequireDefault(_sequelize);

var _logger = require('../helper/logger');

var _logger2 = _interopRequireDefault(_logger);

var _contentModel = require('../model/contentModel');

var _contentModel2 = _interopRequireDefault(_contentModel);

var _queueModel = require('../model/queueModel');

var _queueModel2 = _interopRequireDefault(_queueModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Database = function () {
    function Database() {
        _classCallCheck(this, Database);

        this.logger = _logger2.default.getInstance();
        this.client = null;
        this.table = {
            Content: null,
            Queue: null
        };
    }

    _createClass(Database, [{
        key: 'init',
        value: function init(name) {
            var _this = this;

            var dataPath = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : './';


            var baseDir = _path2.default.join(process.cwd(), dataPath);
            if (_fs2.default.existsSync(baseDir)) {
                this.client = new _sequelize2.default({
                    logging: function logging(message) {
                        if (message.length > 500) {
                            _this.logger.verbose(message.substring(0, 120) + '...');
                        } else {
                            _this.logger.verbose(message);
                        }
                    },
                    dialect: 'sqlite',
                    pool: {
                        max: 8,
                        min: 1,
                        idle: 10000
                    },
                    storage: _path2.default.join(process.cwd(), dataPath, this.getFilename(name))
                });
                return this.syncDatabase();
            } else {
                return Promise.reject(new _databaseError2.default('Dir:' + _path2.default.join(baseDir, '../') + ' doesn\'t exist! I can\'t create database in this path', ''));
            }
        }
    }, {
        key: 'syncDatabase',
        value: function syncDatabase() {
            var _this2 = this;

            this.table.Content = this.client.define('content', _contentModel2.default, { timestamps: true, tableName: 'content' });
            this.table.Queue = this.client.define('queue', _queueModel2.default, { timestamps: true, tableName: 'queue' });

            return this.client.authenticate().then(function () {
                return _this2.client.sync();
            });
        }
    }, {
        key: 'reset',
        value: function reset() {
            return this.client.drop();
        }
    }, {
        key: 'getFilename',
        value: function getFilename(name) {
            return name + '-' + new Date().toDateString().split(" ").join("_").toLowerCase() + '.sqlite.db';
        }
    }]);

    return Database;
}();

var instance = null;
Database.getInstance = function () {
    if (instance === null) {
        instance = new Database();
    }
    return instance;
};

exports.default = Database;