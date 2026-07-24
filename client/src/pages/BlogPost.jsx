import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { ArrowLeft, Clock, Calendar, User, MessageCircle, Share2 } from 'lucide-react'
import { fetchBlogPost, COMPANY } from '../api.js'
import { useQuoteModal } from '../components/QuoteModal.jsx'
import './blog.css'

const CATEGORY_LABELS = {
  general: 'General',
  dtf: 'DTF',
  'uv-dtf': 'UV DTF',
  'heat-transfer': 'Heat Transfer',
  industry: 'Industry',
  tutorials: 'How-To',
}

function BlogCardSmall({ post }) {
  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : ''

  return (
    <Link to={`/blog/${post.slug}`} className="blog-card card">
      <div className="blog-card-image">
        {post.coverImage ? (
          <img src={post.coverImage} alt={post.title} loading="lazy" />
        ) : (
          <div className="blog-card-placeholder">
            <Clock size={24} />
          </div>
        )}
      </div>
      <div className="blog-card-body">
        <div className="blog-card-meta">
          {date && <span>{date}</span>}
          {post.readTime > 0 && (
            <span>
              <Clock size={13} /> {post.readTime} min
            </span>
          )}
        </div>
        <h2 className="blog-card-title">{post.title}</h2>
      </div>
    </Link>
  )
}

export default function BlogPostPage() {
  const { slug } = useParams()
  const { openQuote } = useQuoteModal()

  const { data, isLoading, error } = useQuery({
    queryKey: ['blog-post', slug],
    queryFn: () => fetchBlogPost(slug),
    enabled: !!slug,
  })

  const post = data?.post
  const related = data?.related || []

  if (isLoading) {
    return (
      <div className="page">
        <section className="section">
          <div className="container blog-detail">
            <div className="skeleton-line short" style={{ marginBottom: 20 }} />
            <div className="skeleton-image" style={{ borderRadius: 16, marginBottom: 28 }} />
            <div className="skeleton-line short" style={{ marginBottom: 12 }} />
            <div className="skeleton-line" style={{ marginBottom: 8 }} />
            <div className="skeleton-line" style={{ marginBottom: 8 }} />
            <div className="skeleton-line medium" />
          </div>
        </section>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="page">
        <section className="section">
          <div className="container blog-detail">
            <Link to="/blog" className="blog-back-link">
              <ArrowLeft size={16} /> Back to Blog
            </Link>
            <div className="blog-empty">
              <h2>Post not found</h2>
              <p>The blog post you&apos;re looking for doesn&apos;t exist or has been removed.</p>
              <Link to="/blog" className="btn btn-primary" style={{ marginTop: 16 }}>
                Browse All Posts
              </Link>
            </div>
          </div>
        </section>
      </div>
    )
  }

  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : ''

  const authorInitial = (post.author || 'D')[0].toUpperCase()
  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(
    `${post.title} — Read on DSK Printers Blog: ${shareUrl}`
  )}`

  return (
    <div className="page">
      <Helmet>
        <title>{post.metaTitle || `${post.title} | DSK Printers Blog`}</title>
        <meta
          name="description"
          content={post.metaDesc || post.excerpt || `Read "${post.title}" on the DSK Printers blog.`}
        />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.excerpt,
            image: post.coverImage || undefined,
            datePublished: post.publishedAt,
            dateModified: post.updatedAt,
            author: {
              '@type': 'Organization',
              name: post.author || 'DSK Printers',
            },
            publisher: {
              '@type': 'Organization',
              name: 'DSK Printers',
              logo: {
                '@type': 'ImageObject',
                url: 'https://dskprinters.in/images/logo.png',
              },
            },
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': shareUrl,
            },
          })}
        </script>
      </Helmet>

      <section className="section">
        <div className="container blog-detail">
          {/* Back link */}
          <Link to="/blog" className="blog-back-link">
            <ArrowLeft size={16} /> Back to Blog
          </Link>

          {/* Cover image */}
          {post.coverImage && (
            <img
              src={post.coverImage}
              alt={post.title}
              className="blog-detail-cover"
            />
          )}

          {/* Meta line */}
          <div className="blog-detail-meta">
            <span className="blog-detail-category">
              {CATEGORY_LABELS[post.category] || post.category}
            </span>
            {post.readTime > 0 && (
              <span>
                <Clock size={14} /> {post.readTime} min read
              </span>
            )}
          </div>

          {/* Title */}
          <h1>{post.title}</h1>

          {/* Author strip */}
          <div className="blog-detail-author">
            <div className="blog-detail-author-avatar">{authorInitial}</div>
            <div className="blog-detail-author-info">
              <span className="blog-detail-author-name">{post.author || 'DSK Printers'}</span>
              {date && (
                <span className="blog-detail-author-date">
                  <Calendar size={12} /> {date}
                </span>
              )}
            </div>
          </div>

          {/* Content body */}
          <div
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="blog-detail-tags">
              {post.tags.map((tag) => (
                <span key={tag} className="blog-tag-pill">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Share / CTA */}
          <div className="blog-share-strip">
            <h3>Found this helpful?</h3>
            <p>Share this article or get in touch for your printing needs.</p>
            <div className="blog-share-actions">
              <a
                href={whatsappShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-blue"
              >
                <MessageCircle size={16} /> Share on WhatsApp
              </a>
              <button className="btn btn-primary" onClick={() => openQuote()}>
                Get Quote
              </button>
            </div>
          </div>

          {/* Related Posts */}
          {related.length > 0 && (
            <div className="blog-related">
              <h3>Related Articles</h3>
              <div className="blog-grid">
                {related.map((r) => (
                  <BlogCardSmall key={r._id} post={r} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
