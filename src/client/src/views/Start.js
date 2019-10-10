// This is the site's "splash page".

const m = require('mithril')

module.exports = {
  view: function() {
    return m('.start', [
      m('h1', 'Welcome'),
      m(m.route.Link, {
	href: '/scenes',
      }, 'New Scene List')
    ])
  }
}
