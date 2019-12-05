// This view is the "scene list", where all of the current project's scenes are displayed.
// Clicking on a scene will route the application to that scene's edit form, which is
// the list of captions in that scene.
const m = require('mithril')

const Scene = require('../models/Scene')
const getCaptionPreview = require('../utils/captionPreview')

let showStylizedPreview = false
let expandAll = false

module.exports = {
  oninit: function(vnode) {
    Scene.setFileName()
    showStylizedPreview = false
    expandAll = false
  },
  view: function() {
    return m('.scenes', [
      m('.jumbotron', [
        m('h1', Scene.fileName ? Scene.fileName : 'Scenes'),
        m('p.lead', 'Scenes contain lists of captions. Create a new scene or load existing scenes from a file.'),
        m('hr.my-4'),
        m('p', 'Using the bar at the top, export the current scene list to compile to byte pairs, or download the JSON file which can be imported back.')
      ]),
      m('nav.navbar.navbar-expand.navbar-dark.bg-dark.fixed-top', [
        m('ul.navbar-nav.mr-auto', [
          m('li.nav-item', [
            m(m.route.Link, {
              href: `/start`,
              class: 'nav-link',
            }, 'Back to Start'),
          ]),

          m('li.nav-item', [
            m('a.nav-link', {
              download: 'scenes',
              href: Scene.getDownloadURL()
            }, 'Download JSON file'),
          ]),

          m('li.nav-item', [
            m('button.btn.my-2.my-sm-0.btn-outline-success', {
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
          ]),
        ]),
      ]),
      
      m('.container-fluid.scene-utility', [
        m('.row', [
          m('.col-sm', [
	        m('form.save-changes-form', {
              onsubmit: function(e) {
                e.preventDefault()
      		  Scene.saveFileName()
              }
            }, [
              m('h3', 'File Name'),
              m('label', {
                for: 'file-name-input'
               }, ''),
              m("input.file-name-input.form-control.col-sm-8[type=text]", {
                id: 'file-name-input',
                oninput: function (e) {
                  Scene.fileName = e.target.value
                },
                value: Scene.fileName ? Scene.fileName : ''
               }),
              m("button.save-file-name-button.btn.btn-success[type=submit]", 'Save')
            ]),
          ]),
          m('.col-sm', [
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
              m('button.load-file.btn.btn-primary[type=submit]', 'Load File'),
            ]),
          ])
        ]),
      ]),

      m('h2.m-4', 'Scene List'),
      m('.container', [
        m('.row', [
          m('.col-sm-4', [
            m('button.add-scene.btn.btn-success', {
              onclick: Scene.addScene
            }, 'Add New Scene'),
          ]),
          m('.col-sm.show-stylized-preview', [
            m('input#showStylizedPreview-input.form-check-input[type=checkbox]', {
              oninput: e => {
                showStylizedPreview = !showStylizedPreview
              },
              checked: showStylizedPreview
            }),
            m('label.show-stylized-preview.form-check-label', {for: `showStylizedPreview-input`}, 'Show Stylized Preview'),
          ]),
          m('.col-sm.expand-all', [
            m('input#expand-all-input.form-check-input[type=checkbox]', {
              oninput: e => {
                expandAll = !expandAll
              },
              checked: expandAll
            }),
            m('label.expand-all.form-check-label', {for: `expand-all-input`}, 'Expand All'),
          ]),
        ]),
      ]),
        m('.scene-list.mt-4', Scene.getScenes()
          .map(function(scene) {
            return m('div.scene-list-item', {key: scene.id}, [
              m(m.route.Link, {
                href: `/scenes/scene-${scene.id}`,
              }, scene.name ? scene.name : `Scene ${scene.id}`),
              m('span.left-1', scene.start ? 'Start: ' + scene.start : 'Start: -'),
              m('span.left-1', `number of captions: ${scene.captions.length}`),
              m('button.btn.btn-outline-primary.left-1', {
                'data-target': `#collapse-${scene.id}`,
                'data-toggle': 'collapse',
              }, 'show/hide captions'),
              getSceneCaptionsPreview(scene),
              // when maping the scenes the delete button is included.
                m('button.duplicate-scene-button.btn.btn-success', {
                onclick: function() {
                  Scene.duplicateScene(scene.id)
                }
              }, 'Duplicate'),
                m('button.delete-scene-button.btn.btn-danger', {
                onclick: function() {
                  //ask the user for confirmation.
                  if (confirm("Are you sure?")) {
                    Scene.deleteScene(scene.id)
                  }
                }
              }, 'Delete')
            ])
          })),


      m('button.delete-all-scenes.btn.btn-danger', {
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

function getSceneCaptionsPreview(scene) {
  return m(`div.scene-preview.collapse${expandAll ? '.show' : ''}#collapse-${scene.id}`, [
    m('div', 'Captions:'),
    m('ul', [
      scene.captions.map(caption => {
        return m('li', [
          m(m.route.Link, {
            href: `/scenes/scene-${scene.id}/caption-${caption.id}`,
            style: 'margin-right: 1em',
          }, caption.name ? caption.name : 'caption ' + caption.id),
          m('span', `id: ${caption.id}`),
          m('span', `row: ${caption.row ? caption.row : 'none'}`),
          m('span', `col: ${caption.column ? caption.column : 'none'}`),
          m('span', `text-preview:`),
          getCaptionPreview(caption, showStylizedPreview),
        ])
      })
    ])
  ])
}
