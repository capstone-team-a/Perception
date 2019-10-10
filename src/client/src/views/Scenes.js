// This view is the "scene list", where all of the current project's scenes are displayed.
// Clicking on a scene will route the application to that scene's edit form, which is
// the list of captions in that scene.

const m = require('mithril')

const Scene = require('../models/Scene')

module.exports = {
  view: function() {
    return m('.scenes', [
      m('h1', 'Scenes'),
      m('button.add-scene', {onclick: Scene.addScene}, 'New Scene'),
      m('h2', 'List of scenes'),
      m('.scene-list', Scene.getScenes().map(function(scene) {
	console.log('scene object', scene)
	return m('a.scene-list-item', {onclick: function() {
	  m.route.set(`/edit-scene/${scene.id}`, {captions: scene.captions})}
	}, `Scene ${scene.id}`)
      }))
    ])
  }
}
