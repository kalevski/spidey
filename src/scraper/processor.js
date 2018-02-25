import { Signal } from 'signals';

import Domain from '../helper/domain';
import Logger from '../helper/logger';

import ContentService from '../service/contentService';
import QueueService from '../service/queueService';
import FetchService from '../service/fetchService';

class Processor {

    onFinish = new Signal();

    logger = Logger.getInstance();

    contentService = null;
    queueService = null;
    fetchService = null;

    stopped = false;

    start(options) {
        let domain = new Domain(options);
        this.contentService = new ContentService(domain);
        this.queueService = new QueueService(domain);
        this.fetchService = new FetchService();
        this.queueService.firstPeek().then((url) => {
            if (url === null) {
                this.execStop('I can\'t work on this project! It\'s already done!');
            } else {
                return this.crawlingStep(url);
            }
        }).catch((error) => {
            this.logger.error(error.message, error.stack);
            if (error['type'] === 'PROCESSOR_ERROR') {
                if (error.ignorable) {
                    return this.loop();
                } else {
                    this.execStop();
                }
            }
        });
    }

    stop() {
        this.stopped = true;
    }

    crawlingStep(url) {
        return this.fetchService.fetch(url)
        .then(({ url, html }) => this.contentService.extract(url, html))
        .then(({ url, html, extracted }) => this.queueService.extend(url, html, extracted))
        .then(() => this.loop());
    }

    loop() {
        if (this.stopped) {
            this.execStop();
        } else {
            return this.queueService.peek().then((url) => {
                if (url === null) {
                    this.execStop('There is no more job for me! Peace out!');
                } else {
                    return this.crawlingStep(url);
                }
            });
        }
    }

    execStop(message = null) {
        if(message !== null) {
            this.logger.info(message);
        } else {
            this.logger.warn('I\'m forced to stop!');
        }
        this.onFinish.dispatch();
    }
}

export default Processor;