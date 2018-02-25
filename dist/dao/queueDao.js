'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _database = require('../adapter/database');

var _database2 = _interopRequireDefault(_database);

var _url = require('../helper/url');

var _url2 = _interopRequireDefault(_url);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var QueueDao = function () {
    function QueueDao() {
        _classCallCheck(this, QueueDao);

        this.database = _database2.default.getInstance();
    }

    _createClass(QueueDao, [{
        key: 'save',
        value: function save(url) {
            return this.database.table.Queue.create({
                href: url.href,
                hash: url.hash,
                after: url.after,
                finished: false,
                scraped: false
            }).then(function (response) {
                return url;
            }).catch(function (error) {
                return null;
            });
        }
    }, {
        key: 'saveList',
        value: function saveList(urlList) {
            var _this = this;

            var promises = [];

            var _loop = function _loop(i) {
                var promise = _this.database.table.Queue.findOne({
                    where: {
                        hash: urlList[i].hash
                    }
                }).then(function (result) {
                    if (result === null) {
                        return _this.database.table.Queue.create({
                            href: urlList[i].href,
                            hash: urlList[i].hash,
                            after: urlList[i].after,
                            finished: false
                        });
                    } else {
                        return true;
                    }
                }).catch(function (err) {
                    return false;
                });

                promises.push(promise);
            };

            for (var i = 0; i < urlList.length; i++) {
                _loop(i);
            }
            return Promise.all(promises);
        }
    }, {
        key: 'markFinished',
        value: function markFinished(url, scraped) {
            return this.database.table.Queue.update({
                finished: true,
                scraped: scraped
            }, {
                where: {
                    hash: url.hash
                }
            }).then(function () {
                return true;
            }).catch(function () {
                return false;
            });
        }
    }, {
        key: 'getUnfinishedUrl',
        value: function getUnfinishedUrl() {
            return this.database.table.Queue.find({
                where: {
                    finished: false
                }
            }).then(function (result) {
                if (result !== null) {
                    var url = new _url2.default(result.dataValues.href);
                    url.hash = result.dataValues.hash;
                    url.after = result.dataValues.after;
                    return Promise.resolve(url);
                } else {
                    return Promise.resolve(null);
                }
            }).catch(function (err) {
                console.error(err);
                return Promise.reject(err);
            });
        }
    }]);

    return QueueDao;
}();

exports.default = QueueDao;