import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

const imgDir = path.resolve('../client/public/images')

async function optimizeImages() {
  console.log('Optimizing images...')
  const files = fs.readdirSync(imgDir)
  
  for (const file of files) {
    if (file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg')) {
      const inputPath = path.join(imgDir, file)
      const parsed = path.parse(file)
      const outputPath = path.join(imgDir, `${parsed.name}.webp`)
      
      console.log(`Optimizing ${file} -> ${parsed.name}.webp`)
      
      await sharp(inputPath)
        .resize({ width: 800, withoutEnlargement: true }) // Resize large images
        .webp({ quality: 80 }) // 80% quality WebP is tiny but looks identical
        .toFile(outputPath)
        
      // Delete the original PNG to save space and force Vite to use webp
      fs.unlinkSync(inputPath) 
    }
  }
  console.log('Optimization complete!')
}

optimizeImages().catch(console.error)
