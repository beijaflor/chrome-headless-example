const chrome = require('chrome-remote-interface')

exports.getUA = function () {
  chrome.Version().then(
    (version) => console.log(version['User-Agent'])
  )
}
