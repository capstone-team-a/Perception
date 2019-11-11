const m = require('mithril')
const Scene = require('../models/Scene')

function formBuilder(schema) {
  // each key in the schema represents an attribute
  // each value in the schema is an object that contains:
  //     1. A list of options for that attribute, if any. (for dropdowns, checkboxes, etc.)
  //     2. The label name of that attribute
  //     3. The type of the input. (dropdown, checkbox, text, etc.)

  const attributes = Object.keys(schema)
  const attributeAndOptions = attributes.map(attribute => {
    return {
      attr: attribute,
      options: schema[attribute].options,
      label: schema[attribute].label,
      type: schema[attribute].type
    }
  })

  const labelsAndInputs = attributeAndOptions.map(item => {

    const inputOptions = {
      id: `${item.attr}-input`,
      oninput: e => {
        Scene.currentCaption[item.attr] = e.target.value
      },
      value: Scene.currentCaption[item.attr] ? Scene.currentCaption[item.attr] : ''
    }
    
    return [
      m('label', {for: `${item.attr}-input`}, item.label),
      item.type === 'text'
        ? m(`input.${item.attr}-input[type=${item.type}]`, inputOptions)
        : item.type === 'dropdown'
        ? m('select', inputOptions, item.options.map(option => m('option', option)))
        : null
    ]
  })

  // flatten the array-of-arrays into just 1 array
  const formItems = Array.prototype.concat.apply([], labelsAndInputs)

  return m('form.save-changes-form', {
    onsubmit: e => {
      e.preventDefault()
      // call the save function for each attribute
      attributeAndOptions.forEach(item => {
        if (item.customSaveFn) {
          item.customSaveFn()
        } else {
          Scene.saveCaptionAttr(item.attr) 
        }
      })
    }
  }, [
    ...formItems,
    m("button.save-changes-button[type=submit]", 'Save all changes'),
  ])
}

module.exports = formBuilder
