import { Router } from 'express'
import GalleryItem from '../models/GalleryItem.js'

const router = Router()

// GET /api/gallery — all visible gallery items, grouped by section
router.get('/', async (req, res, next) => {
  try {
    const items = await GalleryItem.find({ visible: true })
      .sort({ order: 1, createdAt: -1 })
      .lean()

    // Group by section for frontend convenience
    const stories = items.filter((i) => i.section === 'story')
    const reels = items.filter((i) => i.section === 'reel')
    const gallery = items.filter((i) => i.section === 'gallery')

    // Group stories by storyGroup
    const storyGroups = {}
    for (const item of stories) {
      const group = item.storyGroup || 'uncategorized'
      if (!storyGroups[group]) storyGroups[group] = []
      storyGroups[group].push(item)
    }

    res.json({ stories, storyGroups, reels, gallery })
  } catch (err) {
    next(err)
  }
})

export default router
