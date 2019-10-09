// This is the scene editor page, which lists all of the captions for the current scene.

const m = require('mithril')

module.exports = {
  view: function(vnode) {
    console.log('vnode:', vnode)
    return m('', [
      m('h1', `Scene ${vnode.attrs.id}`),
      m('h2', 'List of captions'),
      m('.caption-list', vnode.attrs.captions.map(function(caption) {
        return m(m.route.Link, {
          class: 'caption-list-item',
          href: `/edit-caption/${caption.id}`,
        }, `Caption ${caption.id}`)
      }))
    ])
  }
}

