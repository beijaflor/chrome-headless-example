const {launchChrome} = require('./lib/launchChrome')
const capture = require('./lib/capture')
const utils = require('./lib/devToolUtils')

function args () {
  if (process.argv.length <= 2) {
    console.log('no url specified')
    process.exit(-1)
  }

  return process.argv[2]
}

function terminate (launcher) {
  launcher.kill()
  process.exit(125)
}

function main (url) {
  launchChrome(false).then((launcher) => {
    process.on('SIGINT', () => terminate(launcher))

    console.log(`start accessing url: ${url}`)
    utils.getUA()
    ;(async () => {
      await capture.capturePng(url)
      await capture.captureHtml(url)

      terminate(launcher)
    })()
  })
}

main(args())
