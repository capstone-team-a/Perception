// This is the scene editor page, which lists all of the captions for the current scene.

const m = require('mithril')
const Scene = require('../models/Scene')
const getCaptionPreview = require('../utils/captionPreview')

let showStylizedPreview = false

module.exports = {
  // on initialization of this component, set the current scene to the corresponding "current scene"
  oninit: function(vnode) {
    Scene.setCurrentScene(vnode.attrs.sceneId)
    // showStylizedPreview = false
  },
  view: function(vnode) {
    if (Scene.reloadScene) {
      document.location.reload()
    }

    if(!Scene.currentScene) {
      return m('', [
        m(m.route.Link, {
  	      href: `/scenes`,
        }, 'Return To Scenes'),
        m('h1', '404 - Scene Not found'),
      ])
    }

    const captions = Scene.currentScene.captions

    return m('', [
      m('nav.navbar.navbar-expand.navbar-dark.bg-dark.fixed-top', [
        m('ul.navbar-nav.mr-auto', [
          m('li.nav-item', [
            m(m.route.Link, {
              href: `/scenes`,
              class: 'nav-link',
            }, 'Back to Scene List'),
          ]),


          m('li.nav-item', [
              m('button.btn.my-2.my-sm-0.btn-outline-success', {
                onclick: function() {
                  Scene.duplicateScene(Scene.currentScene.id)
                }
              }, 'Duplicate'),
            ]),
        ]),
      ]),
      m('h1.jumbotron', Scene.currentScene.name ? Scene.currentScene.name : `Scene ${Scene.currentScene.id}`),
      m('.container', [
        m('.row', [
          m('.col-sm', [
            m('h3', 'Edit scene'),
          ]),
        ]),
        m('form.save-changes-form', {
          onsubmit: function(e) {
            e.preventDefault()
            Scene.saveName()
            Scene.saveStart()
          }
        }, [
          m('.form-group', [
            m('label', {
              for: 'new-name-input'
            }, 'Scene Name'),
            m("input.new-name-input.form-control[type=text]", {
              id: 'new-name-input',
              placeholder: 'Scene ' + Scene.currentScene.id,
              oninput: function (e) {
                Scene.currentScene.name = e.target.value
              },
              value: Scene.currentScene.name ? Scene.currentScene.name : ''
            }),
          ]),
          m('.form-group', [
            m('label', {
              for: 'new-start-input'
            }, 'Start'),
            m("input.new-start-input.form-control[type=text]", {
              id: 'new-start-input',
              oninput: function (e) {
                Scene.currentScene.start = e.target.value
              },
              value: Scene.currentScene.start ? Scene.currentScene.start : ``
            }),
          ]),
          m("button.save-changes-button.btn.btn-success[type=submit]", 'Save all changes'),
        ]),
      ]),

      m('h2.m-4', 'Caption List'),
      m('.container', [
        m('.row', [
          m('.col-sm', [
            m('button.add-caption.btn.btn-success', {
              onclick: function() {
                Scene.addCaption()
                Scene.saveCaptions()
              }
            }, 'Add New Caption'),
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
        ]),
      ]),

      m('.caption-list.mt-4', captions.map(function(caption, captionIndex) {
        const upArrow = isUpArrowEnabled(captions, caption, captionIndex)
        const downArrow = isDownArrowEnabled(captions, caption, captionIndex)

        return m('div.caption-list-item', {key: caption.id}, [
          m('i.arrow-up', {
            class: upArrow ? 'arrow-enabled' : 'arrow-disabled',
            onclick: upArrow ? e => {Scene.moveCaptionUp(captionIndex)} : () => {},
          }),
          m('i.arrow-down', {
            class: downArrow ? 'arrow-enabled' : 'arrow-disabled',
            onclick: downArrow ? e => {Scene.moveCaptionDown(captionIndex)} : () => {},
          }),
          m(m.route.Link, {
            href: `/scenes/scene-${vnode.attrs.sceneId}/caption-${caption.id}`
          }, caption.name ? caption.name : `Caption ${caption.id}`),
          getCaptionPreview(caption, showStylizedPreview),
          m('button.delete-caption-button.btn.btn-danger', {
            onclick: function() {
              //ask the user for confirmation.
              if (confirm("Are you sure?")) {
                Scene.deleteCaption(caption.id)
              }
            }
          }, 'Delete')
        ])
      })),
    ])
  }
}

function isUpArrowEnabled(captions, caption, index) {
  // the up arrow is only enabled if there is a caption with the same row value above the current caption.

  function getCaptionAbove(captions, index) {
    if (index === 0) return null

    return captions[index - 1]
  }

  const captionAbove = getCaptionAbove(captions, index)
  return captionAbove ? captionAbove.row === caption.row : false
}

function isDownArrowEnabled(captions, caption, index) {
  // the down arrow is only enabled if there is a caption with the same row value below the current caption.

  function getCaptionBelow(captions, index) {
    if (index === captions.length-1) return null

    return captions[index + 1]
  }

  const captionBelow = getCaptionBelow(captions, index)
  return captionBelow ? captionBelow.row === caption.row : false
}

