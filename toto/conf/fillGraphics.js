const fs = require('fs')
let package = require('../package.json')
let template = require('./template.json')

package.nodecg.graphics = [].concat(...template.routes.map(package => 
    package.pages.map(page => ({
        file: `${package.name}/${page.name}.html`,
        width: 1000,
        height: 500
    }))))

fs.writeFileSync('./package.json', JSON.stringify(package, null, '\t'))
