import { Signal } from 'signals';
import Logger from '../helper/logger';
import ScraperStatus from '../enum/ScraperStatus';
import Processor from './processor';
import Database from '../adapter/database';

class Scraper {
    
    event = {
        onDone: new Signal(),
        onMessage: new Signal()
    };

    logger = Logger.getInstance();
    status = ScraperStatus.AVAILABLE;
    processor = new Processor();
    database = Database.getInstance();

    options = {};
    
    constructor(options = {}) {
        this.options = options;
    }

    scrape(name, options) {
        if (this.status === ScraperStatus.AVAILABLE) {
            this.status = ScraperStatus.BUSY;
            this.database.init(name, this.options['dataPath']).then(() => {
                this.processor.start(options);
            }).catch((error) => {
                this.logger.error(error.message, error.stack);
            });
            this.processor.onFinish.addOnce(() => {
                this.status = ScraperStatus.AVAILABLE;
                this.event.onDone.dispatch();
            });
        } else {
            this.logger.warn('SPIDEY INSTANCE IS BUSY!');
        }
    }

    stop() {
        if (this.status === ScraperStatus.BUSY) {
            this.processor.stop();
        }
    }
}

Scraper.Status = ScraperStatus;

export default Scraper;