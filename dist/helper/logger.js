'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _signals = require('signals');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Logger = function () {
    function Logger() {
        _classCallCheck(this, Logger);

        this.typeColor = {
            error: '\x1b[31m',
            warn: '\x1b[33m',
            info: '\x1b[32m',
            verbose: '\x1b[36m',
            debug: '\x1b[34m',
            silly: '\x1b[35m'
        };
        this.onMessage = new _signals.Signal();
    }

    _createClass(Logger, [{
        key: 'error',
        value: function error(message) {
            this._log('error', arguments);
        }
    }, {
        key: 'warn',
        value: function warn(message) {
            this._log('warn', arguments);
        }
    }, {
        key: 'info',
        value: function info(message) {
            this._log('info', arguments);
        }
    }, {
        key: 'verbose',
        value: function verbose(message) {
            this._log('verbose', arguments);
        }
    }, {
        key: 'debug',
        value: function debug(message) {
            this._log('debug', arguments);
        }
    }, {
        key: 'silly',
        value: function silly(message) {
            this._log('silly', arguments);
        }
    }, {
        key: '_log',
        value: function _log(type, args) {
            var args = Array.from(args);
            var message = '';
            for (var i = 0; i < args.length; i++) {
                var prefix = ' ';
                if (i == 0) prefix = '';
                if (typeof args[i] !== 'string') {
                    var cache = [];
                    message += prefix + '\n' + JSON.stringify(args[i], function (key, value) {
                        if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && value !== null) {
                            if (cache.indexOf(value) !== -1) {
                                return;
                            }
                            cache.push(value);
                        }
                        return value;
                    }, 3);
                    cache = null;
                } else {
                    message += prefix + args[i];
                }
            }

            this.onMessage.dispatch(message, type, this.formatMessage(message, type));
        }
    }, {
        key: 'formatMessage',
        value: function formatMessage(message, type) {
            var formatted = this.typeColor[type];
            formatted += '[SPIDEY][' + new Date(Date.now()).toLocaleString() + ']: ';
            formatted += message;
            formatted += '\x1b[37m';
            return formatted;
        }
    }]);

    return Logger;
}();

var instance = null;
Logger.getInstance = function () {
    if (instance === null) {
        instance = new Logger();
    }
    return instance;
};

exports.default = Logger;