import HttpClient from '../adapter/httpClient';
import ProcessorError from '../error/processorError';
import Logger from '../helper/logger';
import QueueDao from '../dao/queueDao';

class FetchService {

    queueDao = new QueueDao();

    client = new HttpClient();
    logger = Logger.getInstance();

    sleepSeconds = 15;
    attempts = 3;

    fetch(url) {
        this.logger.info('Start fetching data from: ' + url.href);
        return this.client.fetch('GET', url.href).then((html) => {
            this.attempts = 3;
            return { url, html };
        }).catch((error) => {
            this.logger.warn('Something is wrong with url:', url.href);
            this.attempts--;
            if (this.attempts === 0) {
                this.attempts = 3;
                return this.queueDao.markFinished(url, false).then(() => {
                    throw new ProcessorError(true, 'URL:' + url.href + ' is down!', '');
                })
            } else {
                this.logger.info('I will try again to fetch the same url in ' + this.sleepSeconds + ' seconds'); 
                return this.sleep();
            }
        }).then((data) => {
            if (data === 'try_again') {
                this.logger.warn('Unsuccessful fetch again :(');
                return this.fetch(url);
            } else {
                return data;
            }
        });
        
    }

    sleep() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve('try_again');
            }, this.sleepSeconds * 1000);
        });
    }
}

export default FetchService;