const ContactSeed = require('./contact');
const CableSeed = require('./cable');

module.exports = function() {
  return Promise.all([
    ContactSeed(),
    CableSeed()
  ]).then(() => {

  })
}
