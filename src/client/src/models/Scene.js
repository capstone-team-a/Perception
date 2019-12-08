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
      localStorage.setItem('input-format', JSON.stringify('Select your option'))
    }

    if(!localStorage.getItem('file-name')) {
      localStorage.setItem('file-name', JSON.stringify('Scenes'))
	  Scene.fileName = 'Scenes'
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

    // add new scene object
	new_scene = {
      id: Scene.uniqueSceneId(),
      start: null,
      captions: []
    }
    scene_list.push(new_scene)
    // saves the current list
    Scene.setScenes(scene_list)
	m.route.set('/scenes/scene-' + new_scene.id)
  },

  uniqueSceneId: function() {
    const scene_list = Scene.getScenes()
    let scene_max_id = 0
    // Finds the max scene id in the list
    if (scene_list.length > 0) {
      for (let i = 0; i < scene_list.length; i++) {
        if (scene_max_id < scene_list[i].id) {
          scene_max_id = scene_list[i].id
        }
      }
    }

    return scene_max_id + 1
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

  reloadScene: false,

  duplicateScene: function(sceneid) {
    const scene_list = Scene.getScenes()
    const scene_index = Scene.findSceneIndex(sceneid)
    if (scene_index == -1) {
      alert("Scene Does not Exist")
    } else {
      // Using JSON to Deep Copy Object
      const new_scene = JSON.parse(JSON.stringify(scene_list[scene_index]))
      new_scene.id = Scene.uniqueSceneId()
      new_scene.start = null
      scene_list.push(new_scene)
      // saves the current list
      Scene.setScenes(scene_list)
      Scene.reloadScene = true
  	m.route.set('/scenes/scene-' + new_scene.id)
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
          Scene.currentScene.start = null
          alert('Collision detected. Choose a different start value.')
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
	new_caption = {
      id : caption_max_id + 1,
      background_color: 'Black',
      foreground_color: 'White',
    }
    // Adds a new caption
    Scene.currentScene.captions.push(new_caption)
	Scene.saveCaptions()
	m.route.set('/scenes/scene-' + Scene.currentScene.id + '/caption-' + new_caption.id)
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

  checkInputFormat: function() {
    if(Scene.getInputFormat() === 'Select your option')
      return true
    else
      return false
  },

  alertAndRouteToStart: function() {
    alert('Please specify a caption format before proceeding to scene list')
    m.route.set('/start')
  },

  // This function will mimicking the overloading behavior of C++ functions
  // The 'obj' argument is an optional parameter
  isCaptionFormatSet: function(obj) {
    if(Scene.checkInputFormat()) {
      Scene.alertAndRouteToStart()
    }
    else {
      if(typeof obj !== "undefined")
        return obj
    }
  },
  isSceneDatainUse: function() {
    if (Number(Scene.getScenes().length) !== 0) {
      alert("Going to start page could result in loss of data")
    }
  },
  jsonExtensionCheck: function(fileName) {
	// creating new string with the extension of the file.
    var check = fileName.substr(fileName.length - 4).toLowerCase()
    if (check !== 'json') {
      return false
    }
    return true
  },

  fileName: null,

  getFileName: function() {
    return JSON.parse(localStorage.getItem('file-name'))
  },

  setFileName: function() {
    Scene.fileName = JSON.parse(localStorage.getItem('file-name'))
  },

  saveFileName: function() {
    localStorage.setItem('file-name', JSON.stringify(Scene.fileName))
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
        caption_list: scene.captions.map(function(caption) {
          return {
            caption_id: caption.id,
            caption_name: caption.name,
            caption_string: caption.text,
            background_color: {
			  color: caption.background_color ? caption.background_color: ''
			},
            foreground_color: {
			  color: caption.foreground_color ? caption.foreground_color: ''
			},
            position: {
			  row: caption.row ? caption.row: '' ,
			  column: caption.column ? caption.column: ''
			},
            underline: caption.underline,
            transparency: caption.transparency,
          }
        })
      }
    })

    return {
      file_name: Scene.getFileName(),
      caption_format: caption_format,
      scene_list: scenes
    }
  },

  checkExisitingSceneData: function(inputFile) {
    if (Number(Scene.getScenes().length) === 0) {
      if (inputFile === null) {
        m.route.set(`/scenes`)
      } else {
        Scene.loadFromFile(inputFile)
      }
    } else {
      if (confirm("Overwrite exisiting Scene List Data?")) {
        localStorage.setItem('scene-list', JSON.stringify([]))
        if (inputFile === null) {
          m.route.set(`/scenes`)
        } else {
          Scene.loadFromFile(inputFile)
        }
      } else {
        m.route.set(`/scenes`)
      }
    }
  },

  loadFromFile: function(inputFile) {
    if(!Scene.jsonExtensionCheck(inputFile.name)) {
      alert("File type to load from must be .json")
      return false
    }
    try {
      var reader = new FileReader()
      var blob = inputFile.slice(0, inputFile.size)
      reader.onload = function(e) {
		    try {
          if(Scene.loadSceneListFromFile(JSON.parse(e.target.result))) {
	          m.route.set('/scenes')
		      }
        } catch (error) {
          alert("JSON file was malformed.\n" + error)
        }
      }
      reader.onerror = function(e) {
        alert("There was an error while reading your file.")
      }
      reader.readAsText(blob)
    } catch (error) {
      alert("Error while reading file. Please try again.\n Error info: " + error)
    }
  },

  loadSceneListFromFile: function(loadedData) {
	  localStorage.setItem('file-name', JSON.stringify(loadedData['file_name']))
    Scene.setFileName()
    var isValidCaptionFormat = Scene.checkCaptionFormatOfLoadedFile(loadedData)
    if(isValidCaptionFormat === true) {
      var sceneList = []
      for (var i = 0; i < loadedData['scene_list'].length; i++) {
        newScene = Scene.load608SceneFromFile(loadedData['scene_list'][i])
        sceneList.push(newScene)
      }
      Scene.setScenes(sceneList)
	    Scene.setInputFormat(loadedData['caption_format'])
      return true
    } else {
      return false
	  }
  },
  checkCaptionFormatOfLoadedFile: function(loadedData) {
    if(loadedData['caption_format'] === "CEA-608") {
      return true
    } else if (!loadedData.hasOwnProperty('caption_format')) {
      alert("The file doesn't have a Caption Format field. Please specify a caption format in your file before proceeding.")
      return false
    } else if(loadedData['caption_format'] === "" || loadedData['caption_format'] === null) {
      alert("Caption format is not specified. Please specify a caption format in your file before proceeding.")
      return false
    } else {
      alert("The file contains unsupported caption format.")
      return false
    }
  },

  load608SceneFromFile: function(loadedScene, format) {
	// setting attributes default
	var scene_name = ''
	var start = ''
    var captionList = []

  if (!(loadedScene['scene_id'])){
    throw "Each scene must have a Scene ID."
  }
  if (loadedScene['scene_id'] === parseInt(loadedScene['scene_id'], 10) && (loadedScene['scene_id'] < 0 || loadedScene['scene_id'] > Number.MAX_SAFE_INTEGER)){
    throw "A Scene ID was out of the supported range."
  }

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

    return {
      id: loadedScene['scene_id'],
      name: scene_name,
      start: start,
      captions: captionList,
    }
  },

  load608CaptionFromFile: function(loadedCaption) {
	// setting default values of attributes.
	var caption_name = ''
	var caption_string = ''
	var background_color = ''
	var foreground_color = ''
	var row = ''
	var column = ''
	var underline = false
	var transparency = ''

	// checking if each attribute needed was passed in.
    
  if (!(loadedCaption['caption_id'])){
    throw "All captions must have a Caption ID."
  }
  if (loadedCaption['caption_id'] === parseInt(loadedCaption['caption_id'], 10) && (loadedCaption['caption_id'] < 0 || loadedCaption['caption_id'] > Number.MAX_SAFE_INTEGER)){
    throw "A Caption ID was out of the supported range."
  }

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
	if (loadedCaption['position']) {
      row = loadedCaption['position'].row
	  column = loadedCaption['position'].column
	}
	if (loadedCaption['transparency']) {
      transparency = loadedCaption['transparency']
	}

    return {
      id: loadedCaption['caption_id'],
      name: caption_name,
      text: caption_string,
      background_color: background_color,
      foreground_color: foreground_color,
      row: row,
      column: column,
      underline: underline,
      transparency: transparency,
    }
  },

  // this creates a download link for a file containing the JSON
  getDownloadURL: function() {
    const blob = new Blob([JSON.stringify(Scene.constructJSON())], {type : 'application/json'})

    return URL.createObjectURL(blob)
  },

  // generic save function for saving an attribute without any custom validation
  // this is used to save a variable attribute so you don't have to know what attribute you are trying to save.
  // currently it is used by the formBuilder so it can call the correct save function for each attribute.
  saveCaptionAttr: function (attr) {
    const list = Scene.getScenes()

    list[Scene.findSceneIndex(Scene.currentScene.id)].captions[Scene.findCaptionIndex(Scene.currentCaption.id)][attr] = Scene.currentCaption[attr]
    list[Scene.findSceneIndex(Scene.currentScene.id)].captions.sort(function(a, b){
      if (!b.row && !a.row) {return 0} // If both are null don't touch anything
      if(!b.row) {return -1} // undefined starts are sorted at the end
      if(!a.row) {return 1} // undefined starts are sorted at the end
      if(Number(a.row) < Number(b.row)) {return -1} // a comes before b
      if(Number(b.row) < Number(a.row)) {return 1} // b comes before a
      return 0 // should never hit this case
    })
    Scene.setScenes(list)
  },

  loadFile: function(file, cb) {
    if(!Scene.jsonExtensionCheck(file.name)) {
      return cb("File type to load from must be .json")
    }

      const reader = new FileReader()
      const blob = file.slice(0, file.size)
      reader.onload = function(e) {
		try {
          const fileData = JSON.parse(e.target.result)
          return cb(null, fileData)
        } catch (error) {
          return cb("JSON file was malformed.\n" + error)
        }
      }
      reader.onerror = function(e) {
        return cb("There was an error while reading your file.")
      }

      reader.readAsText(blob)
  },

  appendFromFile: function(file, cb) {
    Scene.loadFile(file, (err, fileData) => {
      if (err) {
        return cb(err)
      }

      if (fileData.caption_format !== Scene.getInputFormat()) {
        return cb(`Caption format of file (${fileData.caption_format}) doesn't match expected format (${Scene.getInputFormat()})`)
      }

      if (!fileData.scene_list || !Array.isArray(fileData.scene_list)) {
        return cb(`File doesn't contain a valid 'scene_list'.`)
      }

      const newScenes = fileData.scene_list.forEach(scene => {
        Scene.appendScene(scene)
      })

      return cb(null)
    })
  },

  // similar to addScene, except this function takes in scene data instead of creating an empty scene.
  // This funciton is used in the appendFromFile function.
  appendScene: function(scene) {
    const scene_list = Scene.getScenes()

    // add new scene object
    scene_list.push({
      id: Scene.uniqueSceneId(),
      name: scene.scene_name,
      start: null,
      captions: scene.caption_list.map(caption => {
        return Scene.load608CaptionFromFile(caption)
      })
    })
    // saves the current list
    Scene.setScenes(scene_list)
  },

  moveCaptionUp: function(index) {
    const captionToMove = Scene.currentScene.captions[index]
    Scene.currentScene.captions[index] = Scene.currentScene.captions[index-1]
    Scene.currentScene.captions[index-1] = captionToMove
    Scene.saveCaptions()
  },

  moveCaptionDown: function(index) {
    const captionToMove = Scene.currentScene.captions[index]
    Scene.currentScene.captions[index] = Scene.currentScene.captions[index+1]
    Scene.currentScene.captions[index+1] = captionToMove
    Scene.saveCaptions()
  },
}


module.exports = Scene
