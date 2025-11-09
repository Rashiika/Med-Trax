import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import DashboardLayout from '../components/Layout/DashboardLayout'; 
import { fetchPostDetail, toggleLikePost } from '../redux/features/communitySlice'; // 👈 Thunk imported from slice

const homeIcon = '🏠';
const appointmentIcon = '📅';
const chatsIcon = '💬';
const profileIcon = '⚙';
const blogIcon = '📝';

const sidebarItems = [
    { label: 'Dashboard', to: '/dashboard', icon: homeIcon },
    { label: 'Appointment', to: '/appointments', icon: appointmentIcon },
    { label: 'Chat', to: '/chats', icon: chatsIcon },
    { label: 'Blogs', to: '/blogs', icon: blogIcon },
    { label: 'Profile', to: '/profile', icon: profileIcon },
];

const SingleBlogView = () => {
    const dispatch = useDispatch();
    const { slug } = useParams();
    const navigate = useNavigate();
    
    const { currentPost, detailLoading, posts } = useSelector((state) => state.community);
    const { role } = useSelector((state) => state.auth); 
    const rolePrefix = role === 'doctor' ? '/doctor' : '/patient';

    const relatedPosts = posts
        .filter(p => p.slug !== slug)
        .slice(0, 3) 
        .map(p => ({ title: p.title, slug: p.slug })); 

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
        return sidebarItems.map(item => ({
            ...item,
            to: `${rolePrefix}${item.to}`
        }));
    }; 

    const isLiked = currentPost?.is_liked || false;

    if (detailLoading) {
        return <DashboardLayout sidebarItems={getSidebarItems()} role={role}><div className="p-8 text-center">Loading Blog Details...</div></DashboardLayout>;
    }
    
    if (!currentPost) {
        return <DashboardLayout sidebarItems={getSidebarItems()} role={role}><div className="p-8 text-center text-red-600">Blog post not found or an error occurred.</div></DashboardLayout>;
    }

    return (
        <DashboardLayout sidebarItems={getSidebarItems()} role={role}>
            <div className="p-4 md:p-6">
                <div className="flex justify-between items-center mb-6">
                    <div className="relative w-full max-w-lg">
                        <input
                            type="text"
                            placeholder="Search topic"
                            className="w-full p-2.5 pl-10 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                       <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-1 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                        
                        <div className="bg-gray-200 h-64 w-full mb-6 rounded-lg flex items-center justify-center text-gray-500 overflow-hidden">
                            {currentPost.featured_image ? (
                                <img src={currentPost.featured_image} alt={currentPost.title} className="w-full h-full object-cover" />
                            ) : (
                                "Image Placeholder"
                            )}
                        </div>

                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800">{currentPost.title}</h1>
                                <p className="text-sm text-gray-500 mt-1">
                                    By {currentPost.author_name} - {new Date(currentPost.published_at).toLocaleDateString()}
                                </p>
                            </div>

                            <div className="flex flex-col items-center pt-1 ml-4">
                                <button
                                    onClick={handleLikeClick}
                                    aria-label="Toggle like"
                                    className="text-gray-500 hover:text-red-500 transition-colors focus:outline-none"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-.318-.318L4.318 6.318z" 
                                            fill={isLiked ? "red" : "none"}
                                            stroke="red"
                                        />
                                    </svg>
                                </button>
                                <span className="text-xs font-semibold text-gray-600 mt-1">
                                    {currentPost.total_likes || 0} Likes
                                </span>
                            </div>
                        </div>
                        
                        <div className="text-gray-700 space-y-4 leading-relaxed" 
                            dangerouslySetInnerHTML={{ __html: currentPost.content || currentPost.excerpt }} 
                        />
                    </div>

                    <div className="w-full lg:w-72">
                        <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">More blogs like this</h3>
                            <div className="space-y-4">
                                {relatedPosts.map((relatedPost, index) => (
                                    <div 
                                        key={relatedPost.slug || index} 
                                        className="pb-2 cursor-pointer"
                                        onClick={() => handleRelatedPostClick(relatedPost.slug)}
                                    >
                                        <h4 className="font-medium text-gray-800 hover:text-blue-600">
                                            {relatedPost.title}
                                        </h4>
                                        <span className="text-sm text-blue-500 hover:underline">See more</span>
                                    </div>
                                ))}
                                {relatedPosts.length === 0 && <p className="text-sm text-gray-500">No related posts found.</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default SingleBlogView;