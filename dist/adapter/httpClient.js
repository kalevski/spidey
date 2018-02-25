'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HttpClient = function () {
    function HttpClient() {
        _classCallCheck(this, HttpClient);
    }

    _createClass(HttpClient, [{
        key: 'fetch',
        value: function fetch(method, url, options) {
            var data = options || {};
            data['method'] = method;
            data['url'] = url;
            data['headers'] = data['headers'] || {};
            data['validateStatus'] = function (status) {
                return true;
            };
            return (0, _axios2.default)(data).then(function (response) {
                return response.data;
            }).catch(function (error) {
                throw error;
            });
        }
    }]);

    return HttpClient;
}();

exports.default = HttpClient;