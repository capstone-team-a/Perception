const o = require("ospec")
const jsdom = require("jsdom")
const dom = new jsdom.JSDOM("", {
  pretendToBeVisual: true, // So we can get `requestAnimationFrame`
  url: 'https://example.org/', // So we get localStorage
})

// Fill in the globals Mithril needs to operate. Also, the first two are often
// useful to have just in tests.
global.window = dom.window
global.document = dom.window.document
global.requestAnimationFrame = dom.window.requestAnimationFrame
global.localStorage = dom.window.localStorage

// Require Mithril to make sure it loads properly.
require("mithril")

// And now, make sure JSDOM ends when the tests end.
o.after(function() {
  dom.window.close()
})
