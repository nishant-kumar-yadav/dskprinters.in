import mongoose from 'mongoose'
import { slugify } from './Category.js'

const BLOG_CATEGORIES = ['general', 'dtf', 'uv-dtf', 'heat-transfer', 'industry', 'tutorials']

const blogPostSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true, trim: true },
    slug:        { type: String, unique: true, lowercase: true },
    excerpt:     { type: String, default: '', maxlength: 300 },
    content:     { type: String, required: true },
    coverImage:  { type: String, default: '' },
    category:    { type: String, enum: BLOG_CATEGORIES, default: 'general' },
    tags:        { type: [String], default: [] },
    author:      { type: String, default: 'DSK Printers' },
    published:   { type: Boolean, default: false },
    publishedAt: { type: Date },
    metaTitle:   { type: String, default: '' },
    metaDesc:    { type: String, default: '' },
    readTime:    { type: Number, default: 0 },
  },
  { timestamps: true }
)

// Auto-generate slug from title
blogPostSchema.pre('validate', function (next) {
  if (!this.slug && this.title) this.slug = slugify(this.title)
  next()
})

// Auto-calculate read time and set publishedAt before save
blogPostSchema.pre('save', function (next) {
  // Calculate read time (~200 words per minute)
  if (this.content) {
    const text = this.content.replace(/<[^>]*>/g, '') // strip HTML tags
    const words = text.trim().split(/\s+/).length
    this.readTime = Math.max(1, Math.ceil(words / 200))
  }
  // Auto-set excerpt from content if empty
  if (!this.excerpt && this.content) {
    const text = this.content.replace(/<[^>]*>/g, '')
    this.excerpt = text.slice(0, 250).trim() + (text.length > 250 ? '…' : '')
  }
  // Set publishedAt when first published
  if (this.published && !this.publishedAt) {
    this.publishedAt = new Date()
  }
  next()
})

blogPostSchema.index({ published: 1, publishedAt: -1 })
blogPostSchema.index({ category: 1, published: 1 })

export { BLOG_CATEGORIES }
export default mongoose.model('BlogPost', blogPostSchema)
