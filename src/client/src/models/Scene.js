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

    if(!localStorage.getItem('input-format')) {
      localStorage.setItem('input-format', JSON.stringify({
        'input-format': 'Select your option'
      }))
    }

    if(!localStorage.getItem('file-name')) {
      localStorage.setItem('file-name', JSON.stringify({
        'file-name': ''
      }))
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
  saveCaptions: function() {
    const list = Scene.getScenes()

    // update the current scene in the scene list 
    list[Scene.currentScene.id-1].captions = Scene.currentScene.captions

    localStorage.setItem('scene-list', JSON.stringify(list))
  },

  // this function will save the current scene name to the localStorage
  saveName: function() {
    const list = Scene.getScenes()

    // update the current scene in the scene list 
    list[Scene.currentScene.id-1].name = Scene.currentScene.name

    localStorage.setItem('scene-list', JSON.stringify(list))
  },

  // this function will save the current scene to the localStorage
  saveStart: function() {
    const list = Scene.getScenes()

    // this is a check to make sure the value entered into start is a number
    const start_check = Number(Scene.currentScene.start)
    if (isNaN(start_check)) {
      Scene.currentScene.start = ``
    }

    // update the current scenes start in the scene list 
    list[Scene.currentScene.id-1].start = Scene.currentScene.start

    localStorage.setItem('scene-list', JSON.stringify(list))
  },

  // this is useful to have as a way to manage a scene using global state
  currentScene: null,

  // self-explanatory. Sets the currentScene property to the scene corresponding to the sceneId
  setCurrentScene: function(sceneId) {
    const list = Scene.getScenes()
    Scene.currentScene = list[sceneId]
  },

  currentCaption: null,

  setCurrentCaption: function(captionId) {
    Scene.currentCaption = Scene.currentScene.captions[captionId]
  },

  // saves the current caption with its new name to localStorage
  saveCaptionName: function() {
    const list = Scene.getScenes()

    list[Scene.currentScene.id-1].captions[Scene.currentCaption.id-1].name = Scene.currentCaption.name

    localStorage.setItem('scene-list', JSON.stringify(list))
  },

  // saves the current caption with its new text to localStorage
  saveCaptionText: function() {
    const list = Scene.getScenes()

    list[Scene.currentScene.id-1].captions[Scene.currentCaption.id-1].text = Scene.currentCaption.text

    localStorage.setItem('scene-list', JSON.stringify(list))
  },

  deleteCaption: function(captionId) {
    // look for the caption
    const indexToRemove = Scene.currentScene.captions.findIndex(function(caption) {
      return caption.id === captionId
    })

    // no caption was found that matches captionId
    if (captionId === -1) {
      console.log('Cannot find the caption you are trying to delete.')
      return
    }

    // we found the caption, so now we remove it
    const list = Scene.getScenes()
    list[Scene.currentScene.id-1].captions.splice(indexToRemove, 1)
    
    localStorage.setItem('scene-list', JSON.stringify(list))

    // also remove it from currentScene
    Scene.currentScene.captions.splice(indexToRemove, 1)

    // loop and fix id numbers
    for (var i = 0; i < Scene.currentScene.captions.length; i++) {
      Scene.currentScene.captions[i].id = i + 1
    }
  },

  setInputFormat: function(format) {
    const object = JSON.parse(localStorage.getItem('input-format'))
    object['input-format'] = format
    localStorage.setItem('input-format', JSON.stringify(object))
  },

  getInputFormat: function() {
    return JSON.parse(localStorage.getItem('input-format'))
  },

  setFileName: function(fileName) {
    var extensionCheck = fileName.split('.')
    if (extensionCheck[extensionCheck.length - 1].toLowerCase() !== 'json') {
      return false
    }
    const object = JSON.parse(localStorage.getItem('file-name'))
    object['file-name'] = extensionCheck[0]
    localStorage.setItem('file-name', JSON.stringify(object))
    return true
  },

  getFileName: function() {
    return JSON.parse(localStorage.getItem('file-name'))
  },

  loadFromFile: function(inputFile) {
    if(!Scene.setFileName(inputFile.name)) {
      return false
    }
    var reader = new FileReader()
    var blob = inputFile.slice(0, inputFile.size)
    reader.onloadend = function(e) {
      localStorage.setItem('file-data', e.target.result)
    }
    reader.readAsBinaryString(blob)
    const loadedData = JSON.parse(localStorage.getItem('file-data'))
    
    //TODO Load each item into local storage.
    return true
  }
}

module.exports = Scene
