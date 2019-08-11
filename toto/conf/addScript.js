const cheerio = require('cheerio')
const fs = require('fs')
const path = require('path')
let template = require('./template.json')

const pathScript = __dirname + '/../public'
const pathGraphics = __dirname + '/../graphics'

const scripstHTML = fs.readdirSync(pathScript).reduce((acc, scriptName) =>
    scriptName.endsWith('.js') ? acc + `<script src="/bundles/toto/public/${scriptName}"></script>` : acc
, '') + "\n"

template.routes.forEach(package => {
    let packagePath = path.join(pathGraphics, package.name)
    if (!fs.existsSync(packagePath))
        throw `Package ${package.name} is declared in template but doesn't exist in ${packagePath}`
    if(!fs.statSync(packagePath).isDirectory())
        throw `Package ${package.name} is declared in template but isn't a directory in ${packagePath}`

    package.pages.forEach(page => {
        let pagePath = path.join(packagePath, page.name + '.html')
        if (!fs.existsSync(pagePath))
            throw `In package ${package.name}, the page ${page.name} is declared in template but doesn't exist in ${pagePath}`
        
        addScripts(pagePath, {
            package: package.name,
            page: page.name,
            graphics: page.graphics && page.graphics.map(graphic => graphic.name)
        })
    })
})

function addScripts(pathPage, props){
    fs.readFile(pathPage, (err, html) => {
        if (err) {
            throw err;
        }
        
        scriptPage = `
        <script>
            window.totoConf = ${JSON.stringify(props)}
        </script>
        ` + scripstHTML

        const $ = cheerio.load(html)
        
        const scripts = $('script')
        if (scripts.length) 
            scripts.first().before(scriptPage)
        else
            $('body').append(scriptPage)
            
        fs.writeFileSync(pathPage, $.html())
    })
}