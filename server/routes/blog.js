import { Router } from 'express'
import BlogPost from '../models/BlogPost.js'

const router = Router()

// GET /api/blog — list published posts, paginated, newest first
router.get('/', async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1)
    const limit = Math.min(20, parseInt(req.query.limit) || 9)
    const category = req.query.category

    const filter = { published: true }
    if (category && category !== 'all') filter.category = category

    const [posts, total] = await Promise.all([
      BlogPost.find(filter)
        .select('-content')  // Don't send full content in list view
        .sort({ publishedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      BlogPost.countDocuments(filter),
    ])

    res.json({
      posts,
      total,
      page,
      pages: Math.ceil(total / limit),
      hasMore: page * limit < total,
    })
  } catch (err) {
    next(err)
  }
})

// GET /api/blog/categories — list blog categories with post counts
router.get('/categories', async (req, res, next) => {
  try {
    const counts = await BlogPost.aggregate([
      { $match: { published: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ])
    res.json(counts.map((c) => ({ category: c._id, count: c.count })))
  } catch (err) {
    next(err)
  }
})

// GET /api/blog/:slug — single published post by slug
router.get('/:slug', async (req, res, next) => {
  try {
    const post = await BlogPost.findOne({
      slug: req.params.slug,
      published: true,
    }).lean()

    if (!post) return res.status(404).json({ error: 'Blog post not found' })

    // Fetch related posts (same category, excluding current)
    const related = await BlogPost.find({
      published: true,
      category: post.category,
      _id: { $ne: post._id },
    })
      .select('-content')
      .sort({ publishedAt: -1 })
      .limit(3)
      .lean()

    res.json({ post, related })
  } catch (err) {
    next(err)
  }
})

export default router
