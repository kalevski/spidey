import parse from 'url-parse';

class Url {

    protocol = null;
    host = null;
    port = null;
    path = null;
    queryParams = {};
    hashtag = null;
    origin = null;
    href = null;

    hash = null;
    after = null;

    constructor(url) {
        this.parseUrl(url);
    }

    parseUrl(url) {
        let parsed = parse(url, true);
        this.protocol = parsed.protocol === '' ? null : parsed.protocol;
        this.host = parsed.host === '' ? null : parsed.host;
        this.port = parsed.port === '' ? null : parsed.port;
        this.path = parsed.pathname === '' ? null : parsed.pathname;
        this.queryParams = this.sortQueryParams(parsed.query);
        this.hashtag = parsed.hash === '' ? null : parsed.hash;
        this.origin = parsed.origin === 'null' ? null : parsed.origin;
        this.href = parsed.href;

        if (this.path === '/') {
            this.path = '';
        }
    }

    setOrigin(origin) {
        let url = '';
        url += origin;
        url += this.path !== null ? this.path : '';
        url += this.getQueryString();
        url += this.hashtag !== null ? this.hashtag : '';
        this.parseUrl(url);
    }

    getQueryString() {
        let string = "";
        let arr = Object.keys(this.queryParams);
        if (arr.length > 0) string = "?";
        for(let i = 0; i < arr.length; i++) {
            if (i !== 0) {
                string += "&";
            }
            string += arr[i] + '=' + this.queryParams[arr[i]];
        }
        return string;
    }

    sortQueryParams(queryParams) {
        let params = {};
        let keys = [];
        for (let k in queryParams) {
            if (queryParams.hasOwnProperty(k)) {
                keys.push(k);
            }
        }
        keys.sort();
        for (let i = 0; i < keys.length; i++) {
            params[keys[i]] = queryParams[keys[i]];
        }
        return params;
    }
}

export default Url;
