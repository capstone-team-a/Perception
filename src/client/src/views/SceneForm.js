// This is the scene editor page, which lists all of the captions for the current scene.

const m = require('mithril')
const Scene = require('../models/Scene')

module.exports = {
  // on initialization of this component, set the current scene to the corresponding "current scene"
  oninit: function(vnode) {
    Scene.setCurrentScene(vnode.attrs.sceneId - 1)
  },
  view: function(vnode) {
    const captions = Scene.currentScene.captions
    
    return m('', [
      m(m.route.Link, {
        href: '/scenes',
      }, 'Back To Scene List'),
      m('h1', Scene.currentScene.name ? Scene.currentScene.name : `Scene ${Scene.currentScene.id}`),
      m('form.save-changes-form', {
        onsubmit: function(e) {
          e.preventDefault()
          Scene.saveName()
          Scene.saveStart()
        }
      }, [
        m("input.new-name-input[type=text]", {
          oninput: function (e) {
            Scene.currentScene.name = e.target.value
          },
          value: Scene.currentScene.name ? Scene.currentScene.name : ''
        }),
        m('h2', `Start`),
        m("input.new-start-input[type=text]", {
          oninput: function (e) {
            Scene.currentScene.start = e.target.value
          },
          value: Scene.currentScene.start ? Scene.currentScene.start : ``
        }),
        m('h5', ``),
        m("button.save-changes-button[type=submit]", 'Save all changes'),
      ]),
      m('button.add-caption', {
        onclick: function() {
          Scene.currentScene.captions.push({
            id : Scene.currentScene.captions.length + 1
          })
          Scene.saveCaptions()
        }
      }, 'New Caption'),
      m('h2', 'List of captions'),
      m('.caption-list', captions.map(function(caption) {

        return m('div.caption-list-item', {key: caption.id}, [
          m('a', {
            onclick: function() {
              m.route.set(`/scenes/scene-${vnode.attrs.sceneId}/caption-${caption.id}`)
            }
          }, caption.name ? caption.name : `Caption ${caption.id}`),
          m('button.delete-caption-button', {
            onclick: function() {
              //ask the user for confirmation.
              if (confirm("Are you sure?")) {
                Scene.deleteCaption(caption.id)
              }
            }
          }, 'Delete')
        ])
      })),
    ])
  }
}

