const axios = require('axios');

module.exports = {
  beforeEach: client => {
    client.deleteCookies();
  },

  after: client => {
    client.end();
  },

  "extracts TNF products's href from Sportchek brand page": client => {
    getHrefs(
      client,
      'https://www.sportchek.ca/brands/the-north-face/shop-all.html',
      'tnf'
    );
  },

  "extracts Arcteryx products's href from Sportchek brand page": client => {
    getHrefs(
      client,
      'https://www.sportchek.ca/brands/arcteryx/shop-all.html',
      'arcteryx'
    );
  }
};

function getHrefs(client, url, brand) {
  client
    .url(url)
    .waitForElementVisible('.results-quantity')
    .pause(1000)
    .getText('.results-quantity', div => {
      const nbOfItems = parseInt(div.value.split(' ')[0]);
      const itemsGroup = nbOfItems / 16;

      for (let i = 1; i <= itemsGroup; i++) {
        client.getLocationInView('footer').pause(500);
      }

      client
        .waitForElementVisible(`[data-id="${nbOfItems - 8}"]`)
        .elements(
          'css selector',
          '.product-title .product-grid__link',
          result => {
            result.value.forEach(el => {
              client.elementIdAttribute(el.ELEMENT, 'href', el => {
                axios.post(
                  `https://scrapping-jc.firebaseio.com/sporting-life-${brand}.json`,
                  { href: el.value }
                );
              });
            });
          }
        );
    });
}
