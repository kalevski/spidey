import { Scraper } from '../src';

let scraper = new Scraper({
    dataPath: './mined'
});

scraper.logger.onMessage.add((message, type, formattedMessage) => {
    console.log(formattedMessage);
});

scraper.scrape('anhoch', {
    target: 'http://www.anhoch.com/',
    ignoredParams: [],
    duplicateCheck: {
        query: true,
        hash: false
    },
    extractData: function($, url, domain, article, generateHash) {
        let extractedData = {
            category: $('#breadcrumbs > ul > li:nth-child(2) > a').text(),
            subCategory: $('#breadcrumbs > ul > li:nth-child(3) > a').text(),
            title: $('#product > div.box-stripes > div.box-heading > h3').text(),
            price: $('#product > div.box-stripes > div.box-content > section > div > div.span7 > div > div.price.product-price > div > span.nm').text(),
            article: article
        };
        return {
            data: extractedData,
            hash: generateHash(extractedData)
        };
    },
    extendQueue: function($, url, domain, extracted) {
        let list = [];
        $('a').each(function() {
            list.push(this.attribs.href)
        });
        return list;
    }
});





