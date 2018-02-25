'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _signals = require('signals');

var _url = require('./url');

var _url2 = _interopRequireDefault(_url);

var _md = require('md5');

var _md2 = _interopRequireDefault(_md);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Domain = function () {
    function Domain(options) {
        _classCallCheck(this, Domain);

        this.url = null;
        this.ignoredParams = [];
        this.duplicateCheck = {
            query: true,
            hash: false
        };
        this.extendQueueFunction = null;
        this.extractDataFunction = null;

        this.url = new _url2.default(options['target']);
        this.ignoredParams = options['ignoredParams'] || this.ignoredParams;
        this.duplicateCheck = options['duplicateCheck'] || this.duplicateCheck;
        this.extendQueueFunction = options['extendQueue'] || this.extendQueueFunction;
        this.extractDataFunction = options['extractData'] || this.extractDataFunction;
        this.url.hash = this.generateHash(this.url);
    }

    _createClass(Domain, [{
        key: 'generateHash',
        value: function generateHash(url) {
            var data = {};
            data['domain'] = url.domain;
            data['path'] = url.path;
            if (this.duplicateCheck.query) {
                var queries = {};
                for (var p in url.queryParams) {
                    if (url.queryParams.hasOwnProperty(p)) {
                        var ignored = false;
                        for (var i = 0; i < this.ignoredParams.length; i++) {
                            if (this.ignoredParams[i] === p) {
                                ignored = true;
                                break;
                            }
                        }
                        if (!ignored) queries[p] = url.queryParams[p];
                    }
                }
                data['queryParams'] = queries;
            }
            if (this.duplicateCheck.hash) {
                data['hash'] = url.hash;
            }
            return (0, _md2.default)(JSON.stringify(data));
        }
    }]);

    return Domain;
}();

exports.default = Domain;