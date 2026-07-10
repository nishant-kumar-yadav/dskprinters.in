import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { SEO_PRODUCTS, LOCATIONS, titleCase } from '../seo/keywords'
import './popular-searches.css'

export default function PopularSearches() {
  return (
    <>
      <Helmet>
        <title>Popular Searches & Service Areas | DSK Printers</title>
        <meta name="description" content="Browse our popular searches, service areas, and applications for UV DTF stickers, heat transfer labels, and custom printed t-shirts across India." />
      </Helmet>
      
      <div className="ps-hero">
        <div className="container">
          <h1 className="ps-title">Popular Searches & Service Areas</h1>
          <p className="ps-subtitle">Explore our specialized manufacturing services across India</p>
        </div>
      </div>

      <div className="ps-container section">
        <div className="container">
          <div className="ps-grid">
            {SEO_PRODUCTS.map(product => (
              <div key={product.slug} className="ps-card">
                <h2 className="ps-card-title">{product.name}</h2>
                
                <div className="ps-links-group">
                  <h3 className="ps-group-title">By Location</h3>
                  <ul className="ps-links-list">
                    {LOCATIONS.slice(0, 5).map(loc => (
                      <li key={loc.slug}>
                        <Link to={`/s/${product.slug}-manufacturer-${loc.slug}`}>
                          {product.name} Manufacturer in {loc.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="ps-links-group">
                  <h3 className="ps-group-title">By Application</h3>
                  <ul className="ps-links-list">
                    {product.applications.slice(0, 5).map(app => (
                      <li key={app}>
                        <Link to={`/s/${product.slug}-for-${app}`}>
                          {product.name} for {titleCase(app)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
