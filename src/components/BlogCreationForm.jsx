import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createPost, fetchPosts } from '../redux/features/communitySlice';
import { X, Loader2, Upload, Image as ImageIcon, Sparkles, FileText, Tag } from 'lucide-react';

const BlogCreationModal = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const { categories, createLoading, createError } = useSelector((state) => state.community);

    const [formData, setFormData] = useState({
        title: '',
        category: '',
        content: '',
        excerpt: '',
    });
    const [featuredImage, setFeaturedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [errors, setErrors] = useState({});
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        if (createError) {
            setErrors({ submit: typeof createError === 'string' ? createError : 'Failed to create post' });
        }
    }, [createError]);

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
        if (!formData.category) {
            newErrors.category = "Please select a category.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            processFile(file);
        }
    };

    const processFile = (file) => {
        if (file.size > 5 * 1024 * 1024) {
            setErrors(prev => ({ ...prev, image: 'File size must be less than 5MB' }));
            return;
        }
        setFeaturedImage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
        setErrors(prev => ({ ...prev, image: null }));
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            processFile(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        const apiFormData = new FormData();
        apiFormData.append('title', formData.title);
        apiFormData.append('category', formData.category);
        apiFormData.append('content', formData.content);
        apiFormData.append('excerpt', formData.excerpt);
        apiFormData.append('status', 'published'); // Always published

        if (featuredImage) {
            apiFormData.append('featured_image', featuredImage);
        }

        try {
            await dispatch(createPost(apiFormData)).unwrap();
            await dispatch(fetchPosts());
            onClose();
            resetForm();
        } catch (error) {
            console.error("Failed to create post:", error);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            category: '',
            content: '',
            excerpt: '',
        });
        setFeaturedImage(null);
        setImagePreview(null);
        setErrors({});
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop with blur */}
            <div
                className="fixed inset-0 bg-gradient-to-br from-blue-900/40 via-purple-900/40 to-pink-900/40 backdrop-blur-sm transition-opacity"
                onClick={handleClose}
            ></div>

            {/* Modal */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
                    {/* Gradient Header */}
                    <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-8 py-6">
                        <div className="absolute inset-0 bg-black/10"></div>
                        <div className="relative flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                                    <Sparkles className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold text-white">Create New Post</h2>
                                    <p className="text-white/80 text-sm mt-1">Share your knowledge with the community</p>
                                </div>
                            </div>
                            <button
                                onClick={handleClose}
                                className="text-white/80 hover:text-white transition-colors bg-white/10 hover:bg-white/20 rounded-full p-2"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                     
                            {errors.submit && (
                                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-r-xl flex items-start gap-3">
                                    <div className="text-red-500 mt-0.5">⚠</div>
                                    <div>
                                        <p className="font-semibold">Error</p>
                                        <p className="text-sm">{errors.submit}</p>
                                    </div>
                                </div>
                            )}
                            <div>
                                <label className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                    <ImageIcon className="w-5 h-5 text-purple-600" />
                                    Featured Image
                                </label>
                                <div
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    className={`relative border-3 border-dashed rounded-2xl transition-all duration-300 ${
                                        isDragging
                                            ? 'border-purple-500 bg-purple-50 scale-[1.02]'
                                            : imagePreview
                                            ? 'border-green-300 bg-green-50'
                                            : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50/30'
                                    }`}
                                >
                                    {imagePreview ? (
                                        <div className="relative group">
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="w-full h-64 object-cover rounded-2xl"
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setFeaturedImage(null);
                                                        setImagePreview(null);
                                                    }}
                                                    className="bg-red-500 text-white rounded-full p-3 hover:bg-red-600 transform hover:scale-110 transition-all shadow-lg"
                                                >
                                                    <X className="w-6 h-6" />
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <label className="flex flex-col items-center justify-center py-12 cursor-pointer">
                                            <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mb-4 transform hover:scale-110 transition-transform">
                                                <Upload className="w-10 h-10 text-purple-600" />
                                            </div>
                                            <p className="text-lg font-semibold text-gray-700 mb-2">
                                                Drop your image here or click to browse
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                PNG, JPG, GIF up to 5MB
                                            </p>
                                            <input
                                                type="file"
                                                onChange={handleFileChange}
                                                accept="image/*"
                                                className="hidden"
                                            />
                                        </label>
                                    )}
                                </div>
                                {errors.image && (
                                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                        <span>⚠</span> {errors.image}
                                    </p>
                                )}
                            </div>

                            {/* Title */}
                            <div>
                                <label htmlFor="title" className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-blue-600" />
                                    Post Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    maxLength={200}
                                    placeholder="Enter an engaging title..."
                                    className={`w-full px-5 py-3.5 border-2 ${
                                        errors.title ? 'border-red-400 bg-red-50' : 'border-gray-300 focus:border-blue-500'
                                    } rounded-xl focus:ring-4 focus:ring-blue-100 transition-all text-lg placeholder-gray-400`}
                                />
                                <div className="flex justify-between items-center mt-2">
                                    {errors.title && <p className="text-sm text-red-600 flex items-center gap-1"><span>⚠</span> {errors.title}</p>}
                                    <p className={`text-xs ml-auto ${formData.title.length > 180 ? 'text-orange-500 font-semibold' : 'text-gray-500'}`}>
                                        {formData.title.length}/200
                                    </p>
                                </div>
                            </div>

                            {/* Category */}
                            <div>
                                <label htmlFor="category" className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                    <Tag className="w-5 h-5 text-green-600" />
                                    Category <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className={`w-full px-5 py-3.5 border-2 ${
                                        errors.category ? 'border-red-400 bg-red-50' : 'border-gray-300 focus:border-green-500'
                                    } rounded-xl focus:ring-4 focus:ring-green-100 transition-all text-lg appearance-none cursor-pointer bg-white`}
                                    style={{
                                        backgroundImage: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e"),
                                        backgroundPosition: 'right 1rem center',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundSize: '1.5em 1.5em',
                                        paddingRight: '3rem'
                                    }}
                                >
                                    <option value="">Select a category</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.category && <p className="mt-2 text-sm text-red-600 flex items-center gap-1"><span>⚠</span> {errors.category}</p>}
                            </div>

                            {/* Excerpt */}
                            <div>
                                <label htmlFor="excerpt" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Brief Summary (Optional)
                                </label>
                                <textarea
                                    id="excerpt"
                                    name="excerpt"
                                    value={formData.excerpt}
                                    onChange={handleChange}
                                    maxLength={300}
                                    rows="3"
                                    placeholder="Write a captivating summary to hook your readers..."
                                    className={`w-full px-5 py-3.5 border-2 ${
                                        errors.excerpt ? 'border-red-400 bg-red-50' : 'border-gray-300 focus:border-purple-500'
                                    } rounded-xl focus:ring-4 focus:ring-purple-100 transition-all resize-none placeholder-gray-400`}
                                />
                                <div className="flex justify-between items-center mt-2">
                                    {errors.excerpt && <p className="text-sm text-red-600 flex items-center gap-1"><span>⚠</span> {errors.excerpt}</p>}
                                    <p className={`text-xs ml-auto ${formData.excerpt.length > 280 ? 'text-orange-500 font-semibold' : 'text-gray-500'}`}>
                                        {formData.excerpt.length}/300
                                    </p>
                                </div>
                            </div>

                            {/* Content */}
                            <div>
                                <label htmlFor="content" className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-orange-600" />
                                    Content <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    id="content"
                                    name="content"
                                    value={formData.content}
                                    onChange={handleChange}
                                    rows="10"
                                    placeholder="Share your insights, experiences, or knowledge... (Supports Markdown formatting)"
                                    className={`w-full px-5 py-3.5 border-2 ${
                                        errors.content ? 'border-red-400 bg-red-50' : 'border-gray-300 focus:border-orange-500'
                                    } rounded-xl focus:ring-4 focus:ring-orange-100 transition-all resize-none placeholder-gray-400 font-mono text-sm`}
                                />
                                {errors.content && <p className="mt-2 text-sm text-red-600 flex items-center gap-1"><span>⚠</span> {errors.content}</p>}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end gap-4 pt-6 border-t-2 border-gray-100">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold"
                                    disabled={createLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={createLoading}
                                    className="px-8 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-3"
                                >
                                    {createLoading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Publishing...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-5 h-5" />
                                            Publish Post
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogCreationModal;