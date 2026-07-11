import sharp from 'sharp'

sharp({
  create: {
    width: 400,
    height: 400,
    channels: 3,
    background: { r: 248, g: 250, b: 252 }
  }
})
.composite([{
  input: Buffer.from('<svg width="400" height="400"><text x="50%" y="50%" text-anchor="middle" fill="#94a3b8" font-size="24" font-family="sans-serif">No Image</text></svg>'),
  top: 0,
  left: 0
}])
.webp({ quality: 80 })
.toFile('../client/public/placeholder.webp')
.then(() => console.log('done'))
.catch(console.error)
