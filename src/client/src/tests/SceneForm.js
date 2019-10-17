// This is the test file for the SceneForm view

const mq = require('mithril-query')
const o = require('ospec')

const SceneForm = require('../views/SceneForm.js')
const Scene = require('../models/Scene.js')

o.spec('SceneForm', function() {
  o('things are working', function() {

    // before we do anything we need to initialize the data model
    Scene.initialize()

    // render the SceneForm view mithril-query
    // also passing in id as attrs because this view expects id as a route param
    // note this test will have to change if we ever get rid of the default scene in Scene.initialize
    var out = mq(SceneForm, {id: 1})

    // here we are simply checking if it correctly renders the text we expected
    o(out.should.contain('List of captions')).equals(true)

    // make sure that change name form changes the name in the view
    o(out.should.contain('First scene')).equals(true)
    out.setValue('.new-name-input', 'new name') // trigger an input in the input form
    o(out.should.not.contain('First scene')).equals(true)
    o(out.should.contain('new name')).equals(true)
    
    // make sure that change name form actually changes the name in the data model
    out.trigger('.save-name-form', 'onsubmit', {preventDefault: () => {}}) // trigger a submit event on the form
    o(Scene.getScenes().find(scene => scene.name === 'new name') !== undefined).equals(true)
  })
})
