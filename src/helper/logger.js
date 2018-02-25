import { Signal } from 'signals';

class Logger {
    
    typeColor = {
        error: '\x1b[31m',
        warn: '\x1b[33m',
        info: '\x1b[32m',
        verbose: '\x1b[36m',
        debug: '\x1b[34m',
        silly: '\x1b[35m'
    }

    onMessage = new Signal();

    error(message) {
        this._log('error', arguments);
    }

    warn(message) {
        this._log('warn', arguments);
    }

    info(message) {
        this._log('info', arguments);
    }

    verbose(message) {
        this._log('verbose', arguments);
    }

    debug(message) {
        this._log('debug', arguments);
    }

    silly(message) {
        this._log('silly', arguments);
    }

    _log(type, args) {
        var args = Array.from(args);
        var message = '';
        for (var i = 0; i < args.length; i++) {
            var prefix = ' ';
            if (i == 0) prefix = '';
            if (typeof args[i] !== 'string') {
                var cache = [];
                message += prefix + '\n' + JSON.stringify(args[i], function(key, value) {
                    if (typeof value === 'object' && value !== null) {
                        if (cache.indexOf(value) !== -1) {
                            return;
                        }
                        cache.push(value);
                    }
                    return value;
                }, 3);
                cache = null;
            } else {
                message += prefix + args[i];
            }
        }

        this.onMessage.dispatch(message, type, this.formatMessage(message, type));
    }

    formatMessage(message, type) {
        let formatted = this.typeColor[type];
        formatted += '[SPIDEY][' + new Date(Date.now()).toLocaleString() + ']: ';
        formatted += message;
        formatted += '\x1b[37m';
        return formatted;
    }
  }

  var instance = null;
  Logger.getInstance = () => {
      if (instance === null) {
          instance = new Logger();
      }
      return instance;
}

export default Logger;
