import mongoose from 'mongoose'

const slugify = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true },
    image: { type: String, default: '' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
)

categorySchema.pre('validate', function (next) {
  if (!this.slug && this.name) this.slug = slugify(this.name)
  next()
})

export { slugify }
export default mongoose.model('Category', categorySchema)
