import cheerio from 'cheerio';
import md5 from 'md5';
import read from 'readability-js';
import ProcessorError from '../error/processorError';
import Logger from '../helper/logger';
import ContentDao from '../dao/contentDao';

class ContentService {

    domain = null;
    logger = Logger.getInstance();

    contentDao = new ContentDao();

    constructor(domain) {
        this.domain = domain;
    }

    extract(url, html) {
        return this.readContent(html).then((article) => {
            let $ = cheerio.load(html);
            let extractFunction = this.domain.extractDataFunction;
            let content = null;
            if (extractFunction === null) {
                extractFunction = this.extractDataDefault;
            } else if(typeof extractFunction !== 'function') {
                throw new ProcessorError(false, 'extractData option must be a function!', '');
            } else {
                try {
                    content = extractFunction($, url, this.domain, article, this.generateHash);
                } catch(e) {
                    throw new ProcessorError(false, 'extendQueue function error:' + e.message, e.stack);
                }
                if (typeof content['data'] !== 'undefined' && typeof content['hash'] === 'string') {
                    if (typeof content['data'] !== 'string') {
                        content['data'] = JSON.stringify(content['data']);
                    }
                    return this.contentDao.save(content.data, url, html, content.hash).then((extracted) => {
                        return { url, html, extracted };
                    });
                } else {
                    throw new ProcessorError(false, 'Wrong extracted data format. You must return object { data(any), hash(string:UNIQIE) }', '');
                    return { url, html, extracted: false };
                }
            }
        })
    }

    readContent(html) {
        return new Promise((resolve, reject) => {
            read(html, (err, article, meta) => {
                if (err) {
                    resolve({});
                } else {
                    delete article.document;
                    if (article.content !== false) {
                        article.content = article.content.text().replace(/\s\s+/g, ' ');   
                    }
                    resolve(article);
                }
            });
        });
    }

    extractDataDefault($, url, domain, article, generateHash) {
        return {
            data: cleanText,
            hash: generateHash(cleanText)
        }
    }

    generateHash = (object) => {
        if (typeof object == 'undefined') {
            object = 'undefined';
            this.logger.warn('hash object can\'t be undefined!');
        } else if (typeof object !== 'string') {
            object = JSON.stringify(object);
        }
        return md5(object);
    }
}

export default ContentService;