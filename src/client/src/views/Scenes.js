// This view is the "scene list", where all of the current project's scenes are displayed.
// Clicking on a scene will route the application to that scene's edit form, which is
// the list of captions in that scene.
const m = require('mithril')

const Scene = require('../models/Scene')

module.exports = {
  view: function() {
    return m('.scenes', [
      m('h1', 'Scenes'),
      m('button.add-scene', {
        onclick: Scene.addScene
      }, 'New Scene'),
      m('button.export', {
        onclick: function() {
          Scene.exportToServer()
            .then(function(response) {
              alert('Successfully exported!')
            })
            .catch(function(e) {
              alert(`Error: response code ${e.code}, ${e.response.Error}`)
              console.dir(e)
            })
        }
      }, 'Export'),
      m('h2', 'List of scenes'),
      m('.scene-list', Scene.getScenes()
        .map(function(scene) {
          return m('div.scene-list-item', {key: scene.id}, [
            m('a', {
              onclick: function() {
                m.route.set(`/scenes/scene-${scene.id}`)
              }
            }, scene.name ? scene.name : `Scene ${scene.id}`),
            // when maping the scenes the delete button is included.
            m('button.delete-scene-button', {
              onclick: function() {
                //ask the user for confirmation.
                if (confirm("Are you sure?")) {
                  Scene.deleteScene(scene.id)
                }
              }
            }, 'Delete')
          ])
        })),

      m('button.delete-all-scenes', {
        onclick: function() {
          //ask the user for confirmation.
          if (confirm("Delete all scenes?")) {
            //get all the scenes and map an new anon function on them.
            //we need to put each scene into the _ param, which is unused.
            m('.scene-list', Scene.getScenes()
              .map(function(_) {
                //sort of silly- because when we delete a scene using
                //Scene.deleteScene it shifts all the Scene IDs, we just delete
                //the first scene every time (for the total num of scenes)
                Scene.deleteScene(1) //...which is why this is 1, not 'scene.id'
              })
            )
          }
        }
      }, 'Delete All Scenes'),

      m('button.clear-cache', {
        onclick: function() {
          //ask user for confirmation
          if (confirm("Clear cache?")) {
            //clear the local storage
            localStorage.clear()
            //re-initialize the scene to get the structure back
            Scene.initialize()
          }
        }
      }, "Clear Cache")
    ])
  }
}
