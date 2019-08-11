'use strict'

const app = require('express')()
const bodyParser = require('body-parser')
const {addRoutes} = require('./routes')

module.exports = function (nodecg) {
	
	app.use(bodyParser.json())
	
	addRoutes(app, nodecg)

	nodecg.mount(app)
}
