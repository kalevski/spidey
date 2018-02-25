import Database from '../adapter/database';
import UrlHelper from '../helper/url';

class QueueDao {

    database = Database.getInstance();

    save(url) {
        return this.database.table.Queue.create({
            href: url.href,
            hash: url.hash,
            after: url.after,
            finished: false,
            scraped: false
        }).then((response) => {
            return url;
        }).catch((error) => {
            return null;
        });
    }

    saveList(urlList) {
        var promises = [];
        for (let i = 0; i < urlList.length; i++) {
            let promise = this.database.table.Queue.findOne({
                where: {
                    hash: urlList[i].hash
                }
            }).then((result) => {
                if (result === null) {
                    return this.database.table.Queue.create({
                        href: urlList[i].href,
                        hash: urlList[i].hash,
                        after: urlList[i].after,
                        finished: false
                    });
                } else {
                    return true;
                }
            }).catch((err) => {
                return false;
            });
            
            promises.push(promise);
        }
        return Promise.all(promises);
    }

    markFinished(url, scraped) {
      return this.database.table.Queue.update({
        finished: true,
        scraped: scraped
      }, {
        where: {
          hash: url.hash
        }
      }).then(() => {
          return true;
      }).catch(() => {
          return false;
      });
    }

    getUnfinishedUrl() {
      return this.database.table.Queue.find({
        where: {
          finished: false
        }
      }).then((result) => {
        if (result !== null) {
          let url = new UrlHelper(result.dataValues.href);
          url.hash = result.dataValues.hash;
          url.after = result.dataValues.after;
          return Promise.resolve(url);
        } else {
          return Promise.resolve(null);
        }
      }).catch((err) => {
        console.error(err);
        return Promise.reject(err);
      })
    }
}

export default QueueDao;
