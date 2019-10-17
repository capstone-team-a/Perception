// This is the scene editor page, which lists all of the captions for the current scene.

const m = require('mithril')

module.exports = {
  view: function(vnode) {
    console.log('vnode:', vnode)
    // since captions come from route params, an empty array will not make it through. So we need to set it to be empty if it doesn't exist.
    // otherwise trying to map over the captions array will result in an error.
    const scene = vnode.attrs
    const captions = scene.captions ? scene.captions : []
    return m('', [
      m('h1', scene.name ? scene.name : `Scene ${scene.id}`),
      m('h2', 'List of captions'),
      m('.caption-list', captions.map(function(caption) {
        return m(m.route.Link, {
          class: 'caption-list-item',
          href: `/edit-caption/${caption.id}`,
        }, `Caption ${caption.id}`)
      }))
    ])
  }
}

