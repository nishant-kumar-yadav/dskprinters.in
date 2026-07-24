/**
 * Instagram Graph API Service
 * Fetches media from a Business/Creator IG account and optionally
 * re-uploads to Cloudinary for permanent CDN storage.
 *
 * Required env vars:
 *   IG_ACCESS_TOKEN  — Long-lived user access token (60 days, auto-refreshed)
 *   IG_USER_ID       — Numeric Instagram Business Account ID
 */

import cloudinary, { cloudinaryEnabled } from '../config/cloudinary.js'

const IG_API_BASE = 'https://graph.instagram.com'

// Fields we request for each media object
const MEDIA_FIELDS = [
  'id',
  'media_type',       // IMAGE | VIDEO | CAROUSEL_ALBUM
  'media_url',        // Direct URL (expires after a few days)
  'thumbnail_url',    // Only for VIDEO type
  'caption',
  'timestamp',
  'permalink',
  'children{id,media_type,media_url,thumbnail_url}', // Carousel children
].join(',')

/**
 * Check if Instagram integration is configured
 */
export function isInstagramConfigured() {
  return !!(process.env.IG_ACCESS_TOKEN && process.env.IG_USER_ID)
}

/**
 * Fetch a page of media from the authenticated IG user.
 * @param {string} [cursor] - Pagination cursor for next page
 * @param {number} [limit=25] - Number of items per page (max 100)
 * @returns {{ data: Array, paging: Object }}
 */
export async function fetchInstagramMedia(cursor = null, limit = 25) {
  if (!isInstagramConfigured()) {
    throw new Error('Instagram not configured. Set IG_ACCESS_TOKEN and IG_USER_ID in .env')
  }

  const url = new URL(`${IG_API_BASE}/${process.env.IG_USER_ID}/media`)
  url.searchParams.set('fields', MEDIA_FIELDS)
  url.searchParams.set('limit', String(Math.min(limit, 100)))
  url.searchParams.set('access_token', process.env.IG_ACCESS_TOKEN)
  if (cursor) url.searchParams.set('after', cursor)

  const res = await fetch(url.toString())
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    const msg = err?.error?.message || `Instagram API error (${res.status})`
    const error = new Error(msg)
    error.status = res.status
    error.igError = err?.error
    throw error
  }

  return res.json()
}

/**
 * Fetch a single media item by its Instagram media ID.
 * @param {string} mediaId
 * @returns {Object} Media object with all fields
 */
export async function fetchInstagramMediaById(mediaId) {
  if (!isInstagramConfigured()) {
    throw new Error('Instagram not configured')
  }

  const url = new URL(`${IG_API_BASE}/${mediaId}`)
  url.searchParams.set('fields', MEDIA_FIELDS)
  url.searchParams.set('access_token', process.env.IG_ACCESS_TOKEN)

  const res = await fetch(url.toString())
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message || `Failed to fetch media ${mediaId}`)
  }

  return res.json()
}

/**
 * Refresh the long-lived access token (valid for 60 days).
 * Should be called periodically (e.g. every 50 days).
 * @returns {{ access_token: string, token_type: string, expires_in: number }}
 */
export async function refreshAccessToken() {
  if (!process.env.IG_ACCESS_TOKEN) {
    throw new Error('No IG_ACCESS_TOKEN to refresh')
  }

  const url = new URL(`${IG_API_BASE}/refresh_access_token`)
  url.searchParams.set('grant_type', 'ig_refresh_token')
  url.searchParams.set('access_token', process.env.IG_ACCESS_TOKEN)

  const res = await fetch(url.toString())
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message || 'Failed to refresh IG token')
  }

  const data = await res.json()
  // Update in-memory (the admin should also update .env for persistence)
  process.env.IG_ACCESS_TOKEN = data.access_token
  return data
}

/**
 * Download a media file from Instagram and re-upload to Cloudinary.
 * This ensures permanent CDN URLs that don't expire.
 *
 * @param {string} mediaUrl - The Instagram media URL
 * @param {'image'|'video'} type - Media type
 * @returns {{ url: string, thumbnail?: string, publicId: string }}
 */
export async function uploadToCloudinary(mediaUrl, type) {
  if (!cloudinaryEnabled) {
    // Dev fallback: return the IG URL directly (will expire)
    return { url: mediaUrl, publicId: 'dev-mode', provider: 'instagram-direct' }
  }

  const resourceType = type === 'video' ? 'video' : 'image'

  const result = await cloudinary.uploader.upload(mediaUrl, {
    folder: 'dskprinters/gallery',
    resource_type: resourceType,
    ...(type === 'image'
      ? { transformation: [{ width: 1200, height: 1200, crop: 'limit' }, { quality: 'auto' }] }
      : {}),
  })

  const response = {
    url: result.secure_url,
    publicId: result.public_id,
    provider: 'cloudinary',
    width: result.width,
    height: result.height,
  }

  // Auto-generate thumbnail for videos
  if (type === 'video') {
    response.thumbnail = result.secure_url.replace(/\.\w+$/, '.jpg')
    response.duration = result.duration || null
  }

  return response
}

/**
 * Normalize an IG media object into a shape suitable for display in the admin panel.
 * @param {Object} igMedia - Raw IG API media object
 * @returns {Object} Normalized media item
 */
export function normalizeMedia(igMedia) {
  const mediaType = igMedia.media_type // IMAGE | VIDEO | CAROUSEL_ALBUM
  const isVideo = mediaType === 'VIDEO'
  const isCarousel = mediaType === 'CAROUSEL_ALBUM'

  // Extract first line of caption as title
  const captionLines = (igMedia.caption || '').split('\n').filter(Boolean)
  const title = captionLines[0]?.slice(0, 120) || 'Instagram Post'
  const caption = captionLines.slice(1).join('\n').slice(0, 500)

  // For carousels, collect all children
  const children = isCarousel && igMedia.children?.data
    ? igMedia.children.data.map((child) => ({
        id: child.id,
        mediaType: child.media_type === 'VIDEO' ? 'video' : 'image',
        url: child.media_url,
        thumbnail: child.thumbnail_url || null,
      }))
    : []

  return {
    instagramId: igMedia.id,
    mediaType: isVideo ? 'video' : 'image',
    isCarousel,
    url: igMedia.media_url || null,
    thumbnailUrl: igMedia.thumbnail_url || null,
    title,
    caption,
    permalink: igMedia.permalink,
    timestamp: igMedia.timestamp,
    children,
  }
}
