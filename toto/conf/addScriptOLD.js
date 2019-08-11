const cheerio = require('cheerio')
const fs = require('fs')
const path = require('path')

const pathScript = __dirname + '/../public'

const scripstHTML = fs.readdirSync(pathScript).reduce((acc, scriptName) =>
    scriptName.endsWith('.js') ? acc + `<script src="/bundles/toto/public/${scriptName}"></script>` : acc
, '') + "\n"


const pathGraphics = __dirname + '/../graphics'

fs.readdirSync(pathGraphics).forEach(packageName => {
    let packagePath = path.join(pathGraphics, packageName)
    if(fs.statSync(packagePath).isDirectory())
        fs.readdirSync(packagePath).forEach(pageName => {
            let pagePath = path.join(packagePath, pageName)
            if(!fs.statSync(pagePath).isDirectory()
                && pageName.indexOf('.') !== -1 
                && pageName.substring(pageName.lastIndexOf('.')) === '.html')
                addScripts(pagePath)
        })
})


function addScripts(pathPage){
    fs.readFile(pathPage, (err, html) => {
        if (err) {
            throw err;
        }
        
        scriptPage = `
        <script>
            window.totoConf = 
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