const axios = require('axios');

module.exports = {
  '@disabled': false,

  before: client => {
    client.url('https://www.sportchek.ca/brands/the-north-face/shop-all.html');
  },

  after: client => {
    client.end();
  },

  "extracts products's href from Sportchek brand page": client => {
    client
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
                  axios
                    .post(
                      'https://scrapping-jc.firebaseio.com/sporting-life-tnf.json',
                      { href: el.value }
                    )
                    .then(function(response) {
                      console.log(response);
                    })
                    .catch(function(error) {
                      console.log(error);
                    });
                });
              });
            }
          );
      });
  }
};
