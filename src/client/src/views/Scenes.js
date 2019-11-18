// This view is the "scene list", where all of the current project's scenes are displayed.
// Clicking on a scene will route the application to that scene's edit form, which is
// the list of captions in that scene.
const m = require('mithril')
const Scene = require('../models/Scene')
const getCaptionPreview = require('../utils/captionPreview')

let showStylizedPreview = false

module.exports = {
  oninit: function() {
    showStylizedPreview = false
  },
  view: function() {
    return m('.scenes', [
      m('h1', 'Scenes'),
      m('button.add-scene', {
        onclick: Scene.addScene
      }, 'New Scene'),
      m('button.export', {
        onclick: function() {
          Scene.exportToServer()
            .then(function(response) {
              alert('Successfully exported!')
            })
            .catch(function(e) {
              alert(`Error: response code ${e.code}, ${e.response.Error}`)
              console.dir(e)
            })
        }
      }, 'Export'),
      m('a.download-link', {
        download: 'scenes',
        href: Scene.getDownloadURL()
      }, 'Download JSON file'),

      m('form.append-file-form', {
        onsubmit: function(e) {
          e.preventDefault()
          if (!inputFile) {
            alert("Must select file to load from")
          } else {
            Scene.appendFromFile(inputFile, err => {
              if (err) {
                alert(err)
              } else {
                alert('Successfully appended file data to scene list.')
                // clear the input
                document.getElementById('appendFile').value = ''
                inputFile = null
                // redraw the DOM so we can see the new scenes
                m.redraw()
              }
            })
          }
        }
      }, [
        m('h3', 'Append Scenes From File'),
        m("label", {
            class: "file",
          },
          m("input#appendFile", {
            onchange: function(e){
              inputFile = e.target.files[0]
            },
            accept: ".json",
            type: "file",
          }),
          m("span", {
            class: "file-custom",
          })
        ),
        m('button.load-file[type=submit]', 'Load File'),
      ]),
      m('label.show-stylized-preview-scenes', {for: `showStylizedPreview-input`}, 'Show Stylized Preview'),
      m('input#showStylizedPreview-input[type=checkbox]', {
        oninput: e => {
        showStylizedPreview = !showStylizedPreview
      }}),
      m('h2', 'List of scenes'),
      m('.scene-list', Scene.getScenes()
        .map(function(scene) {
          return m('div.scene-list-item', {key: scene.id}, [
            m('a', {
              onclick: function() {
                m.route.set(`/scenes/scene-${scene.id}`)
              }
            }, scene.name ? scene.name : `Scene ${scene.id}`),
            getScenePreview(scene, showStylizedPreview),
            // when maping the scenes the delete button is included.
            m('button.delete-scene-button', {
              onclick: function() {
                //ask the user for confirmation.
                if (confirm("Are you sure?")) {
                  Scene.deleteScene(scene.id)
                }
              }
            }, 'Delete')
          ])
        })),

      m('button.delete-all-scenes', {
        onclick: function() {
          //ask the user for confirmation.
          if (confirm("Delete all scenes?")) {
            m('.scene-list', Scene.getScenes()
              .map(function(scene) {
                Scene.deleteScene(scene.id)
              })
            )
          }
        }
      }, 'Delete All Scenes'),

    ])
  }
}

function getScenePreview(scene, showStylizedPreview) {
  return m('span.scene-preview', [
    m('span', scene.start ? 'Start: ' + scene.start : 'Start: -'),
    m('span', {style: 'margin: 0 1em 0 1em;'}, scene.captions.length ? 'Caption String Preview:' : 'Caption String Preview: -'),
  ].concat(scene.captions.map(caption => {
    return getCaptionPreview(caption, showStylizedPreview)
  })))
}
