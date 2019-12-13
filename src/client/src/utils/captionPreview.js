const m = require('mithril')

module.exports = function getCaptionPreview(caption, stylized) {
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
    m('span.caption-preview', {
      style: (caption.text && stylized) ? css : null,
    }, caption.text ? caption.text : '-')
  ])  
}
