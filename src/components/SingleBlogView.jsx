import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import DashboardLayout from '../components/Layout/DashboardLayout';
import { fetchPostDetail, toggleLikePost } from '../redux/features/communitySlice';
import { Heart, Eye, Calendar, User } from 'lucide-react';

const homeIcon = '🏠';
const appointmentIcon = '📅';
const chatsIcon = '💬';
const profileIcon = '⚙';
const blogIcon = '📝';

const SingleBlogView = () => {
    const dispatch = useDispatch();
    const { slug } = useParams();
    const navigate = useNavigate();

    const { currentPost, detailLoading, posts } = useSelector((state) => state.community);
    const { role } = useSelector((state) => state.auth);
    const rolePrefix = role === 'doctor' ? '/doctor' : '/patient';

    const relatedPosts = posts
        .filter(p => p.slug !== slug && p.category_name === currentPost?.category?.name)
        .slice(0, 3);

    useEffect(() => {
        if (slug) {
            dispatch(fetchPostDetail(slug));
        }
    }, [dispatch, slug]);

    const handleLikeClick = () => {
        if (currentPost && currentPost.slug) {
            dispatch(toggleLikePost(currentPost.slug));
        }
    };

    const handleRelatedPostClick = (relatedSlug) => {
        navigate(`${rolePrefix}/blogs/${relatedSlug}`);
        window.scrollTo(0, 0);
    };

    const getSidebarItems = () => {
        return [
            { label: 'Dashboard', to: `${rolePrefix}/dashboard`, icon: homeIcon },
            { label: 'Appointments', to: `${rolePrefix}/appointments`, icon: appointmentIcon },
            { label: 'Chats', to: `${rolePrefix}/chats`, icon: chatsIcon },
            { label: 'Blogs', to: `${rolePrefix}/blogs`, icon: blogIcon },
            { label: 'Profile', to: `${rolePrefix}/profile`, icon: profileIcon },
        ];
    };

    const isLiked = currentPost?.is_liked || false;

    if (detailLoading) {
        return (
            <DashboardLayout sidebarItems={getSidebarItems()} role={role}>
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">Loading blog details...</span>
                </div>
            </DashboardLayout>
        );
    }

    if (!currentPost) {
        return (
            <DashboardLayout sidebarItems={getSidebarItems()} role={role}>
                <div className="p-8 text-center">
                    <p className="text-red-600 text-lg mb-4">Blog post not found</p>
                    <button
                        onClick={() => navigate(`${rolePrefix}/blogs`)}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Back to Blogs
                    </button>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout sidebarItems={getSidebarItems()} role={role}>
            <div className="p-4 md:p-6">
                {/* Back Button */}
                <button
                    onClick={() => navigate(`${rolePrefix}/blogs`)}
                    className="mb-4 flex items-center text-blue-600 hover:text-blue-700 transition-colors"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Blogs
                </button>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Main Content */}
                    <div className="flex-1 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                        {/* Featured Image */}
                        <div className="bg-gray-200 h-80 w-full mb-6 rounded-lg overflow-hidden">
                            {currentPost.featured_image ? (
                                <img
                                    src={currentPost.featured_image}
                                    alt={currentPost.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <span className="text-6xl">📝</span>
                                </div>
                            )}
                        </div>

                        {/* Title and Meta */}
                        <div className="mb-6">
                            <h1 className="text-4xl font-bold text-gray-900 mb-4">{currentPost.title}</h1>

                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                                <div className="flex items-center gap-1">
                                    <User className="w-4 h-4" />
                                    <span>{currentPost.author_name}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>{new Date(currentPost.published_at || currentPost.created_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Eye className="w-4 h-4" />
                                    <span>{currentPost.views_count} views</span>
                                </div>
                                {currentPost.category && (
                                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                        {currentPost.category.name}
                                    </span>
                                )}
                            </div>

                            {/* Like Button */}
                            <button
                                onClick={handleLikeClick}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                            >
                                <Heart
                                    className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
                                />
                                <span className="font-medium text-gray-700">
                                    {currentPost.total_likes || 0} {currentPost.total_likes === 1 ? 'Like' : 'Likes'}
                                </span>
                            </button>
                        </div>

                        {/* Excerpt */}
                        {currentPost.excerpt && (
                            <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                                <p className="text-gray-700 italic">{currentPost.excerpt}</p>
                            </div>
                        )}

                        {/* Content */}
                        <div
                            className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: currentPost.content }}
                        />
                    </div>

                    {/* Sidebar */}
                    <div className="w-full lg:w-80">
                        <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100 sticky top-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-4 pb-3 border-b">
                                Related Posts
                            </h3>
                            <div className="space-y-4">
                                {relatedPosts.length > 0 ? (
                                    relatedPosts.map((relatedPost) => (
                                        <div
                                            key={relatedPost.slug}
                                            onClick={() => handleRelatedPostClick(relatedPost.slug)}
                                            className="group cursor-pointer pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                                        >
                                            <h4 className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2 mb-1">
                                                {relatedPost.title}
                                            </h4>
                                            <p className="text-xs text-gray-500 mb-2">
                                                {relatedPost.author_name}
                                            </p>
                                            <span className="text-sm text-blue-500 group-hover:underline">
                                                Read more →
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500">No related posts found.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default SingleBlogView;