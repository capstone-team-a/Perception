// This is the caption editor page, for filling in the details of a particular caption string

const m = require('mithril')

module.exports = {
  view: function(vnode) {
    return m('', [
      m('h1', `Caption ${vnode.attrs.id}`),
    ])
  }
}
