/**
 * Instagram Admin Routes
 * Provides endpoints for the admin panel to browse IG posts and import them into the gallery.
 *
 * All routes require admin JWT auth (mounted under /api/admin/instagram).
 */

import { Router } from 'express'
import {
  isInstagramConfigured,
  fetchInstagramMedia,
  fetchInstagramMediaById,
  refreshAccessToken,
  uploadToCloudinary,
  normalizeMedia,
} from '../services/instagramService.js'
import GalleryItem from '../models/GalleryItem.js'

const router = Router()

/**
 * GET /api/admin/instagram/status
 * Check if Instagram integration is configured and working.
 */
router.get('/status', async (req, res) => {
  const configured = isInstagramConfigured()
  if (!configured) {
    return res.json({
      configured: false,
      message: 'Instagram not configured. Add IG_ACCESS_TOKEN and IG_USER_ID to your .env file.',
    })
  }

  // Try a test fetch to verify token is valid
  try {
    await fetchInstagramMedia(null, 1)
    return res.json({ configured: true, status: 'connected' })
  } catch (err) {
    return res.json({
      configured: true,
      status: 'error',
      message: err.message,
      // If it's an auth error, the token is likely expired
      tokenExpired: err.status === 190 || err.igError?.code === 190,
    })
  }
})

/**
 * GET /api/admin/instagram/media?cursor=xxx&limit=25
 * Browse Instagram posts with pagination.
 * Returns normalized media items + already-imported IDs.
 */
router.get('/media', async (req, res, next) => {
  try {
    const { cursor, limit } = req.query
    const igResponse = await fetchInstagramMedia(cursor || null, parseInt(limit) || 25)

    // Get list of already-imported Instagram IDs
    const importedIds = await GalleryItem.find(
      { instagramId: { $exists: true, $ne: '' } },
      { instagramId: 1 }
    ).lean()
    const importedSet = new Set(importedIds.map((i) => i.instagramId))

    // Normalize each media item and mark if already imported
    const items = (igResponse.data || []).map((media) => {
      const normalized = normalizeMedia(media)
      normalized.alreadyImported = importedSet.has(normalized.instagramId)
      return normalized
    })

    res.json({
      items,
      paging: {
        hasNext: !!igResponse.paging?.cursors?.after,
        nextCursor: igResponse.paging?.cursors?.after || null,
      },
    })
  } catch (err) {
    next(err)
  }
})

/**
 * POST /api/admin/instagram/import
 * Import a selected Instagram post into the gallery.
 *
 * Body: {
 *   instagramId: string,          // IG media ID
 *   title: string,                // Editable title
 *   caption: string,              // Editable caption
 *   section: 'story'|'reel'|'gallery',
 *   category: string,
 *   storyGroup: string,
 *   linkedProduct: string,
 *   order: number,
 *   visible: boolean,
 *   mediaUrl: string,             // Direct IG media URL to upload
 *   mediaType: 'image'|'video',   // Type of media
 *   thumbnailUrl: string,         // IG thumbnail for videos
 *   childIndex: number,           // (optional) For carousel: which child to import
 * }
 */
router.post('/import', async (req, res, next) => {
  try {
    const {
      instagramId,
      title,
      caption,
      section,
      category,
      storyGroup,
      linkedProduct,
      order,
      visible,
      mediaUrl,
      mediaType,
      thumbnailUrl,
      childIndex,
    } = req.body

    if (!instagramId || !mediaUrl) {
      return res.status(400).json({ error: 'instagramId and mediaUrl are required' })
    }

    // Check if already imported (same IG ID + same child index for carousels)
    const existingQuery = { instagramId }
    if (typeof childIndex === 'number') {
      existingQuery.instagramChildIndex = childIndex
    }
    const existing = await GalleryItem.findOne(existingQuery)
    if (existing) {
      return res.status(409).json({
        error: 'This post has already been imported',
        existingId: existing._id,
      })
    }

    // Upload to Cloudinary for permanent storage
    const uploaded = await uploadToCloudinary(mediaUrl, mediaType || 'image')

    // Also upload thumbnail if it's a video and we have a thumbnail URL
    let thumbnail = uploaded.thumbnail || ''
    if (mediaType === 'video' && thumbnailUrl && !thumbnail) {
      try {
        const thumbResult = await uploadToCloudinary(thumbnailUrl, 'image')
        thumbnail = thumbResult.url
      } catch {
        // Non-critical, just use empty thumbnail
      }
    }

    // Create GalleryItem
    const item = await GalleryItem.create({
      title: title || 'Instagram Post',
      caption: caption || '',
      url: uploaded.url,
      thumbnail,
      type: mediaType || 'image',
      section: section || (mediaType === 'video' ? 'reel' : 'gallery'),
      storyGroup: storyGroup || '',
      category: category || 'all',
      linkedProduct: linkedProduct || '',
      order: order || 0,
      visible: visible !== false,
      source: 'instagram',
      instagramId,
      instagramPermalink: req.body.permalink || '',
      ...(typeof childIndex === 'number' ? { instagramChildIndex: childIndex } : {}),
    })

    res.status(201).json(item)
  } catch (err) {
    next(err)
  }
})

/**
 * POST /api/admin/instagram/refresh-token
 * Refresh the long-lived access token.
 */
router.post('/refresh-token', async (req, res, next) => {
  try {
    const result = await refreshAccessToken()
    res.json({
      success: true,
      expiresIn: result.expires_in,
      message: `Token refreshed. Expires in ${Math.round(result.expires_in / 86400)} days. Update your .env file with the new token.`,
      newToken: result.access_token,
    })
  } catch (err) {
    next(err)
  }
})

export default router
