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
    out.trigger('.save-changes-form', 'onsubmit', {preventDefault: () => {}}) // trigger a submit event on the form
    o(Scene.getScenes().find(scene => scene.name === 'new name') !== undefined).equals(true)

    // make sure that add caption button adds a new caption when triggered
    o(out.should.contain('New Caption')).equals(true)
    o(out.should.not.contain('Caption 2')).equals(true)
    out.click('.add-caption')
    o(out.should.contain('Caption 2')).equals(true)

    // testing the delete caption function
    Scene.deleteCaption(2) // use the scene deleteFunction to delete a scene
    out = mq(SceneForm, {id: 1}) // rerender the scenes view
    o(out.should.not.contain('Caption 2')).equals(true) // there should only be 2 scenes to end with

    // make sure that adding a negative number has the desired results
    out.setValue('.new-start-input', `-1`) // trigger an input in the input form
    out.trigger('.save-changes-form', 'onsubmit', {preventDefault: () => {}}) // trigger a submit event on the form
    o(Scene.getScenes().find(scene => scene.start === '-1') !== undefined).equals(true)

    // make sure that adding a positive  number has the desired results
    out.setValue('.new-start-input', '9000') // trigger an input in the input form
    out.trigger('.save-changes-form', 'onsubmit', {preventDefault: () => {}}) // trigger a submit event on the form
    o(Scene.getScenes().find(scene => scene.start === '9000') !== undefined).equals(true)

    // make sure that adding a float has the desired results
    out.setValue('.new-start-input', '9000.1') // trigger an input in the input form
    out.trigger('.save-changes-form', 'onsubmit', {preventDefault: () => {}}) // trigger a submit event on the form
    o(Scene.getScenes().find(scene => scene.start === '9000.1') !== undefined).equals(true)

    // make sure that adding a NaN has the desired results
    out.setValue('.new-start-input', 'IT\'S OVER 9000!!!') // trigger an input in the input form
    out.trigger('.save-changes-form', 'onsubmit', {preventDefault: () => {}}) // trigger a submit event on the form
    o(Scene.getScenes().find(scene => scene.start === 'IT\'S OVER 9000!!!') !== undefined).equals(false)
  })
})
