import Database from '../adapter/database';

class ContentDao {

    database = Database.getInstance();

    save(data, url, html, hash) {
        return this.database.table.Content.create({
            data: data,
            url: url.href,
            hash: hash
        }).then(() => {
            return this.database.saveFile('mined-html', hash, html);
        }).catch((e) => {
            return false;
        }).then(() => {
            return true;
        });
    }

    getAll() {
        return this.database.table.Content.findAll();
    }

}

export default ContentDao;
