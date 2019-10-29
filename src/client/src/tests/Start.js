const mq = require('mithril-query')
const o = require('ospec')

const Start = require('../views/Start.js')
const Scene = require('../models/Scene.js')

o.spec('Start', function(){
    o('things are working', function() {

        // Initialize the Scene data model
        Scene.initialize()

        // Reder the start view mithril-query
        var out = mq(Start)

        // Check if it correctly rendered the text and components that we need
        o(out.should.contain('Select your option')).equals(true)
        o(out.should.have.at.least(3, 'option')).equals(true)

        // When trigger select box and choose Teletext option, the option should
        // correctly saved into local storage
        out.trigger('select.language-input', 'onchange', {target: {value: "Teletext"}})
        var format = Scene.getInputFormat()
        o(format === 'Teletext').equals(true)

        // When trigger select box and choose CEA-608 option, local storage
        // should no longer contain Teletext option
        out.trigger('select.language-input', 'onchange', {target: {value: "CEA-608"}})
        var format = Scene.getInputFormat()
        o(format === 'Teletext').equals(false)
    })
})
