import Database from '../adapter/database';
import { STRING, BOOLEAN, INTEGER } from 'sequelize';

export default {
    id: {
        type: INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    href: {
        type: STRING,
        allowNull: false,
        unique: true
    },
    hash: {
        type: STRING,
        allowNull: false,
        unique: true
    },
    after: {
        type: INTEGER
    },
    finished: {
        type: BOOLEAN,
        allowNull: false
    },
    scraped: {
        type: BOOLEAN
    }
};
