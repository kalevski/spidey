import { Scraper } from '../src';

let scraper = new Scraper({
    dataPath: './mined'
});

scraper.logger.onMessage.add((message, type, formattedMessage) => {
    console.log(formattedMessage);
});

scraper.scrape('amc', {
    target: 'https://www.amc.com.mk/',
    ignoredParams: [],
    duplicateCheck: {
        query: true,
        hash: false
    },
    extractData: function($, url, domain, article, generateHash) {
        let extractedData = {
            mainCategory: $('body > div.master-wrapper-page > div.master-wrapper-content > div.breadcrumb > ul > li:nth-child(2) > span:nth-child(1) > a > span').text(),
            subCategory: $('body > div.master-wrapper-page > div.master-wrapper-content > div.breadcrumb > ul > li:nth-child(3) > span:nth-child(1) > a > span').text(),
            specificCategory:  $('body > div.master-wrapper-page > div.master-wrapper-content > div.breadcrumb > ul > li:nth-child(4) > span:nth-child(1) > a > span').text(),
            title: $('#product-details-form > div > div.product-essential > div.overview > div.product-name > h1').text(),
            price: $('#product-details-form > div > div.product-essential > div.overview > div.prices > div > span').text(),
            article: article
        };

        try {
            extractedData.price = extractedData.price.match(/\d+/g);
            extractedData.price.pop();
            extractedData.price = extractedData.price.join('');
        } catch(e) { }

        return {
            data: extractedData,
            hash: generateHash($.html())
        };
    },
    extendQueue: function($, url, domain, extracted) {
        let list = [];
        $('a').each(function() {
            list.push($(this).attr('href') + '')
        });
        return list;
    }
});





