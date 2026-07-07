import mongoose from 'mongoose'
import { slugify } from './Category.js'

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true },
    category: { type: String, required: true }, // category slug
    price: { type: String, required: true }, // e.g. "₹2 / Piece"
    desc: { type: String, default: '' },
    image: { type: String, default: '' },
    specs: { type: Map, of: String, default: {} },
    inStock: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    tags: { type: [String], default: [] },
    applications: { type: [String], default: [] },
    alternateNames: { type: [String], default: [] },
  },
  { timestamps: true }
)

productSchema.pre('validate', function (next) {
  if (!this.slug && this.name) this.slug = slugify(this.name)
  next()
})

export default mongoose.model('Product', productSchema)
