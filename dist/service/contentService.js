'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cheerio = require('cheerio');

var _cheerio2 = _interopRequireDefault(_cheerio);

var _md = require('md5');

var _md2 = _interopRequireDefault(_md);

var _readabilityJs = require('readability-js');

var _readabilityJs2 = _interopRequireDefault(_readabilityJs);

var _processorError = require('../error/processorError');

var _processorError2 = _interopRequireDefault(_processorError);

var _logger = require('../helper/logger');

var _logger2 = _interopRequireDefault(_logger);

var _contentDao = require('../dao/contentDao');

var _contentDao2 = _interopRequireDefault(_contentDao);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ContentService = function () {
    function ContentService(domain) {
        var _this = this;

        _classCallCheck(this, ContentService);

        this.domain = null;
        this.logger = _logger2.default.getInstance();
        this.contentDao = new _contentDao2.default();

        this.generateHash = function (object) {
            if (typeof object == 'undefined') {
                object = 'undefined';
                _this.logger.warn('hash object can\'t be undefined!');
            } else if (typeof object !== 'string') {
                object = JSON.stringify(object);
            }
            return (0, _md2.default)(object);
        };

        this.domain = domain;
    }

    _createClass(ContentService, [{
        key: 'extract',
        value: function extract(url, html) {
            var _this2 = this;

            return this.readContent(html).then(function (article) {
                var $ = _cheerio2.default.load(html);
                var extractFunction = _this2.domain.extractDataFunction;
                var content = null;
                if (extractFunction === null) {
                    extractFunction = _this2.extractDataDefault;
                } else if (typeof extractFunction !== 'function') {
                    throw new _processorError2.default(false, 'extractData option must be a function!', '');
                } else {
                    try {
                        content = extractFunction($, url, _this2.domain, article, _this2.generateHash);
                    } catch (e) {
                        throw new _processorError2.default(false, 'extendQueue function error:' + e.message, e.stack);
                    }
                    if (typeof content['data'] !== 'undefined' && typeof content['hash'] === 'string') {
                        if (typeof content['data'] !== 'string') {
                            content['data'] = JSON.stringify(content['data']);
                        }
                        return _this2.contentDao.save(content.data, url, html, content.hash).then(function (extracted) {
                            return { url: url, html: html, extracted: extracted };
                        });
                    } else {
                        throw new _processorError2.default(false, 'Wrong extracted data format. You must return object { data(any), hash(string:UNIQIE) }', '');
                        return { url: url, html: html, extracted: false };
                    }
                }
            });
        }
    }, {
        key: 'readContent',
        value: function readContent(html) {
            return new Promise(function (resolve, reject) {
                (0, _readabilityJs2.default)(html, function (err, article, meta) {
                    if (err) {
                        resolve({});
                    } else {
                        delete article.document;
                        if (article.content !== false) {
                            article.content = article.content.text().replace(/\s\s+/g, ' ');
                        }
                        resolve(article);
                    }
                });
            });
        }
    }, {
        key: 'extractDataDefault',
        value: function extractDataDefault($, url, domain, article, generateHash) {
            return {
                data: cleanText,
                hash: generateHash(cleanText)
            };
        }
    }]);

    return ContentService;
}();

exports.default = ContentService;