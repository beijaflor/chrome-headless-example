const chrome = require('chrome-remote-interface')
const fs = require('fs')

exports.capturePng = function (url) {
  return new Promise((resolve, reject) => {
    chrome(async (devtools) => {
        try {
          await devtools.on('Network.requestWillBeSent', (message) => {
            console.log('request:', message.request.url)
          })

          await devtools.DOM.enable()
          await devtools.Network.enable()
          await devtools.Page.enable()

          await devtools.Page.navigate({url})
          await devtools.Page.loadEventFired()

          const { data } = await devtools.Page.captureScreenshot()
          fs.writeFileSync('capture.png', Buffer.from(data, 'base64'))
          console.log('png saved!')

          await devtools.DOM.disable()
          await devtools.Network.disable()
          await devtools.Page.disable()
          resolve()

        } catch (err) {
          reject(new Error(err))
        }
    }).on('error', () => {
      reject(new Error('Cannot connect to Chrome'))
    })
  })
}

exports.captureHtml = function (url) {
  return new Promise((resolve, reject) => {
    chrome(async (devtools) => {
      try {
        await devtools.on('Network.requestWillBeSent', (message) => {
          console.log('request:', message.request.url)
        })

        await devtools.DOM.enable()
        await devtools.Network.enable()
        await devtools.Page.enable()

        await devtools.Page.navigate({url})
        await devtools.Page.loadEventFired()

        const { root } = await devtools.DOM.getDocument()
        const { outerHTML } = await devtools.DOM.getOuterHTML({nodeId: root.nodeId})
        fs.writeFileSync('capture.html', outerHTML)
        console.log('html saved!')

        await devtools.DOM.disable()
        await devtools.Network.disable()
        await devtools.Page.disable()
        resolve()

      } catch (err) {
        reject(new Error(err))
      }
    }).on('error', () => {
      reject(new Error('Cannot connect to Chrome'))
    })
  })
}
