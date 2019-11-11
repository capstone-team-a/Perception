// this schema is used by formBuilder to create forms in a declarative way.

// each key in the schema represents an attribute
// each value in the schema is an object that contains:
//     1. A list of options for that attribute, if any. (for dropdowns)
//         These are the options that the user is to select from.
//     2. The label name of that attribute. This is the label that will show up in the UI. It describes what the attribute is.
//     3. The type of the input. (dropdown, checkbox, text, etc.)
//     4. Optionally, a custom save function (for example to have custom validation logic).
//         This property should be called customSaveFn.

module.exports = {
  'name': {
    label: 'Caption Name',
    type: 'text',
    options: null
  },

  'text': {
    label: 'Caption String',
    type: 'text',
    options: null
  },

  'background_color': {
    label: 'Background Color',
    type: 'dropdown',
    options: ['White', 'Green', 'Blue', 'Cyan', 'Red', 'Yellow', 'Magenta', 'Black']
  },

  'underline': {
    label: 'Underline',
    type: 'checkbox',
    options: null
  }
}
