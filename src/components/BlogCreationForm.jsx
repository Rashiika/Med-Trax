import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import DashboardLayout from '../components/Layout/DashboardLayout'; 
import { createPost } from '../redux/features/communitySlice'; 
import { Loader2 } from 'lucide-react'; 

const homeIcon = '🏠';
const appointmentIcon = '📅';
const chatsIcon = '💬';
const profileIcon = '⚙';
const blogIcon = '📝'; 

const doctorSidebarItems = [
    { label: 'Dashboard', to: '/doctor/dashboard', icon: homeIcon },
    { label: 'Appointments', to: '/doctor/appointments', icon: appointmentIcon },
    { label: 'Chats', to: '/doctor/chats', icon: chatsIcon },
    { label: 'Blogs', to: '/doctor/blogs', icon: blogIcon },
    { label: 'Profile', to: '/doctor/profile', icon: profileIcon },
];

const STATUS_OPTIONS = ['draft', 'published', 'archived'];

const BlogCreationForm = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const { role } = useSelector((state) => state.auth); 
    
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        content: '',
        excerpt: '',
        status: STATUS_OPTIONS[0],
    });
    const [featuredImage, setFeaturedImage] = useState(null);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false); 

    const validate = () => {
        const newErrors = {};
        if (!formData.title.trim()) {
            newErrors.title = "Title is required.";
        } else if (formData.title.length > 200) {
            newErrors.title = "Title cannot exceed 200 characters.";
        }
        if (!formData.content.trim()) {
            newErrors.content = "Content is required.";
        }
        if (formData.excerpt.length > 300) {
            newErrors.excerpt = "Excerpt cannot exceed 300 characters.";
        }
        if (formData.category && isNaN(parseInt(formData.category))) {
            newErrors.category = "Category must be a number (ID).";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFeaturedImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) {
           
            const validationPassed = validate(); 
            if (!validationPassed) {

                window.scrollTo(0, 0); 
            }
            return;
        }
        
        setLoading(true);

        const apiFormData = new FormData();
        apiFormData.append('title', formData.title);
        apiFormData.append('category', formData.category);
        apiFormData.append('content', formData.content);
        apiFormData.append('excerpt', formData.excerpt);
        apiFormData.append('status', formData.status);
        
        if (featuredImage) {
            apiFormData.append('featured_image', featuredImage);
        }
        try {
            await dispatch(createPost(apiFormData)).unwrap();
            
            alert('Blog post created successfully!');
            navigate('/doctor/blogs'); 
        } catch (error) {
            console.error("API Submission Error:", error);
            alert(`Failed to create post: ${error.message || JSON.stringify(error)}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout sidebarItems={doctorSidebarItems} role={role}>
            <div className="max-w-4xl mx-auto p-4 md:p-8">
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-6 border-b pb-4">
                        Create New Blog Post
                    </h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                Title <span className="text-red-500">* required (max 200)</span>
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                maxLength={200}
                                className={`mt-1 block w-full border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500`}
                                required
                            />
                            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                        </div>

                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                                Category ID (integer)
                            </label>
                            <input
                                type="number"
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                placeholder="Category ID for the post"
                                className={`mt-1 block w-full border ${errors.category ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500`}
                            />
                            {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
                        </div>
                        
                        <div>
                            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                                Content <span className="text-red-500">* required (supports markdown)</span>
                            </label>
                            <textarea
                                id="content"
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                rows="10"
                                className={`mt-1 block w-full border ${errors.content ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500`}
                                required
                            />
                            {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content}</p>}
                        </div>

                        <div>
                            <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">
                                Excerpt (Brief summary, max 300 characters)
                            </label>
                            <textarea
                                id="excerpt"
                                name="excerpt"
                                value={formData.excerpt}
                                onChange={handleChange}
                                maxLength={300}
                                rows="3"
                                className={`mt-1 block w-full border ${errors.excerpt ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500`}
                            />
                            {errors.excerpt && <p className="mt-1 text-sm text-red-600">{errors.excerpt}</p>}
                            <p className="mt-1 text-xs text-gray-500">
                                {formData.excerpt.length} / 300 characters
                            </p>
                        </div>
      
                        <div>
                            <label htmlFor="featured_image" className="block text-sm font-medium text-gray-700 mb-2">
                                Featured Image (Main image for the post)
                            </label>
                            <input
                                type="file"
                                id="featured_image"
                                name="featured_image"
                                onChange={handleFileChange}
                                accept="image/*"
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                            {featuredImage && <p className="mt-2 text-sm text-gray-600">Selected: {featuredImage.name}</p>}
                        </div>

                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                                Status
                            </label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
                            >
                                {STATUS_OPTIONS.map(status => (
                                    <option key={status} value={status}>
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="pt-4 flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => navigate('/doctor/community')}
                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md shadow-sm hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" /> Saving...
                                    </>
                                ) : 'Create Post'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default BlogCreationForm;