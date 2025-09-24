import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { getAuthHeaders } from '../../utils/auth';
import BlogPostModal from '../components/BlogPostModal';
import './index.css'; // Assuming your index.css contains the shared styles for the admin panel

const AdminBlogPostsPage = () => {
    const [blogPosts, setBlogPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [postToEdit, setPostToEdit] = useState(null);
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

    const fetchBlogPosts = useCallback(async () => {
        setIsLoading(true);
        setError('');
        try {
            const response = await axios.get(`${backendUrl}/api/admin/blogs`, getAuthHeaders());
            setBlogPosts(response.data);
        } catch (err) {
            console.error('Error fetching blog posts:', err);
            setError('Failed to load blog posts. Please check the backend connection.');
        } finally {
            setIsLoading(false);
        }
    }, [backendUrl]);

    useEffect(() => {
        fetchBlogPosts();
    }, [fetchBlogPosts]);

    const handleCreatePost = () => {
        setPostToEdit(null);
        setIsModalOpen(true);
    };

    const handleEditPost = (post) => {
        setPostToEdit(post);
        setIsModalOpen(true);
    };

    const handleDeletePost = async (postId) => {
        // NOTE: A custom modal should be used instead of window.confirm for production apps.
        if (!window.confirm('Are you sure you want to delete this blog post?')) {
            return;
        }
        try {
            await axios.delete(`${backendUrl}/api/admin/blogs/${postId}`, getAuthHeaders());
            fetchBlogPosts();
        } catch (err) {
            console.error('Error deleting blog post:', err.response?.data || err);
            setError(err.response?.data?.message || 'Failed to delete blog post.');
        }
    };

    if (isLoading) {
        return <main className="main-content"><div className="card">Loading blog posts...</div></main>;
    }

    if (error) {
        return <main className="main-content"><div className="card text-red-500">{error}</div></main>;
    }

    return (
        <main className="main-content">
            <div className="list-header">
                <h2>Manage Blog Posts</h2>
                <button onClick={handleCreatePost} className="submit-btn">
                    <Plus size={20} /> Add New Post
                </button>
            </div>
            {blogPosts.length === 0 ? (
                <div className="card"><p>No blog posts found. Add your first one!</p></div>
            ) : (
                <div className="card">
                    <table className="w-full">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Title</th>
                                <th>Author</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {blogPosts.map((post) => (
                                <tr key={post.id}>
                                    <td>{post.id}</td>
                                    <td>{post.title}</td>
                                    <td>{post.author}</td>
                                    <td className="text-center">
                                        <button onClick={() => handleEditPost(post)} className="icon-btn edit-btn">
                                            <Edit size={18} />
                                        </button>
                                        <button onClick={() => handleDeletePost(post.id)} className="icon-btn delete-btn">
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <BlogPostModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                postToEdit={postToEdit}
                onSave={fetchBlogPosts}
            />
        </main>
    );
};

export default AdminBlogPostsPage;