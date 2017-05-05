const {ChromeLauncher} = require('lighthouse/lighthouse-cli/chrome-launcher')

exports.launchChrome = function (headless = true) {
  const launcher = new ChromeLauncher({
    port: 9222,
    autoSelectChrome: true,
    additionalFlags: [
      '--window-size=421,732',
      '--disable-gpu',
      (headless) ? '--headless' : ''
    ]
  })

  return launcher.run()
    .then(
      () => launcher
    )
    .catch(
      (err) => {
        return launcher.kill()
          .then(
            () => { throw err },
            console.error
          )
      }
    )
}
