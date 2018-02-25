'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cheerio = require('cheerio');

var _cheerio2 = _interopRequireDefault(_cheerio);

var _md = require('md5');

var _md2 = _interopRequireDefault(_md);

var _logger = require('../helper/logger');

var _logger2 = _interopRequireDefault(_logger);

var _processorError = require('../error/processorError');

var _processorError2 = _interopRequireDefault(_processorError);

var _queueDao = require('../dao/queueDao');

var _queueDao2 = _interopRequireDefault(_queueDao);

var _url = require('../helper/url');

var _url2 = _interopRequireDefault(_url);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var QueueService = function () {
    function QueueService(domain) {
        _classCallCheck(this, QueueService);

        this.domain = null;
        this.queueDao = new _queueDao2.default();
        this.logger = _logger2.default.getInstance();

        this.domain = domain;
    }

    _createClass(QueueService, [{
        key: 'firstPeek',
        value: function firstPeek() {
            var _this = this;

            return this.queueDao.getUnfinishedUrl().then(function (url) {
                if (url === null) {
                    return _this.queueDao.save(_this.domain.url);
                } else {
                    return url;
                }
            });
        }
    }, {
        key: 'peek',
        value: function peek() {
            return this.queueDao.getUnfinishedUrl();
        }
    }, {
        key: 'extend',
        value: function extend(url, html, extracted) {
            var _this2 = this;

            var $ = _cheerio2.default.load(html);
            var extendFunction = this.domain.extendQueueFunction;
            var urlList = null;
            if (extendFunction === null) {
                extendFunction = this.extendQueueDefault;
            } else if (typeof extendFunction !== 'function') {
                throw new _processorError2.default(false, "extendQueue option must be a function!");
            } else {
                try {
                    urlList = extendFunction($, url, this.domain, extracted);
                } catch (e) {
                    throw new _processorError2.default(false, "extendQueue function error:" + e.message, e.stack);
                }
                try {
                    urlList = this.urlFilter(urlList, url.href);
                } catch (e) {
                    throw new _processorError2.default(false, 'You must return list of strings for extending queue!', '');
                }
                return this.queueDao.saveList(urlList).then(function () {
                    return _this2.queueDao.markFinished(url, extracted);
                });
            }
        }
    }, {
        key: 'extendQueueDefault',
        value: function extendQueueDefault($, url, domain, extracted) {
            var list = [];
            $('a').each(function () {
                list.push(this.attribs.href);
            });
            return list;
        }
    }, {
        key: 'urlFilter',
        value: function urlFilter(nextLinks, after) {
            var newList = [];
            var hashMap = {};
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = nextLinks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var url = _step.value;

                    var urlObject = new _url2.default(url);
                    if (urlObject.origin === null) {
                        urlObject.setOrigin(this.domain.url.origin);
                    }
                    if (urlObject.protocol !== 'http:') continue;
                    if (urlObject.origin !== this.domain.url.origin) continue;
                    urlObject.hash = this.domain.generateHash(urlObject);
                    urlObject.after = after;
                    if (typeof hashMap[urlObject.hash] === 'undefined') {
                        hashMap[urlObject.hash] = 1;
                        newList.push(urlObject);
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            return newList;
        }
    }]);

    return QueueService;
}();

exports.default = QueueService;