'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ProcessorError = function (_Error) {
    _inherits(ProcessorError, _Error);

    function ProcessorError(ignorable, errorMessage) {
        var stack = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

        _classCallCheck(this, ProcessorError);

        var _this = _possibleConstructorReturn(this, (ProcessorError.__proto__ || Object.getPrototypeOf(ProcessorError)).call(this, errorMessage));

        _this.ignorable = false;
        _this.type = 'PROCESSOR_ERROR';

        _this.ignorable = ignorable;
        if (stack !== null) {
            _this.stack = stack;
        }
        return _this;
    }

    return ProcessorError;
}(Error);

exports.default = ProcessorError;