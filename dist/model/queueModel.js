'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _database = require('../adapter/database');

var _database2 = _interopRequireDefault(_database);

var _sequelize = require('sequelize');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    id: {
        type: _sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    href: {
        type: _sequelize.STRING,
        allowNull: false,
        unique: true
    },
    hash: {
        type: _sequelize.STRING,
        allowNull: false,
        unique: true
    },
    after: {
        type: _sequelize.INTEGER
    },
    finished: {
        type: _sequelize.BOOLEAN,
        allowNull: false
    },
    scraped: {
        type: _sequelize.BOOLEAN
    }
};