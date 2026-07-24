import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { Clock, ArrowRight, BookOpen, Tag } from 'lucide-react'
import { fetchBlogPosts, fetchBlogCategories } from '../api.js'
import './blog.css'

const CATEGORY_LABELS = {
  general: 'General',
  dtf: 'DTF',
  'uv-dtf': 'UV DTF',
  'heat-transfer': 'Heat Transfer',
  industry: 'Industry',
  tutorials: 'How-To',
}

function BlogCard({ post }) {
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
            <BookOpen size={32} />
          </div>
        )}
        <span className="blog-card-category">
          {CATEGORY_LABELS[post.category] || post.category}
        </span>
      </div>
      <div className="blog-card-body">
        <div className="blog-card-meta">
          {date && <span>{date}</span>}
          {post.readTime > 0 && (
            <span>
              <Clock size={13} /> {post.readTime} min read
            </span>
          )}
        </div>
        <h2 className="blog-card-title">{post.title}</h2>
        <p className="blog-card-excerpt">{post.excerpt}</p>
        <span className="blog-card-link">
          Read More <ArrowRight size={14} />
        </span>
      </div>
    </Link>
  )
}

export default function Blog() {
  const [category, setCategory] = useState('all')
  const [page, setPage] = useState(1)
  const [allPosts, setAllPosts] = useState([])

  const { data: catData } = useQuery({
    queryKey: ['blog-categories'],
    queryFn: fetchBlogCategories,
  })

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['blog-posts', page, category],
    queryFn: () => fetchBlogPosts(page, category),
  })

  // Accumulate posts for "Load More" pagination
  useEffect(() => {
    if (!data?.posts) return
    if (page === 1) {
      setAllPosts(data.posts)
    } else {
      setAllPosts((prev) => {
        const existingIds = new Set(prev.map((p) => p._id))
        const newPosts = data.posts.filter((p) => !existingIds.has(p._id))
        return [...prev, ...newPosts]
      })
    }
  }, [data, page])

  // Handle category change
  const handleCategoryChange = (cat) => {
    setCategory(cat)
    setPage(1)
    setAllPosts([])
  }

  // Use accumulated posts, or data.posts on first load
  const posts = allPosts.length > 0 ? allPosts : data?.posts || []
  const hasMore = data?.hasMore || false

  // Build category list from API data
  const categories = [
    { category: 'all', count: catData?.reduce((sum, c) => sum + c.count, 0) || 0 },
    ...(catData || []),
  ]

  return (
    <div className="page">
      <Helmet>
        <title>Blog | Printing Tips, DTF Guides & Industry News | DSK Printers</title>
        <meta
          name="description"
          content="Read expert guides on DTF stickers, UV DTF transfers, heat transfer labels, and printing industry tips from DSK Printers, New Delhi."
        />
      </Helmet>

      {/* Hero */}
      <section className="page-hero blog-hero">
        <div className="container">
          <div className="blog-hero-content">
            <span className="badge section-eyebrow">
              <BookOpen size={14} /> Our Blog
            </span>
            <h1>
              Tips, Guides &amp; <span className="gradient-text">Industry News</span>
            </h1>
            <p>
              Expert insights on DTF printing, UV DTF transfers, heat transfer labels, and
              growing your business with custom stickers.
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="blog-filters">
        <div className="container">
          <div className="category-jump-bar">
            {categories.map((c) => (
              <button
                key={c.category}
                className={`jump-pill ${category === c.category ? 'active' : ''}`}
                onClick={() => handleCategoryChange(c.category)}
              >
                {CATEGORY_LABELS[c.category] || 'All'}
                {c.count > 0 && <span className="pill-count">{c.count}</span>}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="section blog-grid-section">
        <div className="container">
          {isLoading && page === 1 ? (
            <div className="blog-loading">
              {[1, 2, 3].map((i) => (
                <div key={i} className="blog-card-skeleton card">
                  <div className="skeleton-image" />
                  <div className="skeleton-body">
                    <div className="skeleton-line short" />
                    <div className="skeleton-line" />
                    <div className="skeleton-line medium" />
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="blog-empty">
              <BookOpen size={48} />
              <h2>No posts yet</h2>
              <p>
                {category !== 'all'
                  ? `No posts in "${CATEGORY_LABELS[category] || category}" yet. Check back soon!`
                  : 'Blog posts are coming soon. Stay tuned!'}
              </p>
            </div>
          ) : (
            <>
              <div className="blog-grid">
                {posts.map((post) => (
                  <BlogCard key={post._id} post={post} />
                ))}
              </div>

              {hasMore && (
                <div className="blog-load-more">
                  <button
                    className="btn btn-outline"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={isFetching}
                  >
                    {isFetching ? 'Loading…' : 'Load More Posts'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Tags Section */}
      {posts.length > 0 && (
        <section className="section blog-tags-section">
          <div className="container">
            <h3 className="blog-tags-heading">
              <Tag size={16} /> Popular Topics
            </h3>
            <div className="blog-tags-cloud">
              {[
                'DTF Stickers',
                'UV DTF',
                'Heat Transfer',
                'T-Shirt Printing',
                'Garment Labels',
                'Bulk Orders',
                'Custom Stickers',
                'Silicone Labels',
              ].map((tag) => (
                <span key={tag} className="blog-tag-pill">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
