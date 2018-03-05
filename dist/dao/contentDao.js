'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _database = require('../adapter/database');

var _database2 = _interopRequireDefault(_database);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ContentDao = function () {
    function ContentDao() {
        _classCallCheck(this, ContentDao);

        this.database = _database2.default.getInstance();
    }

    _createClass(ContentDao, [{
        key: 'save',
        value: function save(data, url, html, hash) {
            var _this = this;

            return this.database.table.Content.create({
                data: data,
                url: url.href,
                hash: hash
            }).then(function () {
                return _this.database.saveFile('mined-html', hash, html);
            }).catch(function (e) {
                return false;
            }).then(function () {
                return true;
            });
        }
    }, {
        key: 'getAll',
        value: function getAll() {
            return this.database.table.Content.findAll();
        }
    }]);

    return ContentDao;
}();

exports.default = ContentDao;