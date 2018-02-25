'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _signals = require('signals');

var _domain = require('../helper/domain');

var _domain2 = _interopRequireDefault(_domain);

var _logger = require('../helper/logger');

var _logger2 = _interopRequireDefault(_logger);

var _contentService = require('../service/contentService');

var _contentService2 = _interopRequireDefault(_contentService);

var _queueService = require('../service/queueService');

var _queueService2 = _interopRequireDefault(_queueService);

var _fetchService = require('../service/fetchService');

var _fetchService2 = _interopRequireDefault(_fetchService);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Processor = function () {
    function Processor() {
        _classCallCheck(this, Processor);

        this.onFinish = new _signals.Signal();
        this.logger = _logger2.default.getInstance();
        this.contentService = null;
        this.queueService = null;
        this.fetchService = null;
        this.stopped = false;
    }

    _createClass(Processor, [{
        key: 'start',
        value: function start(options) {
            var _this = this;

            var domain = new _domain2.default(options);
            this.contentService = new _contentService2.default(domain);
            this.queueService = new _queueService2.default(domain);
            this.fetchService = new _fetchService2.default();
            this.queueService.firstPeek().then(function (url) {
                if (url === null) {
                    _this.execStop('I can\'t work on this project! It\'s already done!');
                } else {
                    return _this.crawlingStep(url);
                }
            }).catch(function (error) {
                _this.logger.error(error.message, error.stack);
                if (error['type'] === 'PROCESSOR_ERROR') {
                    if (error.ignorable) {
                        return _this.loop();
                    } else {
                        _this.execStop();
                    }
                }
            });
        }
    }, {
        key: 'stop',
        value: function stop() {
            this.stopped = true;
        }
    }, {
        key: 'crawlingStep',
        value: function crawlingStep(url) {
            var _this2 = this;

            return this.fetchService.fetch(url).then(function (_ref) {
                var url = _ref.url,
                    html = _ref.html;
                return _this2.contentService.extract(url, html);
            }).then(function (_ref2) {
                var url = _ref2.url,
                    html = _ref2.html,
                    extracted = _ref2.extracted;
                return _this2.queueService.extend(url, html, extracted);
            }).then(function () {
                return _this2.loop();
            });
        }
    }, {
        key: 'loop',
        value: function loop() {
            var _this3 = this;

            if (this.stopped) {
                this.execStop();
            } else {
                return this.queueService.peek().then(function (url) {
                    if (url === null) {
                        _this3.execStop('There is no more job for me! Peace out!');
                    } else {
                        return _this3.crawlingStep(url);
                    }
                });
            }
        }
    }, {
        key: 'execStop',
        value: function execStop() {
            var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

            if (message !== null) {
                this.logger.info(message);
            } else {
                this.logger.warn('I\'m forced to stop!');
            }
            this.onFinish.dispatch();
        }
    }]);

    return Processor;
}();

exports.default = Processor;