const template = require('../conf/template.json')

exports.addRoutes = function(app, nodecg){
    template.routes.forEach(route => {
        route.pages.forEach(page => {
            page.actions.forEach(action => addRoute(app, nodecg, 
                route.name, page, action))
        })
    })
}

function addRoute(app, nodecg, packageName, page, action){
    console.log('addRoute', packageName, page.name, action)
    let middleware = createHandlerReqRes(nodecg, packageName, page, action)
	app.post(`/${packageName}/${page.name}/${action}`, middleware)
}

const tokenSendMessage = '#'

function createHandlerReqRes(nodecg, packageName, page, action){ 
    return (req, res) => {
        console.log('request', packageName, page.name, action)
        
        let idGraphic = getIdGraphic(req.body)
        let template = page.template
        let graphicName
        if(idGraphic){
            graphic = page.graphics.find(graphic => graphic.name === idGraphic)
            if(graphic){
                template = graphic.template
                graphicName = graphic.name
            }
        }
            
        //console.log(idGraphic, template)
        //let graphicParam = template ? checkAndTransform(template, req.body) : req.body
        let graphicParam = req.body

        let messageName = `${packageName}${tokenSendMessage}${page.name}`
        if(graphicName) messageName += `${tokenSendMessage}${graphicName}`

        nodecg.sendMessage(messageName, graphicParam)
        
        res.send('OK')
	}
}

const pathGraphicId = template.idGraphic && template.idGraphic.split('.')

function getIdGraphic(requestBody){
    return pathGraphicId && 
        pathGraphicId.reduce((child, key) => child && child[key], requestBody)
}