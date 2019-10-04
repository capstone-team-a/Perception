// This is the scene editor page, which lists all of the captions for the current scene.

const m = require('mithril')

module.exports = {
  view: function(vnode) {
    return m('', [
      m('h1', `Scene ${vnode.attrs.id}`),
      m('h2', 'List of captions')
      // TODO: map over list of captions to produce list of links to edit caption page
    ])
  }
}
