// This is the scene editor page, which lists all of the captions for the current scene.

const m = require('mithril')
const Scene = require('../models/Scene')

module.exports = {
  // on initialization of this component, set the current scene to the corresponding "current scene"
  oninit: function(vnode) {Scene.setCurrent(vnode.attrs.id - 1)},
  view: function(vnode) {
    const captions = Scene.current.captions

    console.log('current scene:', Scene.current)
    console.log('all scenes:', Scene.getScenes())
    
    return m('', [
      m('h1', Scene.current.name ? Scene.current.name : `Scene ${Scene.current.id}`),
      m('form', {
        onsubmit: function(e) {
          e.preventDefault()
          Scene.save()
        }
      }, [
        m("input.input[type=text]", {
          oninput: function (e) {
            Scene.current.name = e.target.value
          },
          value: Scene.current.name ? Scene.current.name : `Scene ${Scene.current.id}`
        }),
        m("button.button[type=submit]", "Save")
      ]),
      m('h2', 'List of captions'),
      m('.caption-list', captions.map(function(caption) {
        return m(m.route.Link, {
          class: 'caption-list-item',
          href: `/edit-caption/${caption.id}`,
        }, `Caption ${caption.id}`)
      }))
    ])
  }
}

