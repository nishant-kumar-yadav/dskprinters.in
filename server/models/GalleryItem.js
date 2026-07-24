import mongoose from 'mongoose'

const galleryItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    caption: { type: String, default: '' },
    url: { type: String, required: true },           // Cloudinary URL (image or video)
    thumbnail: { type: String, default: '' },         // Poster/thumbnail for videos
    type: { type: String, enum: ['image', 'video'], default: 'image' },
    section: {
      type: String,
      enum: ['story', 'reel', 'gallery'],             // Which section this item belongs to
      default: 'gallery',
    },
    storyGroup: { type: String, default: '' },        // e.g. "printing", "qc", "packing" — groups story slides
    category: { type: String, default: 'all' },       // Filter tab: uv-dtf, dtf, apparel, labels, factory
    linkedProduct: { type: String, default: '' },     // Product slug to link "Get Quote" to
    order: { type: Number, default: 0 },
    visible: { type: Boolean, default: true },
    // Instagram source tracking
    source: { type: String, enum: ['manual', 'instagram'], default: 'manual' },
    instagramId: { type: String, default: '' },            // IG media ID for dedup
    instagramPermalink: { type: String, default: '' },     // Link back to IG post
    instagramChildIndex: { type: Number, default: -1 },    // Carousel child index (-1 = not a carousel child)
  },
  { timestamps: true }
)

galleryItemSchema.index({ section: 1, order: 1 })
galleryItemSchema.index({ section: 1, storyGroup: 1 })
galleryItemSchema.index({ instagramId: 1 }, { sparse: true })

export default mongoose.model('GalleryItem', galleryItemSchema)
