// This is the caption editor page, for filling in the details of a particular caption string

const m = require('mithril')
const Scene = require('../models/Scene')
const schema = require('../utils/captionFormSchema')
const formBuilder = require('../utils/formBuilder')

module.exports = {
  oninit: function(vnode) {
    // first set the current Scene, then set the current caption.
    Scene.setCurrentScene(vnode.attrs.sceneId)

    if (Scene.currentScene) {
      Scene.setCurrentCaption(vnode.attrs.captionId)      
    }
  },
  view: function(vnode) {
    if(!Scene.currentCaption) {
      return m('', [
        m(m.route.Link, {
  	      href: `/scenes`,
        }, 'Return To Scenes'),
        m('h1', '404 - Caption Not Found'),
      ])
    }
    return m('', [
      m(m.route.Link, {
        href: `/scenes/scene-${Scene.currentScene.id}`,
      }, 'Back To Scene'),
      m('h1', Scene.currentCaption.name ? Scene.currentCaption.name : `Caption ${Scene.currentCaption.id}`),
      formBuilder(schema),
    ])
  }
}
