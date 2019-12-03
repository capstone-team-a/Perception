// This is the site's "splash page".

const m = require('mithril')
const Scene = require('../models/Scene')
var inputFile = null

module.exports = {
  view: function() {
    return m('.start', [
      m('.jumbotron.text-center', [
        m('h1', 'Welcome to Perception!'),
        m('p.lead', 'Caption generation will never be the same.')
      ]),
      m('.container', [        
        m('.row', [
          m('.col-sm', [
            m('h2', 'Create new project'),
            m('label', {
              for: 'language-input'
            }, 'Caption Format'),
            m('select.language-input', {
              id: 'language-input',
              onchange: function(e) {
                Scene.setInputFormat(e.target.value)
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
            m('button.new-scene-list.btn.btn-primary', {
              onclick: function() {
                Scene.checkExisitingSceneData(null)
              }
            }, 'New Scene List'),
          ]),
          
          m('.col-sm', [
            m('form.load-file-form', {
              onsubmit: function(e) {
                e.preventDefault()
                if (!inputFile) {
                  alert("Must select file to load from")
                } 
                else {
                  Scene.checkExisitingSceneData(inputFile)
                }
              }
            }, [
                m('h2', 'Load existing project from file'),
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
                m('button.load-file.btn.btn-primary[type=submit]', 'Load File'),
            ]),
          ]),
        ]),
        m('.row.justify-content-md-center.clear-cache-section', [
          m('.col-med-auto', [
            m('h4', 'Want to clear all existing data?'),
            m('button.clear-cache.btn.btn-danger.d-block.mx-auto', {
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
        ])
      ])
    ])
  }
}
