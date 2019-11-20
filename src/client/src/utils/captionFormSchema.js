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

  'foreground_color': {
    label: 'Foreground Color',
    type: 'dropdown',
    options: ['White', 'Black', 'Green', 'Blue', 'Cyan', 'Red', 'Yellow', 'Magenta', 'Italic White']
  },

  'background_color': {
    label: 'Background Color',
    type: 'dropdown',
    options: ['Black', 'White', 'Green', 'Blue', 'Cyan', 'Red', 'Yellow', 'Magenta', 'None']
  },

  'underline': {
    label: 'Underlined',
    type: 'checkbox',
    options: null
  },

  'row': {
    label: 'Caption Position (Row)',
    type: 'dropdown',
    options: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]
  },

  'column': {
    label: 'Caption Position (Column)',
    type: 'dropdown',
    options: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]
  }
}
