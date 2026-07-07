import { MessageCircle } from 'lucide-react'
import { COMPANY } from '../api.js'
import './widgets.css'

export default function WhatsAppButton() {
  return (
    <a
      href={`${COMPANY.whatsapp}?text=${encodeURIComponent('Hi DSK Printers, I want a quote.')}`}
      target="_blank"
      rel="noopener noreferrer"
      className="wa-fab"
      aria-label="Chat with DSK Printers on WhatsApp"
    >
      <MessageCircle size={26} aria-hidden="true" />
    </a>
  )
}
