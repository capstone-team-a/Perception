// This object represents the list of scenes which will be displayed on the scenes page and exported via HTTP to the server.
// Basically, this is our key "JSON object"
// We use localStorage for persistence
const Scene = {
  initialize: function() {
    // before initializing, make sure there isn't already data
    if (!localStorage.getItem('scene-list')) {
      // for now hard-coding in some example scenes
      localStorage.setItem('scene-list', JSON.stringify([{
        id: 1,
        name: 'First scene',
        captions: [{
          id: 1
        }]
      }, {
        id: 2,
        captions: []
      }]))
    }
  },

  getScenes: function() {
    return JSON.parse(localStorage.getItem('scene-list'))
  },

  addScene: function() {
    // get current list
    const list = JSON.parse(localStorage.getItem('scene-list'))

    // add new scene object
    list.push({
      id: list.length + 1,
      captions: []
    })
    localStorage.setItem('scene-list', JSON.stringify(list))
  },

  deleteScene: function(sceneid) {
    // decrease sceneid to match with JSON
    sceneid = sceneid - 1

    // get current list
    const list = JSON.parse(localStorage.getItem('scene-list'))

    // goto index at sceneid and take one element out
    list.splice(sceneid,1)

    // loop and fix id numbers
    for (var i = 0; i < list.length; i++) {
      list[i].id = i + 1
    }
    localStorage.setItem('scene-list', JSON.stringify(list))
  },

  // this function will save the current scene to the localStorage
  save: function() {
    const list = Scene.getScenes()

    // this is a check to make sure the value entered into start is a number
    const start_check = Number(Scene.current.start)
    if (isNaN(start_check)) {
      Scene.current.start = ``
    }

    // update the current scene in the scene list 
    list[Scene.current.id-1] = Scene.current

    localStorage.setItem('scene-list', JSON.stringify(list))
  },

  // this is useful to have as a way to manage a scene using global state
  current: null,

  // self-explanatory. Sets the currentScene property to the scene corresponding to the sceneId
  setCurrent: function(sceneId) {
    const list = Scene.getScenes()
    Scene.current = list[sceneId]
  }
}

module.exports = Scene
