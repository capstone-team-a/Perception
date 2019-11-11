const m = require('mithril')

// This object represents the list of scenes which will be displayed on the scenes page and exported via HTTP to the server.
// Basically, this is our key "JSON object"
// We use localStorage for persistence
const Scene = {
  initialize: function() {
    // before initializing, make sure there isn't already data
    if (!localStorage.getItem('scene-list')) {
      // for now hard-coding in some example scenes
      localStorage.setItem('scene-list', JSON.stringify([]))
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

  setScenes: function(scenes) {
    localStorage.setItem('scene-list', JSON.stringify(scenes))
  },

  getScenes: function() {
    return JSON.parse(localStorage.getItem('scene-list'))
  },

  findSceneIndex: function(sceneid) {
    // get current list
    const scene_list = Scene.getScenes()
    for (i = 0; i < scene_list.length; i++) {
      if (scene_list[i].id == sceneid) {
        return i
      }
    }

    return -1
  },

  addScene: function() {
    // get current list
    const scene_list = Scene.getScenes()
      // keeps tracks of id numbers in order to not crash into each other
    var scene_max_id = 0
    // Finds the max scene id in the list
    if (scene_list.length > 0) {
      for (i = 0; i < scene_list.length; i++) {
        if (scene_max_id < scene_list[i].id) {
          scene_max_id = scene_list[i].id
        }
      }
    }
    // add new scene object
    scene_list.push({
      id: scene_max_id + 1,
      start: null,
      captions: []
    })
    // saves the current list
    Scene.setScenes(scene_list)
  },

  deleteScene: function(sceneid) {
    // get current list
    const scene_list = Scene.getScenes()
    // loop and delete the scene at that instance in the scene
    const scene_index = Scene.findSceneIndex(sceneid)
    if (scene_index != -1) {
      scene_list.splice(scene_index,1)
      // saves the current list
      Scene.setScenes(scene_list)
    }
  },

  // this function will save the current scene to the localStorage
  saveCaptions: function() {
    const list = Scene.getScenes()

    // update the current scene in the scene list
    list[Scene.findSceneIndex(Scene.currentScene.id)].captions = Scene.currentScene.captions

    Scene.setScenes(list)
  },

  // this function will save the current scene name to the localStorage
  saveName: function() {
    const list = Scene.getScenes()

    // update the current scene in the scene list
    list[Scene.findSceneIndex(Scene.currentScene.id)].name = Scene.currentScene.name

    Scene.setScenes(list)
  },

// this function will save the current scene to the localStorage
  saveStart: function() {
    const list = Scene.getScenes()

    // this is a check to make sure the value entered into start is a number
    var start_check = 0, start_replace = ""
    if (Scene.currentScene.start) {
      start_replace = Scene.currentScene.start.replace(/\s/g, "")
      start_check = Number(start_replace)
    }
    if (isNaN(start_check) || !start_replace.length) {
      Scene.currentScene.start = null
    } else {
      var i;
      for (i = 0; i < list.length; i++) {
        if (list[i].start === null) {
          //do nothing
        } else if (Number(list[i].start) === start_check && i !== Scene.findSceneIndex(Scene.currentScene.id)) {
          Scene.currentScene.start = `Collision Detected`
        }
      }
    }
    // update the current scenes start in the scene list
    list[Scene.findSceneIndex(Scene.currentScene.id)].start = Scene.currentScene.start
    list.sort(function(a, b){
      if (b.start === null && a.start === null) {return 0} // If both are null don't touch anything
      if(b.start === null) {return -1} // undefined starts are sorted at the end
      if(a.start === null) {return 1} // undefined starts are sorted at the end
      if(Number(a.start) < Number(b.start)) {return -1} // a comes before b
      if(Number(b.start) < Number(a.start)) {return 1} // b comes before a
      return 0 // should never hit this case
    })
    Scene.setScenes(list)
  },

  // this is useful to have as a way to manage a scene using global state
  currentScene: null,

  // self-explanatory. Sets the currentScene property to the scene corresponding to the sceneId
  setCurrentScene: function(sceneId) {
    const list = Scene.getScenes()
    Scene.currentScene = list[Scene.findSceneIndex(sceneId)]
  },

  currentCaption: null,

  setCurrentCaption: function(captionId) {
    Scene.currentCaption = Scene.currentScene.captions[Scene.findCaptionIndex(captionId)]
  },

  findCaptionIndex: function (captionId) {
    for ( i = 0; i < Scene.currentScene.captions.length; i++) {
      if (Scene.currentScene.captions[i].id == captionId) {
        return i
      }
    }

    return -1
  },

  addCaption: function () {
    var caption_max_id = 0
    // Finds the max caption id in the list
    if (Scene.currentScene.captions.length > 0) {
      for (var i = 0; i < Scene.currentScene.captions.length; i++) {
        if (caption_max_id < Scene.currentScene.captions[i].id) {
          caption_max_id = Scene.currentScene.captions[i].id
        }
      }
    }
    // Adds a new caption
    Scene.currentScene.captions.push({
      id : caption_max_id + 1
    })
  },

  // saves the current caption with its new name to localStorage
  saveCaptionName: function() {
    const list = Scene.getScenes()

    list[Scene.findSceneIndex(Scene.currentScene.id)].captions[Scene.findCaptionIndex(Scene.currentCaption.id)].name = Scene.currentCaption.name

    Scene.setScenes(list)
  },

  // saves the current caption with its new text to localStorage
  saveCaptionText: function() {
    const list = Scene.getScenes()

    list[Scene.findSceneIndex(Scene.currentScene.id)].captions[Scene.findCaptionIndex(Scene.currentCaption.id)].text = Scene.currentCaption.text

    Scene.setScenes(list)
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
    list[Scene.findSceneIndex(Scene.currentScene.id)].captions.splice(indexToRemove, 1)

    Scene.setScenes(list)

    // also remove it from currentScene
    Scene.currentScene.captions.splice(indexToRemove, 1)

  },

  setInputFormat: function(format) {
    localStorage.setItem('input-format', JSON.stringify(format))
  },

  getInputFormat: function() {
    return JSON.parse(localStorage.getItem('input-format'))
  },

  jsonExtensionCheck: function(fileName) {
	// creating new string with the extension of the file.
    var check = fileName.substr(fileName.length - 4).toLowerCase()
    if (check !== 'json') {
      return false
    }
    return true
  },

  getFileName: function() {
    return JSON.parse(localStorage.getItem('file-name'))
  },

  exportToServer: function() {
    const payload = Scene.constructJSON()

    return m.request({
      method: 'POST',
      url: '/submit',
      body: payload
    })
  },

  // this function constructs the JSON payload in the format the server expects
  constructJSON: function() {
    const caption_format = Scene.getInputFormat()
    const scenes = Scene.getScenes().map(function(scene) {

      // using defualt values on these since the server requires non-null and non-undefined values at this time.
      // TODO: once the server no longer requires everything, get rid of these hardcoded default values
      return {
        scene_id: scene.id,
        scene_name: scene.name,
        start: {time: scene.start},
        position: {row: scene.position},
        caption_list: scene.captions.map(function(caption) {
          return {
            caption_id: caption.id,
            caption_name: caption.name,
            caption_string: caption.text,
            background_color: {color: caption.background_color},
            foreground_color: {color: caption.foreground_color},
            text_alignment: {placement: caption.text_alignment},
            underline: caption.underline,
            italics: caption.italics,
            opacity: caption.opacity,
          }
        })
      }
    })

    return {
      file_name: 'test_file',
      caption_format: caption_format,
      scene_list: scenes
    }
  },

  loadFromFile: function(inputFile) {
    if(!Scene.jsonExtensionCheck(inputFile.name)) {
      alert("File type to load from must be .json")
      return false
    }
    try {
	  var success = true
      var reader = new FileReader()
      var blob = inputFile.slice(0, inputFile.size)
      reader.onload = function(e) {
		try {
          success = Scene.loadSceneListFromFile(JSON.parse(e.target.result))
        } catch (error) {
          alert("JSON file was malformed.\n" + error)
		  success = false
        }
      }
      reader.onerror = function(e) {
        alert("There was an error while reading your file.")
		success = false
      }
      reader.readAsText(blob)
    } catch (error) {
      alert("Error while reading file. Please try again.\n Error info: " + error)
      success = false
    }
    if(success){
	  m.route.set('/scenes')
    }
  },
  
  loadSceneListFromFile: function(loadedData) {
	localStorage.setItem('file-name', JSON.stringify({
      'file-name': loadedData['file_name']
    }))
    if (loadedData['caption_format'] === "CEA-608") {
      var sceneList = []
      for (var i = 0; i < loadedData['scene_list'].length; i++) {
        newScene = Scene.load608SceneFromFile(loadedData['scene_list'][i])
        sceneList.push(newScene)
      }
      Scene.setScenes(sceneList)
	  Scene.setInputFormat(loadedData['caption_format'])
      return true
    } else {
      alert("The loaded Caption Format is not supported.")
      return false
	}
  },

  load608SceneFromFile: function(loadedScene, format) {
	// setting attributes default
	var scene_name = ''
	var start = ''
	var position = ''
    var captionList = []
	
	// initializing each caption by iterating throught the caption list
    for (var i = 0; i < loadedScene['caption_list'].length; i++) {
      newCaption = Scene.load608CaptionFromFile(loadedScene['caption_list'][i])
      captionList.push(newCaption)
    }
	
	//checking if each attribute is initialized
	if (loadedScene['scene_name']) {
      scene_name = loadedScene['scene_name']
	}
	if (loadedScene['start']) {
      start = loadedScene['start'].time.toString()
	}
	if (loadedScene['position']) {
      position = loadedScene['position'].row
	}
    return {
      id: loadedScene['scene_id'],
      name: scene_name,
      start: start,
      position: position,
      captions: captionList,
    }
  },

  load608CaptionFromFile: function(loadedCaption) {
	// setting default values of attributes.
	var caption_name = ''
	var caption_string = ''
	var background_color = ''
	var foreground_color = ''
	var text_alignment = ''
	var underline = false
	var italics = false
	var opacity = ''
	
	// checking if each attribute needed was passed in.
	if (loadedCaption['caption_name']) {
      caption_name = loadedCaption['caption_name']
	}
	if (loadedCaption['caption_string']) {
      caption_string = loadedCaption['caption_string']
	}
	if (loadedCaption['background_color']) {
      background_color = loadedCaption['background_color'].color
	}
	if (loadedCaption['foreground_color']) {
      foreground_color = loadedCaption['foreground_color'].color
	}
	if (loadedCaption['text_alignment']) {
      text_alignment = loadedCaption['text_alignment'].placment
	}
	if (loadedCaption['underline']) {
      underline = loadedCaption['underline']
	}
	if (loadedCaption['italics']) {
      italics = loadedCaption['italics']
	}
	if (loadedCaption['opacity']) {
      opacity = loadedCaption['opacity']
	}
	
    return {
      id: loadedCaption['caption_id'],
      name: caption_name,
      text: caption_string,
      background: background_color,
      foreground_color: foreground_color,
      alignment: text_alignment,
      underline: underline,
      italics: italics,
      opacity: opacity,
    }
  },

  // this creates a download link for a file containing the JSON
  getDownloadURL: function() {
    const blob = new Blob([JSON.stringify(Scene.constructJSON())], {type : 'application/json'})

    return URL.createObjectURL(blob)
  }
}



module.exports = Scene
