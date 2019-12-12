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
        Scene.currentCaption[item.attr] = item.type === 'checkbox' ? e.target.checked : e.target.value
		Scene.Dirty = true
      },
      value: Scene.currentCaption[item.attr] ? Scene.currentCaption[item.attr] : '',
      checked: Scene.currentCaption[item.attr]
    }
    
    return [
      item.type === 'text'
        ? m('.form-group', [
            m(`label`, {for: `${item.attr}-input`}, item.label),
            m(`input.${item.attr}-input.form-control[type=${item.type}]`, inputOptions),
          ])
        : item.type === 'checkbox'
        ? m('.form-group', [
            m(`input.${item.attr}-input.form-check-input[type=${item.type}]`, inputOptions),
            m(`label.form-check-label`, {for: `${item.attr}-input`}, item.label),
          ])
        : item.type === 'dropdown'
        ? m('.form-group', [
            m('label', {for: `${item.attr}-input`}, item.label),
            m('select.custom-select', inputOptions, item.options.map(option => m('option', option))),
          ])
        : null
    ]
  })


  // flatten the array-of-arrays into just 1 array
  const formItems = Array.prototype.concat.apply([], labelsAndInputs)

  return m('.container', [
    m('form.save-changes-form', {
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
		Scene.Dirty = false
      }
    }, [
      ...formItems,
      m("button.save-changes-button.btn.btn-success[type=submit]", 'Save all changes'),
    ]),
  ])
}

module.exports = formBuilder
