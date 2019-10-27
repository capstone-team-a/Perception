// This is the site's "splash page".

const m = require('mithril')
const Scene = require('../models/Scene')
var inputFile

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
        ["CEA-608", "Teletext"].map(function(opt) {
          var object = Scene.getInputFormat()
          return m('option', {
            value: opt,
            selected: opt === object['input-format'] ? true : false
          }, opt)
        }) 
      ]),
      m(m.route.Link, {
	      href: '/scenes',
      }, 'New Scene List'),
      m('form.load-file-form', {
        onsubmit: function(e) {
          e.preventDefault()
          if(Scene.loadFromFile(inputFile)) {
            m.route.set('/scenes')
          } else {
            // TODO Give an error for broken JSON.
          }
        }
      }, [
        m('h3', 'Load From File'),
        m("label", {
            class: "file",
          },
          m("input", {
            onchange: function(e){
              inputFile = e.target.files[0]
            },
            accept: ".json",
            type: "file",
          }),
          m("span", {
            class: "file-custom",
          })
        ),
        m('button.load-file[type=submit]', 'Load File'),
      ]),
    ])
  }
}
