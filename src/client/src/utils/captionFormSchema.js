// this schema is used by formBuilder to create forms in a declarative way.

// each key in the schema represents an attribute
// each value in the schema is an object that contains:
//     1. A list of options for that attribute, if any. (for dropdowns, checkboxes, etc.)
//     2. The label name of that attribute
//     3. The type of the input. (dropdown, checkbox, text, etc.)


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
  }
}
