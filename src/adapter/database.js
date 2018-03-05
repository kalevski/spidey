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

    workspacePath = null;
    projectPath = null;
    dataPath = null;

    table = {
        Content: null,
        Queue: null
    };

    init(name, dataPath = './') {

        this.workspacePath = path.join(process.cwd(), dataPath);
        this.projectPath = path.join(this.workspacePath, name);
        this.dataPath = path.join(this.projectPath, 'data');

        if (fs.existsSync(this.workspacePath)) {
            
            if (!fs.existsSync(this.projectPath)) {
                fs.mkdirSync(this.projectPath);
            }
            
            if (!fs.existsSync(this.dataPath)) {
                fs.mkdirSync(this.dataPath);
            }

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
                storage: path.join(this.projectPath, 'spidey.sqlite.db')
            });
            return this.syncDatabase();
        } else {
            return Promise.reject(new DatabaseError('Dir:' + this.workspacePath
                + ' doesn\'t exist! I can\'t create project folder in this path', ''));
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

    saveFile(type, name, content) {
        return new Promise((resolve, reject) => {
            fs.writeFile(path.join(this.dataPath, type + '-' + name + '.data'), content, (err) => {
                if (err) {
                    reject(err.message);
                } else {
                    resolve();
                }
            })
        });
    }

    getFile(type, name) {
        return new Promise((resolve, reject) => {
            fs.readFile(path.join(this.dataPath, type + '-' + name + '.data'), 'utf8',(err, data) => {
                if (err) {
                    reject(err.message);
                } else {
                    resolve(data);
                }
            });
        });
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