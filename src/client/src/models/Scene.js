// This object represents the list of scenes which will be displayed on the scenes page and exported via HTTP to the server.
// Basically, this is our key "JSON object"
// We use localStorage for persistence

const Scene = {
  initialize: function() {
    // before initializing, make sure there isn't already data
    if (!localStorage.getItem('scene-list')) {
      // for now hard-coding in some example scenes
      localStorage.setItem('scene-list', JSON.stringify([{id: 1, captions: [{id: 1}]}, {id: 2, captions: []}]))
    }
  },

  getScenes: function() {
    return JSON.parse(localStorage.getItem('scene-list'))
  },

  addScene: function() {
    // get current list
    const list = JSON.parse(localStorage.getItem('scene-list'))

    // add new scene object
    list.push({id: list.length+1})
    localStorage.setItem('scene-list', JSON.stringify(list))
  }
}

module.exports = Scene
