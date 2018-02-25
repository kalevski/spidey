import axios from 'axios';

class HttpClient {
    
    fetch(method, url, options) {
        let data = options || {};
        data['method'] = method;
        data['url'] = url;
        data['headers'] = data['headers'] || {};
        data['validateStatus'] = function (status) {
            return true;
        }
        return axios(data).then((response) => {
            return response.data;
        }).catch((error) => {
            throw error;
        });
    }
}

export default HttpClient;