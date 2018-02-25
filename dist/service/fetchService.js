'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _httpClient = require('../adapter/httpClient');

var _httpClient2 = _interopRequireDefault(_httpClient);

var _processorError = require('../error/processorError');

var _processorError2 = _interopRequireDefault(_processorError);

var _logger = require('../helper/logger');

var _logger2 = _interopRequireDefault(_logger);

var _queueDao = require('../dao/queueDao');

var _queueDao2 = _interopRequireDefault(_queueDao);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FetchService = function () {
    function FetchService() {
        _classCallCheck(this, FetchService);

        this.queueDao = new _queueDao2.default();
        this.client = new _httpClient2.default();
        this.logger = _logger2.default.getInstance();
        this.sleepSeconds = 15;
        this.attempts = 3;
    }

    _createClass(FetchService, [{
        key: 'fetch',
        value: function fetch(url) {
            var _this = this;

            this.logger.info('Start fetching data from: ' + url.href);
            return this.client.fetch('GET', url.href).then(function (html) {
                _this.attempts = 3;
                return { url: url, html: html };
            }).catch(function (error) {
                _this.logger.warn('Something is wrong with url:', url.href);
                _this.attempts--;
                if (_this.attempts === 0) {
                    _this.attempts = 3;
                    return _this.queueDao.markFinished(url, false).then(function () {
                        throw new _processorError2.default(true, 'URL:' + url.href + ' is down!', '');
                    });
                } else {
                    _this.logger.info('I will try again to fetch the same url in ' + _this.sleepSeconds + ' seconds');
                    return _this.sleep();
                }
            }).then(function (data) {
                if (data === 'try_again') {
                    _this.logger.warn('Unsuccessful fetch again :(');
                    return _this.fetch(url);
                } else {
                    return data;
                }
            });
        }
    }, {
        key: 'sleep',
        value: function sleep() {
            var _this2 = this;

            return new Promise(function (resolve, reject) {
                setTimeout(function () {
                    resolve('try_again');
                }, _this2.sleepSeconds * 1000);
            });
        }
    }]);

    return FetchService;
}();

exports.default = FetchService;