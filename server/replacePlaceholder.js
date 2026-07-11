import fs from 'fs'
import path from 'path'

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f)
    let isDirectory = fs.statSync(dirPath).isDirectory()
    isDirectory ? 
      walkDir(dirPath, callback) : callback(path.join(dir, f))
  })
}

let changedCount = 0
walkDir('../client/src', (file) => {
  if (file.endsWith('.jsx') || file.endsWith('.js')) {
    const content = fs.readFileSync(file, 'utf8')
    if (content.includes('/placeholder.jpg')) {
      const updated = content.replaceAll('/placeholder.jpg', '/placeholder.webp')
      fs.writeFileSync(file, updated, 'utf8')
      console.log(`Updated ${file}`)
      changedCount++
    }
  }
})
console.log(`Replaced in ${changedCount} files.`)
