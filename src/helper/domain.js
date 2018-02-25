import { Signal } from 'signals';
import Url from './url';
import md5 from 'md5';

class Domain {

    url = null;
    ignoredParams = [];
    duplicateCheck = {
        query: true,
        hash: false
    };

    extendQueueFunction = null;
    extractDataFunction = null;

    constructor(options) {
        this.url = new Url(options['target']);
        this.ignoredParams = options['ignoredParams'] || this.ignoredParams;
        this.duplicateCheck = options['duplicateCheck'] || this.duplicateCheck;
        this.extendQueueFunction = options['extendQueue'] || this.extendQueueFunction;
        this.extractDataFunction = options['extractData'] || this.extractDataFunction;
        this.url.hash = this.generateHash(this.url);
    }

    generateHash(url) {
        var data = {};
        data['domain'] = url.domain;
        data['path'] = url.path;
        if (this.duplicateCheck.query) {
            var queries = {};
            for (let p in url.queryParams) {
                if (url.queryParams.hasOwnProperty(p)) {
                    var ignored = false;
                    for (let i = 0; i < this.ignoredParams.length; i++) {
                        if (this.ignoredParams[i] === p) {
                            ignored = true;
                            break;
                        }
                    }
                  if (!ignored) queries[p] = url.queryParams[p];
                }
            }
          data['queryParams'] = queries;
        }
        if (this.duplicateCheck.hash) {
            data['hash'] = url.hash;
        }
        return md5(JSON.stringify(data));
    }
}

export default Domain;
