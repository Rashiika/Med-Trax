import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useDispatch, useSelector } from 'react-redux';
import DashboardLayout from '../components/Layout/DashboardLayout'; 
import { fetchPosts, toggleLikePost } from '../redux/features/communitySlice'; 

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

const dummyPosts = Array(9).fill({
    id: 1,
    title: "Benefits of a healthy diet",
    author: "Dr. Alice",
    slug: "benefits-of-a-healthy-diet"
});


const BlogsPage = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { 
        posts, 
        loading: postsLoading, 
        error: postsError 
    } = useSelector((state) => state.community);
    const displayedPosts = posts?.length > 0 ? posts : dummyPosts;
    
    const { role } = useSelector((state) => state.auth); 
    useEffect(() => {
        dispatch(fetchPosts()); 
    }, [dispatch]); 

    const rolePrefix = role === 'doctor' ? '/doctor' : '/patient';

    const handlePostClick = (slug) => {
        navigate(`${rolePrefix}/blogs/${slug}`);
    };
    
    const handleAddBlog = () => {
        navigate('/doctor/blogs/create'); 
    };

    const handleLikeClick = (e, postSlug) => {
        e.stopPropagation(); 
        dispatch(toggleLikePost(postSlug));
    };

    const getSidebarItems = () => {
        return sidebarItems.map(item => ({
            ...item,
            to: `${rolePrefix}${item.to}`
        }));
    };

    return (
        <DashboardLayout sidebarItems={getSidebarItems()} role={role}>
            <div className="p-4 md:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                    <div className="relative w-full max-w-lg order-2 sm:order-1">
                        <input
                            type="text"
                            placeholder="Search Topic"
                            className="w-full p-2.5 pl-10 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                        <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                    </div>

                    {role === 'doctor' && (
                        <button 
                            onClick={handleAddBlog} 
                            className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-150 order-1 sm:order-2 flex items-center justify-center"
                        >
                            ➕ Add New Blog
                        </button>
                    )}
                </div>
                {postsLoading && (
                    <div className="text-center py-10 text-gray-500">Fetching community posts...</div>
                )}
                
                {!postsLoading && postsError && (
                    <div className="text-center py-10 text-red-600">Error loading posts: {postsError.message || JSON.stringify(postsError)}</div>
                )}

                {!postsLoading && displayedPosts.length === 0 && !postsError && (
                    <div className="text-center py-10 text-gray-600">No community posts found yet.</div>
                )}
                
                {!postsLoading && displayedPosts.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {displayedPosts.map((post) => (
                            <div
                                key={post.id} 
                                className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transform transition duration-300 hover:shadow-xl hover:scale-[1.02] border border-gray-100 relative" // Added relative for positioning like button
                                onClick={() => handlePostClick(post.slug)}
                            >
                                <div className="bg-gray-200 h-40 w-full flex items-center justify-center text-gray-500 overflow-hidden">
                                    {post.featured_image ? (
                                        <img src={post.featured_image} alt={post.title} className="w-full h-full object-cover" />
                                    ) : (
                                        "Placeholder"
                                    )}
                                </div>

                                <div className="absolute top-3 right-3 flex items-center bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-md border border-gray-100">
                                    <span className="text-sm font-semibold text-red-600 mr-1">
                                        {post.total_likes || 0}
                                    </span>
                                    <button
                                        onClick={(e) => handleLikeClick(e, post.slug)}
                                        aria-label={`Like post ${post.title}`}
                                        className="text-gray-500 hover:text-red-500 transition-colors focus:outline-none"
                                    >

                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-current" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path 
                                                strokeLinecap="round" 
                                                strokeLinejoin="round" 
                                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-.318-.318L4.318 6.318z" 
                                                fill={post.is_liked_by_user ? "red" : "none"} 
                                                stroke="red"
                                            />
                                        </svg>
                                    </button>
                                </div>
                                
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-1">{post.title}</h3>
                                    <p className="text-sm text-gray-500 mb-2 line-clamp-2">{post.excerpt}</p>
                                    <div className="flex justify-between items-center">
                                        <p className="text-sm text-blue-500 hover:text-blue-700 transition duration-150">
                                            Read More
                                        </p>
                                        <span className="text-gray-400 text-sm">...</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default BlogsPage;