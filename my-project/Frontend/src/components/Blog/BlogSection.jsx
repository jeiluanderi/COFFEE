import React from 'react';

// Import local images for blog posts (user will replace these)
import blogPostImg1 from '../../assets/img/menu-beans.jpg';
import blogPostImg2 from '../../assets/img/coff.jpg';
import blogPostImg3 from '../../assets/img/menu-latte.jpg';
import blogPostImg4 from '../../assets/img/menu-espresso.jpg'; // Additional blog post
import blogPostImg5 from '../../assets/img/cold-brew.jpg'; // Additional blog post

const blogPostsData = [
    {
        id: 1,
        title: 'Exploring the World of Coffee Beans',
        imageUrl: blogPostImg1,
        excerpt: 'Dive deep into the rich diversity of coffee beans, from Arabica to Robusta, and discover what makes each unique.',
        author: 'Barista Alex',
        date: 'Aug 15, 2025',
        category: 'Coffee Knowledge',
        delay: '0.1s'
    },
    {
        id: 2,
        title: 'The Art and Science of Coffee Roasting',
        imageUrl: blogPostImg2,
        excerpt: 'Uncover the fascinating process of coffee roasting and how it brings out the distinct flavors in every bean.',
        author: 'Roaster David',
        date: 'Aug 10, 2025',
        category: 'Behind the Scenes',
        delay: '0.3s'
    },
    {
        id: 3,
        title: 'Health Benefits of Your Daily Cup',
        imageUrl: blogPostImg3,
        excerpt: 'Beyond the great taste, learn about the surprising health benefits packed into your favorite morning beverage.',
        author: 'Nutritionist Jane',
        date: 'Aug 05, 2025',
        category: 'Wellness',
        delay: '0.5s'
    },
    {
        id: 4,
        title: 'Ethiopian Yirgacheffe: A Taste Journey',
        imageUrl: blogPostImg4,
        excerpt: 'Journey with us to the birthplace of coffee and experience the vibrant, floral notes of Ethiopian Yirgacheffe.',
        author: 'Barista Alex',
        date: 'Jul 28, 2025',
        category: 'Coffee Origins',
        delay: '0.1s'
    },
    {
        id: 5,
        title: 'Mastering the Perfect Cold Brew at Home',
        imageUrl: blogPostImg5,
        excerpt: 'Our step-by-step guide to brewing your own delicious and smooth cold brew right in your kitchen.',
        author: 'Barista Sophia',
        date: 'Jul 20, 2025',
        category: 'Brew Guides',
        delay: '0.3s'
    }
];

const BlogSection = () => {
    // Define a color palette for consistent styling
    const colors = {
        primary: '#8B4513',   // Saddle Brown
        secondary: '#6F4E37', // Coffee Brown
        light: '#F8F5EB',     // Creamy White
        dark: '#36220B'       // Dark Coffee Bean
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
                    overflow: hidden; /* Ensures rounded corners apply to image too */
                    display: flex;
                    flex-direction: column;
                    height: 100%; /* Make cards equal height */
                }
                .blog-post-card:hover {
                    transform: translateY(-8px); /* Lifts the card slightly */
                    box-shadow: 0 8px 25px rgba(0,0,0,0.12); /* More pronounced shadow */
                }
                .blog-post-card img {
                    width: 100%;
                    height: 200px; /* Fixed height for blog post images */
                    object-fit: cover;
                }
                .blog-post-content {
                    padding: 1.5rem;
                    flex-grow: 1; /* Allows content to take up available space */
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between; /* Pushes footer to bottom */
                }
                .blog-post-meta {
                    display: flex;
                    justify-content: space-between;
                    font-size: 0.9em;
                    color: ${colors.secondary};
                    margin-top: 1rem;
                    padding-top: 1rem;
                    border-top: 1px solid rgba(0,0,0,0.05); /* Separator line */
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
                    {blogPostsData.map((post) => (
                        <div key={post.id} className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay={post.delay}>
                            <div className="blog-post-card">
                                <img src={post.imageUrl} className="img-fluid rounded-top" alt={post.title} />
                                <div className="blog-post-content">
                                    <div>
                                        <h3 className="blog-post-title">{post.title}</h3>
                                        <p className="blog-post-excerpt">{post.excerpt}</p>
                                    </div>
                                    <div className="blog-post-meta">
                                        <span><i className="far fa-user"></i> {post.author}</span>
                                        <span><i className="far fa-calendar-alt"></i> {post.date}</span>
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
