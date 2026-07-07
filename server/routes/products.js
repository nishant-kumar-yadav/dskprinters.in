import { Router } from 'express'
import Product from '../models/Product.js'
import Category from '../models/Category.js'

const router = Router()

// GET /api/products — all products sorted by order
router.get('/', async (req, res, next) => {
  try {
    const products = await Product.find().sort({ order: 1, createdAt: -1 }).lean()
    res.json(products)
  } catch (err) {
    next(err)
  }
})

// GET /api/products/meta/categories — categories with product counts
router.get('/meta/categories', async (req, res, next) => {
  try {
    const [categories, counts] = await Promise.all([
      Category.find().sort({ order: 1, name: 1 }).lean(),
      Product.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]),
    ])
    const countMap = Object.fromEntries(counts.map((c) => [c._id, c.count]))
    res.json(
      categories.map((c) => ({
        ...c,
        productCount: countMap[c.slug] || 0,
      }))
    )
  } catch (err) {
    next(err)
  }
})

// GET /api/products/:slug — single product
router.get('/:slug', async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug }).lean()
    if (!product) return res.status(404).json({ error: 'Product not found' })
    res.json(product)
  } catch (err) {
    next(err)
  }
})

export default router
