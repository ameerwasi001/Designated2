const fs = require('fs')
const pluralize = require('pluralize');
const args = process.argv.slice(2);

const template = args[0]
const templateFile = fs.readFileSync(`./Templates/${template}.js`, 'utf8')

const data = {
    modelPath: "Provided by default",
    modelName: "Provided by default",
    Model: "Provided by default",
    model: "Provided by default",
    models: "Provided by default",
}

const fileVariables = Object.fromEntries([...templateFile.matchAll("<<(.*?)>>")].map(([_, varName]) => varName).filter(x => !Object.keys(data).includes(x)).map(v => [v, 'Defaults to null']))

console.log([...Object.entries(data), ['', ''], ...Object.entries(fileVariables)].map(([model, value]) => model == '' ? '' : `${model}: ${value}`).join("\n"))