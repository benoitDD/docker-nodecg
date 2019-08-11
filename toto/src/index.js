const EventEmitter = require('events')

const myEmitter = new EventEmitter()

class Toto {
    on(){
        let callback
        let graphic
        if(arguments.length === 2){
            graphic = arguments[0]
            callback = arguments[1]
        } else
            callback = arguments[0]

        if(!callback)
            throw "Function 'on' must be a callback in first or second parameter"

        let graphics = window.totoConf.graphics
        if(graphic && (!graphics || !graphics.find(g => g === graphic)))
            throw `The graphic ${graphic} isn't present in template.${window.totoConf.package}.${window.totoConf.page}.graphics`
             + `(${graphics ? JSON.stringify(graphics) : 'none graphic in'})`

        graphic = graphic || '*'

        myEmitter.on(graphic, callback)
    }
}

window.toto = new Toto()

/*
let dataInWait = {
    page: [],
    graphic1: []
}
*/

let confPage = window.totoConf

let nameEventPage = `${confPage.package}#${confPage.page}`

nodecg.listenFor(nameEventPage, message => {
    console.log(`Message on *:`, message)
    /*
        if least a listener exist
            Emit in toto
        else 
            save and wait for emit that least a listener exist
    */
   myEmitter.emit('*', message)
});

(confPage.graphics || []).forEach(graphic => {
    nodecg.listenFor(`${nameEventPage}#${graphic}`, message => {
        console.log(`Message on ${graphic}:`, message)
    
        myEmitter.emit(graphic, message)
    })
})