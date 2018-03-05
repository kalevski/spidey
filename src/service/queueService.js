import cheerio from 'cheerio';
import md5 from 'md5';
import Logger from '../helper/logger';
import ProcessorError from '../error/processorError';
import QueueDao from '../dao/queueDao';
import Url from '../helper/url';

class QueueService {
    
    domain = null;
    queueDao = new QueueDao();
    logger = Logger.getInstance();

    constructor(domain) {
        this.domain = domain;
    }
    
    firstPeek() {
        return this.queueDao.getUnfinishedUrl().then((url) => {
            if (url === null) {
                return this.queueDao.save(this.domain.url);
            } else {
                return url;
            }
        });
    }

    peek() {
        return this.queueDao.getUnfinishedUrl();
    }

    extend(url, html, extracted) {
        let $ = cheerio.load(html);
        let extendFunction = this.domain.extendQueueFunction;
        let urlList = null;
        if (extendFunction === null) {
            extendFunction = this.extendQueueDefault;
        } else if(typeof extendFunction !== 'function') {
            throw new ProcessorError(false, "extendQueue option must be a function!");
        } else {
            try {
                urlList = extendFunction($, url, this.domain, extracted);
            } catch(e) {
                throw new ProcessorError(false, "extendQueue function error:" + e.message, e.stack);
            }
            try {
                urlList = this.urlFilter(urlList, url.href);
            } catch(e) {
                throw new ProcessorError(false, 'You must return list of strings for extending queue!', '');
            }
            return this.queueDao.saveList(urlList).then(() => {
                return this.queueDao.markFinished(url, extracted);
            });

        }
    }
    
    extendQueueDefault($, url, domain, extracted) {
        let list = [];
        $('a').each(function() {
            list.push(this.attribs.href)
        });
        return list;
    }

    urlFilter(nextLinks, after) {
        let newList = [];
        let hashMap = {};
        for (let url of nextLinks) {
            let urlObject = new Url(url);
            if (urlObject.origin === null) {
                urlObject.setOrigin(this.domain.url.origin);
            }
            if (!(urlObject.protocol === 'http:' || urlObject.protocol === 'https:')) {
                continue;
            }
            if (urlObject.origin !== this.domain.url.origin) {
                continue;
            }
            urlObject.hash = this.domain.generateHash(urlObject);
            urlObject.after = after;
            if (typeof hashMap[urlObject.hash] === 'undefined') {
                hashMap[urlObject.hash] = 1;
                newList.push(urlObject);
            }
        }
        return newList;
    }
}

export default QueueService;