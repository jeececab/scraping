const axios = require('axios');

module.exports = {
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
    .getText('.results-quantity', div => {
      const nbOfItems = parseInt(div.value.split(' ')[0]);
      const itemsGroup = nbOfItems / 16;

      for (let i = 1; i <= itemsGroup; i++) {
        let elSel = i * 16 - 1;
        client
          .getLocationInView('footer')
          .waitForElementVisible(`[data-id="${elSel}"]`);
      }

      client
        .waitForElementVisible(`[data-id="${nbOfItems - 1}"]`)
        .pause(1000)
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
