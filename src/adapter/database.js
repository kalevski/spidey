import fs from 'fs';
import path from 'path';
import md5 from 'md5';

import DatabaseError from '../error/databaseError';

import Sequelize from 'sequelize';
import Logger from '../helper/logger';

import ContentModel from '../model/contentModel';
import QueueModel from '../model/queueModel';

class Database {

    logger = Logger.getInstance();
    client = null;

    table = {
        Content: null,
        Queue: null
    };

    init(name, dataPath = './') {

        let baseDir = path.join(process.cwd(), dataPath);
        if (fs.existsSync(baseDir)) {
            this.client = new Sequelize({
                logging: (message) => {
                    if (message.length > 500) {
                        this.logger.verbose(message.substring(0,120) + '...');
                    } else {
                        this.logger.verbose(message);
                    }
                    
                },
                dialect: 'sqlite',
                pool: {
                  max: 8,
                  min: 1,
                  idle: 10000
                },
                storage: path.join(process.cwd(), dataPath, this.getFilename(name))
            });
            return this.syncDatabase();
        } else {
            return Promise.reject(new DatabaseError('Dir:' + path.join(baseDir, '../')
                + ' doesn\'t exist! I can\'t create database in this path', ''));
        }
    }

    syncDatabase() {
        
        this.table.Content = this.client.define('content', ContentModel, { timestamps: true, tableName: 'content' });
        this.table.Queue = this.client.define('queue', QueueModel, { timestamps: true, tableName: 'queue' });
        
        return this.client.authenticate().then(() => {
            return this.client.sync();
        });
    }

    reset() {
        return this.client.drop();
    }

    getFilename(name) {
        return name + '-' + new Date().toDateString().split(" ").join("_").toLowerCase() + '.sqlite.db';
    }
}

var instance = null;
Database.getInstance = function() {
    if (instance === null) {
        instance = new Database();
    }
    return instance;
}

export default Database;