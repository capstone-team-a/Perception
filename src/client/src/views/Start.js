// This is the site's "splash page".

const m = require('mithril')
const Scene = require('../models/Scene')
var inputFile = null

module.exports = {
  view: function() {
    return m('.start', [
      m('h1', 'Welcome!!'),
      m('label', {
        for: 'language-input'
      }, 'Caption Format'),
      m('select.language-input', {
        id: 'language-input',
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
          const format = Scene.getInputFormat()
          return m('option', {
            value: opt,
            selected: opt === format ? true : false
          }, opt)
        }) 
      ]),
      m(m.route.Link, {
	      href: '/scenes',
      }, 'New Scene List'),
      m('form.load-file-form', {
        onsubmit: function(e) {
          e.preventDefault()
          if (!inputFile) {
            alert("Must select file to load from")
          } else if(Scene.loadFromFile(inputFile)) {
            m.route.set('/scenes')
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
      m('button.clear-cache', {
        onclick: function() {
          //ask user for confirmation
          if (confirm("Clear cache?")) {
            //clear the local storage
            localStorage.clear()
            document.location.reload()
            //re-initialize the scene to get the structure back
            Scene.initialize()
          }
        }
      }, "Clear Cache"),
    ])
  }
}
