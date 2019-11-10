// This is the test file for the Scenes view

const mq = require('mithril-query')
const o = require('ospec')

const Scenes = require('../views/Scenes.js')
const Scene = require('../models/Scene.js')

o.spec('Scenes', function() {
  o('things are working', function() {

    // before we do anything we need to initialize the data model
    localStorage.clear()
    Scene.initialize()
    Scene.addScene()

    // render the Scenes view mithril-query
    var out = mq(Scenes)

    // here we are simply checking if it correctly renders the text we expected
    o(out.should.contain('List of scenes')).equals(true)

    // make sure that pressing a button actually adds a scene
    o(out.should.not.contain('Scene 2')).equals(true) // there should only be 0 scenes to start with
    out.click('.add-scene') // trigger a button click on the "add scene button"
    o(out.should.contain('Scene 2')).equals(true) // now there should be 1 scenes

    // testing the delete scene function
    Scene.deleteScene(2) // use the scene deleteFunction to delete a scene
    out = mq(Scenes) // rerender the scenes view mithril-query
    o(out.should.not.contain('Scene 2')).equals(true) // there should only be 0 scenes to end with
  })
})
