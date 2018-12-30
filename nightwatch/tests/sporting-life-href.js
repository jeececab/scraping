const axios = require('axios');

module.exports = {
  before: client => {
    this.database = 'https://scrapping-jc.firebaseio.com'
    this.brands = ['the-north-face', 'arcteryx', 'mountain-hardwear'];
    this.brands.forEach(brand => {
      axios.delete(
        `${this.database}/sporting-life-${brand}.json`
      );
    });
  },

  after: client => {
    client.end();
  },

  "extracts the products's href from Sportchek selected brand pages": client => {
    this.brands.forEach(brand => {
      client
        .url(`https://www.sportchek.ca/brands/${brand}/shop-all.html`)
        .waitForElementVisible('.results-quantity')
        .pause(1000)
        .getText('.results-quantity', div => {
          const nbOfItems = parseInt(div.value.split(' ')[0]);
          const itemsGroup = nbOfItems / 16;
          console.log(
            `Hrefs extaction for ${brand} is in progress, please wait...`
          );
          for (let i = 1; i <= itemsGroup + 2; i++) {
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
                      `${this.database}/sporting-life-${brand}.json`,
                      { href: el.value }
                    );
                  });
                });
                console.log(`Hrefs extaction for ${brand} is done`);
              }
            );
        });
    });
  }
};
