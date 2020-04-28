#!/usr/bin/env osascript -l JavaScript

const app = Application.currentApplication()
app.includeStandardAdditions = true

const sh = app.doShellScript

function require(path) {
  if (!/\.js$/.test(path))
    path = path + '.js'
  const exports = {}
  const module = { exports }
  try {
    eval(
      String((() => {
        try {
          const handle = app.openForAccess(path)
          const contents = app.read(handle)
          app.closeAccess(path)
          return contents
        } catch (e) {
          console.log(`Error: ${path} is not exist.`)
          return
        }
      })())
        .replace(/export\s+default\s+/, 'exports.default =')
        .replace(/import\s+\*\s+as\s+(\w+)from\s+(['"`][./\w]+['"`])/, 'const $1 = require($2)')
        .replace(/import\s+([\w{}, ]+?)\s+from\s+(['"`][./\w]+['"`])/, (_, $1, $2) => {
          const imports = String($1).split(/\s*,\s*(?=\{)/)
            .map(item => {
              item = item.trim()
              if (/^\w+$/.test(item))
                return `default: ${item}`
              else
                return item.slice(1, -1)
            })
            .join(',')
          return `const {${imports}} = require(${$2})`
        })
        .replace(/export\s+(?:const|var|let|function)\s+(\w+)/, 'exports.$1=')
        .replace(/export\s+(\w+)/, 'exports.$1=$1')
    )
  } catch (e) {
    console.log( `${path}: ${e}`)
  }
  return module.exports
}

function run([file, ...argv]) {
  return require(file).default(argv)
}
