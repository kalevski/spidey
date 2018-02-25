'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _signals = require('signals');

var _logger = require('../helper/logger');

var _logger2 = _interopRequireDefault(_logger);

var _ScraperStatus = require('../enum/ScraperStatus');

var _ScraperStatus2 = _interopRequireDefault(_ScraperStatus);

var _processor = require('./processor');

var _processor2 = _interopRequireDefault(_processor);

var _database = require('../adapter/database');

var _database2 = _interopRequireDefault(_database);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Scraper = function () {
    function Scraper() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Scraper);

        this.event = {
            onDone: new _signals.Signal(),
            onMessage: new _signals.Signal()
        };
        this.logger = _logger2.default.getInstance();
        this.status = _ScraperStatus2.default.AVAILABLE;
        this.processor = new _processor2.default();
        this.database = _database2.default.getInstance();
        this.options = {};

        this.options = options;
    }

    _createClass(Scraper, [{
        key: 'scrape',
        value: function scrape(name, options) {
            var _this = this;

            if (this.status === _ScraperStatus2.default.AVAILABLE) {
                this.status = _ScraperStatus2.default.BUSY;
                this.database.init(name, this.options['dataPath']).then(function () {
                    _this.processor.start(options);
                }).catch(function (error) {
                    _this.logger.error(error.message, error.stack);
                });
                this.processor.onFinish.addOnce(function () {
                    _this.status = _ScraperStatus2.default.AVAILABLE;
                    _this.event.onDone.dispatch();
                });
            } else {
                this.logger.warn('SPIDEY INSTANCE IS BUSY!');
            }
        }
    }, {
        key: 'stop',
        value: function stop() {
            if (this.status === _ScraperStatus2.default.BUSY) {
                this.processor.stop();
            }
        }
    }]);

    return Scraper;
}();

Scraper.Status = _ScraperStatus2.default;

exports.default = Scraper;