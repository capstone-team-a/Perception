// This is the scene editor page, which lists all of the captions for the current scene.

const m = require('mithril')

const Scene = require('../models/Scene.js')

module.exports = {
  view: function(vnode) {
    return m('', [
      m('h1', `Scene ${vnode.attrs.id}`),
      m('h2', 'List of captions'),
      m('.scene-list', Scene.getScenes().map(function(scene) {
        return m(m.route.Link, {
          class: 'scene-list-item',
          href: `/edit-scene/${scene.id}`,
          captions: scene.captions,
        }, `Scene ${scene.id}`)
      }))
    ])
  }
}

