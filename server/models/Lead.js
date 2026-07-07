import mongoose from 'mongoose'

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    phone: { type: String, required: true, trim: true, maxlength: 15 },
    email: { type: String, default: '', trim: true, maxlength: 100 },
    source: {
      type: String,
      enum: ['quote_modal', 'contact_form', 'navbar_cta'],
      default: 'contact_form',
    },
    product: { type: String, default: '', maxlength: 200 },
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
