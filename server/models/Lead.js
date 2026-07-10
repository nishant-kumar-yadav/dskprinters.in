import mongoose from 'mongoose'

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    phone: { type: String, required: true, trim: true, maxlength: 15 },
    email: { type: String, default: '', trim: true, maxlength: 100 },
    source: {
      type: String,
      enum: [
        'quote_modal', 'contact_form', 'navbar_cta',
        'product_detail', 'product_card', 'bulk_pricing',
        'mobile_sticky_bar', 'hero_carousel', 'home_cta_band',
        'products_cta_band', 'cta_band', 'bottom_nav',
        'search_page_cta', 'seo_landing'
      ],
      default: 'contact_form',
    },
    product: { type: String, default: '', maxlength: 200 },
    productLink: { type: String, default: '', maxlength: 500 },
    productImage: { type: String, default: '', maxlength: 500 },
    quantity: { type: String, default: '', maxlength: 50 },
    message: { type: String, default: '', maxlength: 1000 },
    status: {
      type: String,
      enum: ['new', 'contacted', 'quoted', 'converted', 'lost'],
      default: 'new',
    },
    notes: { type: String, default: '', maxlength: 2000 },
  },
  { timestamps: true }
)

export default mongoose.model('Lead', leadSchema)
