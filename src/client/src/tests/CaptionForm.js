// This is the test file for the CaptionForm view

const mq = require('mithril-query')
const o = require('ospec')

const CaptionForm = require('../views/CaptionForm.js')
const Scene = require('../models/Scene.js')

o.spec('CaptionForm', function() {
  o('things are working', function() {

    // before we do anything we need to initialize the data model
    Scene.initialize()

    // also passing in the ids that the view expects as a route param
    var out = mq(CaptionForm, {sceneId: 1, captionId: 1})

    // here we are simply checking if it correctly renders the text we expected
    o(out.should.contain('Caption 1')).equals(true)

    // make sure that change name form changes the name in the view
    out.setValue('.new-name-input', 'new name') // trigger an input in the input form
    o(out.should.not.contain('Caption 1')).equals(true)
    o(out.should.contain('new name')).equals(true)
    
    // make sure that change name form actually changes the name in the data model
    out.trigger('.save-changes-form', 'onsubmit', {preventDefault: () => {}}) // trigger a submit event on the form
    o(Scene.currentScene.captions.find(caption => caption.name === 'new name') !== undefined).equals(true)

    // make sure that the text input changes the text
    out.setValue('.new-caption-text-input', 'hello') // trigger an input in the input form
    out.trigger('.save-changes-form', 'onsubmit', {preventDefault: () => {}}) // trigger a submit event on the form
    o(Scene.currentScene.captions.find(caption => caption.text === 'hello') !== undefined).equals(true)

    // check to make sure that the labels for input boxes exist
    o(out.should.have.at.least(2, 'label')).equals(true)
    o(out.should.contain('Caption name')).equals(true)
    o(out.should.contain('Text input')).equals(true)
  })
})
