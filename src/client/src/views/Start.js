// This is the site's "splash page".

const m = require('mithril')
const Scene = require('../models/Scene')

module.exports = {
  view: function() {
    return m('.start', [
      m('h1', 'Welcome!!'),
      m('select.language-input', {
        onchange: function(e) {
          Scene.setInputFormat(e.target.value)
          select = e.target.value
        }
      }, [
        m('option', {
          value: "Nothing",
          selected: "selected",
          disabled: "disabled"
        }, 'Select your option'),
        ["CEA_608", "Teletext"].map(function(opt) {
          const format = Scene.getInputFormat()
          return m('option', {
            value: opt,
            selected: opt === format ? true : false
          }, opt)
        }) 
      ]),
      m(m.route.Link, {
	      href: '/scenes',
      }, 'New Scene List')
    ])
  }
}
