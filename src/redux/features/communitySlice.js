import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

export const fetchCategories = createAsyncThunk(
    "community/fetchCategories",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/community/categories/`);
            console.log(response)
            return response.data;
        } catch (error) {
            console.log(error)
            return rejectWithValue(error.response?.data || "Failed to fetch categories");
        }
    }
);

export const fetchMyPosts = createAsyncThunk(
    "community/fetchMyPosts",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/community/posts/my-posts/`);
            console.log(response)
            return response.data;
        } catch (error) {
            console.log(error)
            return rejectWithValue(error.response?.data || "Failed to fetch user posts");
        }
    }
);

export const deletePost = createAsyncThunk(
    "community/deletePost",
    async (slug, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/community/posts/${slug}/`);
            console.log(`Post deleted: ${slug}`);
            return slug; // Return the slug to identify the deleted post
        } catch (error) {
            console.log(error);
            return rejectWithValue(error.response?.data || "Failed to delete post");
        }
    }
);

export const deleteComment = createAsyncThunk(
    "community/deleteComment",
    async (message_id, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/chat/messages/${message_id}/delete/`);
            console.log(`Comment deleted: ${message_id}`);
            return message_id; // Return the ID to identify the deleted comment/message
        } catch (error) {
            console.log(error);
            return rejectWithValue(error.response?.data || "Failed to delete comment");
        }
    }
);

export const fetchPosts = createAsyncThunk(
    "community/fetchPosts",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/community/posts/`);
            console.log(response);
            return response.data;
        } catch (error) {
            console.log(error);
            return rejectWithValue(error.response?.data || "Failed to fetch posts");
        }
    }
);

export const createPost = createAsyncThunk(
    "community/createPost",
    async (postData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/community/posts/create/`, postData);
            console.log(response);
            return response.data;
        } catch (error) {
            console.log(error);
            return rejectWithValue(error.response?.data || "Failed to create post");
        }
    }
);

export const fetchPostDetail = createAsyncThunk(
    "community/fetchPostDetail",
    async (slug, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/community/posts/${slug}/`);
            console.log(response);
            return response.data;
        } catch (error) {
            console.log(error);
            return rejectWithValue(error.response?.data || "Failed to fetch post details");
        }
    }
);

export const fetchPostComments = createAsyncThunk(
    "community/fetchPostComments",
    async (slug, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/community/posts/${slug}/comments/`);
            console.log(response);
            return response.data;
        } catch (error) {
            console.log(error);
            return rejectWithValue(error.response?.data || "Failed to fetch post comments");
        }
    }
);

export const createComment = createAsyncThunk(
    "community/createComment",
    async ({ slug, commentData }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/community/posts/${slug}/comments/create/`, commentData);
            console.log(response);
            return { slug, comment: response.data }; // Return slug to update the correct post
        } catch (error) {
            console.log(error);
            return rejectWithValue(error.response?.data || "Failed to create comment");
        }
    }
);

export const toggleLikePost = createAsyncThunk(
    "community/toggleLikePost",
    async (slug, { rejectWithValue }) => {
        try {
            // Assuming the backend returns the updated post object or a success status
            const response = await axiosInstance.post(`/community/posts/${slug}/like/`);
            console.log(response);
            return { slug, data: response.data }; // Return slug and any updated data
        } catch (error) {
            console.log(error);
            return rejectWithValue(error.response?.data || "Failed to toggle like");
        }
    }
);


const communitySlice = createSlice({
    name: "community",
    initialState: {
        posts: [],
        myPosts: [], // Added state for user's posts
        currentPost: null, // For single post view
        categories: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearCurrentPost: (state) => {
            state.currentPost = null;
        }
    },
    extraReducers: (builder) => {
        builder
    
            // --- Fullfilled Handlers ---
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.loading = false;
                state.posts = action.payload; // Assuming payload is the list of posts
            })
            .addCase(fetchMyPosts.fulfilled, (state, action) => {
                state.loading = false;
                state.myPosts = action.payload;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = action.payload;
            })
            .addCase(createPost.fulfilled, (state, action) => {
                state.loading = false;
                // Add the new post to the beginning of the list
                state.posts.unshift(action.payload);
            })
            .addCase(fetchPostDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.currentPost = action.payload; // Set the detailed post
            })
            .addCase(fetchPostComments.fulfilled, (state, action) => {
                state.loading = false;
                if (state.currentPost) {
                    // Assuming comments should be attached to the currentPost object
                    state.currentPost.comments = action.payload; 
                }
            })
            .addCase(createComment.fulfilled, (state, action) => {
                state.loading = false;
                const { comment } = action.payload;
                // Add the new comment to the current post's comments list
                if (state.currentPost) {
                    state.currentPost.comments.push(comment);
                }
            })
            .addCase(toggleLikePost.fulfilled, (state, action) => {
                state.loading = false;
                const { slug } = action.payload;

                // Update the post in the main list
                state.posts = state.posts.map(post => 
                    post.slug === slug ? { ...post, ...action.payload.data } : post
                );
                
                // Update the current detailed post if it matches
                if (state.currentPost?.slug === slug) {
                    state.currentPost = { ...state.currentPost, ...action.payload.data };
                }
            })
            .addCase(deletePost.fulfilled, (state, action) => {
                state.loading = false;
                const slugToDelete = action.payload;
                // Remove the deleted post from the main list
                state.posts = state.posts.filter(post => post.slug !== slugToDelete);
                state.myPosts = state.myPosts.filter(post => post.slug !== slugToDelete);
                
                if (state.currentPost?.slug === slugToDelete) {
                    state.currentPost = null;
                }
            })
            // You might need to refine deleteComment depending on the exact API response
            .addCase(deleteComment.fulfilled, (state, action) => {
                state.loading = false;
                const messageIdToDelete = action.payload;

                if (state.currentPost) {
                    state.currentPost.comments = state.currentPost.comments.filter(
                        comment => comment.id !== messageIdToDelete
                    );
                }
            })

             // --- Loading/Error Handlers ---
            .addMatcher(
                (action) => action.type.endsWith('/pending'),
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                (action) => action.type.endsWith('/rejected'),
                (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                }
            )
    },
});

export const { clearCurrentPost } = communitySlice.actions;
export default communitySlice.reducer;