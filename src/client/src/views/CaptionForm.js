// This is the caption editor page, for filling in the details of a particular caption string

const m = require('mithril')
const Scene = require('../models/Scene')

module.exports = {
  oninit: function(vnode) {
    // first set the current Scene, then set the current caption.
    Scene.setCurrentScene(vnode.attrs.sceneId - 1)
    Scene.setCurrentCaption(vnode.attrs.captionId - 1)
  },
  view: function(vnode) {
    return m('', [
      m(m.route.Link, {
        href: `/scenes/scene-${Scene.currentScene.id}`,
      }, 'Back To Scene'),
      m('h1', Scene.currentCaption.name ? Scene.currentCaption.name : `Caption ${Scene.currentCaption.id}`),
      m('form.save-changes-form', {
        onsubmit: function(e) {
          e.preventDefault()
          Scene.saveCaptionName()
          Scene.saveCaptionText()
        }
      }, [
        m("input.new-name-input[type=text]", {
          oninput: function (e) {
            Scene.currentCaption.name = e.target.value
          },
            value: Scene.currentCaption.name ? Scene.currentCaption.name : `Caption ${Scene.currentCaption.id}`
        }),
        m('h2', `Text`),
        m("input.new-caption-text-input[type=text]", {
          oninput: function (e) {
            Scene.currentCaption.text = e.target.value
          },
          value: Scene.currentCaption.text ? Scene.currentCaption.text : ``
        }),
        m('h5', ``),
        m("button.save-changes-button[type=submit]", 'Save all changes'),
      ])
    ])
  }
}



