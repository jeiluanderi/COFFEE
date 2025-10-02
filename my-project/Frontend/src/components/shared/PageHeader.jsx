import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PageHeader = ({ title, activePage, pageKey }) => {
  const backendUrl = 'http://localhost:3001';
  const [imageUrl, setImageUrl] = useState(''); // Dynamic image URL
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchImageUrl = async () => {
      try {
        // Public route: fetch by pageKey
        const response = await axios.get(`${backendUrl}/api/page-settings/${pageKey}`);
        if (response.data && response.data.image_url) {
          setImageUrl(response.data.image_url);
        } else {
          setImageUrl('/default-coffee-header.jpg'); // fallback
        }
      } catch (error) {
        console.error('Could not fetch page header image URL:', error);
        setImageUrl('/default-coffee-header.jpg'); // fallback
      } finally {
        setLoading(false);
      }
    };

    fetchImageUrl();
  }, [pageKey]);

  if (loading) {
    return <div className="page-header-loading py-5">Loading Header...</div>;
  }

  const backgroundStyle = {
    backgroundImage: `url(${imageUrl})`,
  backgroundSize: '100px',
    backgroundRepeat: 'repeat',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
  };

  const activeBreadcrumbColor = 'beige';

  return (
    <div
      className="container-fluid page-header py-5 mb-5 wow fadeIn"
      data-wow-delay="0.1s"
      style={backgroundStyle}
    >
      <div className="overlay" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}></div>
      <div className="container text-center py-5 relative z-10">
        <h1 className="display-3 text-white mb-4 animated slideInDown">{title}</h1>
        <nav aria-label="breadcrumb" className="animated slideInDown">
          <ol className="breadcrumb justify-content-center mb-0">
            <li className="breadcrumb-item">
              <a href="/" className="text-white">Home</a>
            </li>
            <li className="breadcrumb-item">
              <a href="/shop" className="text-white">Shop</a>
            </li>
            <li
              className="breadcrumb-item active"
              aria-current="page"
              style={{ color: activeBreadcrumbColor, fontWeight: 'bold' }}
            >
              {activePage}
            </li>
          </ol>
        </nav>
      </div>
    </div>
  );
};

export default PageHeader;
