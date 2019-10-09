// this is the root of the application.

const m = require('mithril')

// initialize models

const Scene = require('./models/Scene.js')
Scene.initialize()

// import the various views

const Start = require('./views/Start')
const Scenes = require('./views/Scenes')
const SceneForm = require('./views/SceneForm')
const CaptionForm = require('./views/CaptionForm')

// define routes, and map routes (urls) to views

m.route(document.body, '/start', {
  '/start': Start,
  '/scenes': Scenes,
  '/edit-scene/:id': {
    render: function(vnode) {
      return m(SceneForm, vnode.attrs)
    }
  },
  '/edit-caption/:id': {
    render: function(vnode) {
      return m(CaptionForm, vnode.attrs)
    }
  }
})
