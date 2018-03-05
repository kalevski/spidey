'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _sequelize = require('sequelize');

var _sequelize2 = _interopRequireDefault(_sequelize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    data: {
        type: _sequelize.STRING,
        allowNull: true
    },

    url: {
        type: _sequelize.STRING,
        allowNull: false
    },

    hash: {
        type: _sequelize.STRING,
        allowNull: false,
        unique: true
    }
};