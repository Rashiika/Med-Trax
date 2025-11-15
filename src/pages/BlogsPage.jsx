import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import DashboardLayout from '../components/Layout/DashboardLayout';
import { fetchPosts, toggleLikePost, fetchCategories } from '../redux/features/communitySlice';
import BlogCreationModal from '../components/BlogCreationForm';
import { FileText } from 'lucide-react';

const homeIcon = '🏠';
const appointmentIcon = '📅';
const chatsIcon = '💬';
const profileIcon = '⚙';
const blogIcon = '📝';

const BlogsPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const { posts, loading: postsLoading, error: postsError } = useSelector(state => state.community);
    const { role } = useSelector(state => state.auth);

    useEffect(() => {
        dispatch(fetchPosts());
        dispatch(fetchCategories());
    }, [dispatch]);

    const sidebarItems = [
        { label: "Dashboard", to: `/${role}/dashboard`, icon: homeIcon },
        { label: "Appointments", to: `/${role}/appointments`, icon: appointmentIcon },
        { label: "Chats", to: `/${role}/chats`, icon: chatsIcon },
        role === "doctor"
            ? { label: "Prescriptions", to: "/doctor/prescriptions", icon: <FileText className="w-5 h-5" /> }
            : null,
        { label: "Blogs", to: `/${role}/blogs`, icon: blogIcon },
        { label: "Profile", to: `/${role}/profile`, icon: profileIcon },
    ].filter(Boolean);

    const postsArray = Array.isArray(posts) ? posts : [];

    const filteredPosts = postsArray.filter(post => {
        const title = post?.title?.toLowerCase() || "";
        const excerpt = post?.excerpt?.toLowerCase() || "";
        return title.includes(searchQuery.toLowerCase()) || excerpt.includes(searchQuery.toLowerCase());
    });

    const handleLike = (e, slug) => {
        e.stopPropagation();
        dispatch(toggleLikePost(slug));
    };

    const handleOpenPost = (slug) => {
        navigate(`/${role}/blogs/${slug}`);
    };

    return (
        <DashboardLayout sidebarItems={sidebarItems} role={role}>
            <div className="p-4 md:p-6">

                {/* Search */}
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                    <div className="relative w-full max-w-lg">
                        <input
                            type="text"
                            placeholder="Search Topic"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full p-2.5 pl-10 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                             fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                        </svg>
                    </div>

                    {role === "doctor" && (
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
                        >
                            ➕ Add New Blog
                        </button>
                    )}
                </div>

                {/* Loading */}
                {postsLoading && (
                    <div className="text-center py-10">
                        <div className="animate-spin h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-500">Fetching posts...</p>
                    </div>
                )}

                {/* Error */}
                {!postsLoading && postsError && (
                    <div className="text-center py-10">
                        <div className="text-red-600 font-medium">Failed to load posts</div>
                        <button
                            onClick={() => dispatch(fetchPosts())}
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {/* Empty */}
                {!postsLoading && filteredPosts.length === 0 && !postsError && (
                    <div className="text-center py-10 text-gray-600">
                        No posts found.
                    </div>
                )}

                {/* Posts Grid */}
                {!postsLoading && filteredPosts.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPosts.map(post => (
                            <div
                                key={post.id}   // <-- FIXED UNIQUE KEY
                                onClick={() => handleOpenPost(post.slug)}
                                className="bg-white rounded-xl shadow hover:shadow-xl transition cursor-pointer overflow-hidden"
                            >
                                {/* Featured Image */}
                                <div className="h-40 bg-gray-200">
                                    {post.featured_image ? (
                                        <img
                                            src={post.featured_image}
                                            alt={post.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-5xl">📝</div>
                                    )}
                                </div>

                                {/* Like Button */}
                                <div className="absolute top-3 right-3 bg-white px-3 py-1.5 rounded-full shadow flex items-center gap-2">
                                    <span className="text-sm">{post.total_likes}</span>
                                    <button
                                        onClick={(e) => handleLike(e, post.slug)}
                                        className="hover:scale-110 transition"
                                    >
                                        <svg className="w-6 h-6" fill={post.is_liked ? "red" : "none"}
                                             stroke={post.is_liked ? "red" : "black"} strokeWidth="2"
                                             viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                                        </svg>
                                    </button>
                                </div>

                                {/* Post Content */}
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold line-clamp-2">{post.title}</h3>
                                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">{post.excerpt}</p>

                                    <div className="flex justify-between text-xs text-gray-400 mt-3">
                                        <span>{post.author_name}</span>
                                        <span>{new Date(post.created_at).toLocaleDateString()}</span>
                                    </div>

                                    <p className="mt-2 text-blue-600 text-sm">Read More →</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {isModalOpen && (
                <BlogCreationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            )}
        </DashboardLayout>
    );
};

export default BlogsPage;