'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _urlParse = require('url-parse');

var _urlParse2 = _interopRequireDefault(_urlParse);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Url = function () {
    function Url(url) {
        _classCallCheck(this, Url);

        this.protocol = null;
        this.host = null;
        this.port = null;
        this.path = null;
        this.queryParams = {};
        this.hashtag = null;
        this.origin = null;
        this.href = null;
        this.hash = null;
        this.after = null;

        this.parseUrl(url);
    }

    _createClass(Url, [{
        key: 'parseUrl',
        value: function parseUrl(url) {
            var parsed = (0, _urlParse2.default)(url, true);
            this.protocol = parsed.protocol === '' ? null : parsed.protocol;
            this.host = parsed.host === '' ? null : parsed.host;
            this.port = parsed.port === '' ? null : parsed.port;
            this.path = parsed.pathname === '' ? null : parsed.pathname;
            this.queryParams = this.sortQueryParams(parsed.query);
            this.hashtag = parsed.hash === '' ? null : parsed.hash;
            this.origin = parsed.origin === 'null' ? null : parsed.origin;
            this.href = parsed.href;

            if (this.path === '/') {
                this.path = '';
            }
        }
    }, {
        key: 'setOrigin',
        value: function setOrigin(origin) {
            var url = '';
            url += origin;
            url += this.path !== null ? this.path : '';
            url += this.getQueryString();
            url += this.hashtag !== null ? this.hashtag : '';
            this.parseUrl(url);
        }
    }, {
        key: 'getQueryString',
        value: function getQueryString() {
            var string = "";
            var arr = Object.keys(this.queryParams);
            if (arr.length > 0) string = "?";
            for (var i = 0; i < arr.length; i++) {
                if (i !== 0) {
                    string += "&";
                }
                string += arr[i] + '=' + this.queryParams[arr[i]];
            }
            return string;
        }
    }, {
        key: 'sortQueryParams',
        value: function sortQueryParams(queryParams) {
            var params = {};
            var keys = [];
            for (var k in queryParams) {
                if (queryParams.hasOwnProperty(k)) {
                    keys.push(k);
                }
            }
            keys.sort();
            for (var i = 0; i < keys.length; i++) {
                params[keys[i]] = queryParams[keys[i]];
            }
            return params;
        }
    }]);

    return Url;
}();

exports.default = Url;