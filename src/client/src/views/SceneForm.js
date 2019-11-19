// This is the scene editor page, which lists all of the captions for the current scene.

const m = require('mithril')
const Scene = require('../models/Scene')

let showStylizedPreview = false

module.exports = {
  // on initialization of this component, set the current scene to the corresponding "current scene"
  oninit: function(vnode) {
    Scene.setCurrentScene(vnode.attrs.sceneId)
  },
  view: function(vnode) {
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
      m(m.route.Link, {
        href: '/scenes',
      }, 'Back To Scene List'),
      m('h1', Scene.currentScene.name ? Scene.currentScene.name : `Scene ${Scene.currentScene.id}`),
      m('form.save-changes-form', {
        onsubmit: function(e) {
          e.preventDefault()
          Scene.saveName()
          Scene.saveStart()
        }
      }, [
        m('label', {
          for: 'new-name-input'
        }, 'Scene Name'),
        m("input.new-name-input[type=text]", {
          id: 'new-name-input',
          oninput: function (e) {
            Scene.currentScene.name = e.target.value
          },
          value: Scene.currentScene.name ? Scene.currentScene.name : ''
        }),
        m('label', {
          for: 'new-start-input'
        }, 'Start'),
        m("input.new-start-input[type=text]", {
          id: 'new-start-input',
          oninput: function (e) {
            Scene.currentScene.start = e.target.value
          },
          value: Scene.currentScene.start ? Scene.currentScene.start : ``
        }),
        m("button.save-changes-button[type=submit]", 'Save all changes'),
      ]),
      m('button.add-caption', {
        onclick: function() {
          Scene.addCaption()
          Scene.saveCaptions()
        }
      }, 'New Caption'),
      m('label.show-stylized-preview', {for: `showStylizedPreview-input`}, 'Show Stylized Preview'),
      m('input#showStylizedPreview-input[type=checkbox]', {
        oninput: e => {
        showStylizedPreview = !showStylizedPreview
      }}),
      m('h2', 'List of captions'),
      m('.caption-list', captions.map(function(caption) {

        return m('div.caption-list-item', {key: caption.id}, [
          m('a', {
            onclick: function() {
              m.route.set(`/scenes/scene-${vnode.attrs.sceneId}/caption-${caption.id}`)
            }
          }, caption.name ? caption.name : `Caption ${caption.id}`),
          getCaptionPreview(caption),
          m('button.delete-caption-button', {
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

function getCaptionPreview(caption) {
  const foreground = caption.foreground_color
        ? caption.foreground_color === 'Italic White'
        ? 'white' : caption.foreground_color.toLowerCase()
        : 'black'

  const css =
`color: ${foreground};
background-color: ${caption.background_color ? caption.background_color.toLowerCase() : ''};
font-style: ${caption.foreground_color === 'Italic White' ? 'italic' : ''};
text-decoration: ${caption.underline ? 'underline' : ''};
`
  
  return m('span', [
    m('span', {style: 'margin-left: 1em;'}, 'Row:'),
    m('span.caption-preview', caption.row ? caption.row: '-'),
    m('span', {style: 'margin-left: 1em;'}, 'Caption String Preview:'),
    m('span.caption-preview', {
      style: (caption.text && showStylizedPreview) ? css : null,
    }, caption.text ? caption.text : '-')
  ])  
}
