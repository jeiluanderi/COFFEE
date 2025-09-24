import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import './index.css'; // Assuming your CSS is in a separate file

const BlogSection = () => {
    // State to store blog posts, loading status, and errors
    const [blogPosts, setBlogPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Backend URL from your environment variables
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

    useEffect(() => {
        // Function to fetch blog posts from the API
        const fetchBlogPosts = async () => {
            try {
                const response = await axios.get(`${backendUrl}/api/blogs`);
                setBlogPosts(response.data);
                setIsLoading(false);
            } catch (err) {
                console.error('Error fetching blog posts:', err);
                setError('Failed to load blog posts. Please check your backend API connection.');
                setIsLoading(false);
            }
        };

        fetchBlogPosts();
    }, [backendUrl]); // Dependency array: Re-run effect if backendUrl changes

    // Define a color palette for consistent styling
    const colors = {
        primary: '#8B4513',   // Saddle Brown
        secondary: '#6F4E37', // Coffee Brown
        light: '#F8F5EB',     // Creamy White
        dark: '#36220B'       // Dark Coffee Bean
    };

    // Conditional rendering based on API call status
    if (isLoading) {
        return <div className="text-center py-5">
            <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>;
    }

    if (error) {
        return <div className="text-center py-5 text-danger">{error}</div>;
    }
    
    // Check if there are no blog posts
    if (blogPosts.length === 0) {
        return <div className="text-center py-5">No blog posts found.</div>;
    }

    // Function to format the date
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="container-xxl py-5">
            {/* Internal CSS for blog post cards hover effect */}
            <style jsx>{`
                .blog-post-card {
                    background-color: white;
                    border-radius: 8px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.08);
                    transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                }
                .blog-post-card:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 8px 25px rgba(0,0,0,0.12);
                }
                .blog-post-card img {
                    width: 100%;
                    height: 200px;
                    object-fit: cover;
                }
                .blog-post-content {
                    padding: 1.5rem;
                    flex-grow: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                }
                .blog-post-meta {
                    display: flex;
                    justify-content: space-between;
                    font-size: 0.9em;
                    color: ${colors.secondary};
                    margin-top: 1rem;
                    padding-top: 1rem;
                    border-top: 1px solid rgba(0,0,0,0.05);
                }
                .blog-post-meta i {
                    margin-right: 0.5rem;
                }
                .blog-post-title {
                    color: ${colors.dark};
                    font-size: 1.5rem;
                    margin-bottom: 0.75rem;
                }
                .blog-post-excerpt {
                    color: ${colors.secondary};
                    font-size: 0.95rem;
                    line-height: 1.5;
                }
            `}</style>
            <div className="container">
                <div className="text-center mx-auto wow fadeInUp" data-wow-delay="0.1s" style={{ maxWidth: '600px' }}>
                    <p className="fs-5 fw-bold text-primary">Our Blog</p>
                    <h1 className="display-5 mb-5">Fresh Brews & Coffee Stories</h1>
                </div>
                <div className="row g-4">
                    {blogPosts.map((post) => (
                        <div key={post.id} className="col-lg-4 col-md-6 wow fadeInUp">
                            <div className="blog-post-card">
                                <img src={post.image_url} className="img-fluid rounded-top" alt={post.title} />
                                <div className="blog-post-content">
                                    <div>
                                        <h3 className="blog-post-title">{post.title}</h3>
                                        {/* Display a snippet of the full content */}
                                        <p className="blog-post-excerpt">{post.content.substring(0, 150)}...</p>
                                    </div>
                                    <div className="blog-post-meta">
                                        <span><i className="far fa-user"></i> {post.author}</span>
                                        <span><i className="far fa-calendar-alt"></i> {formatDate(post.created_at)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BlogSection;