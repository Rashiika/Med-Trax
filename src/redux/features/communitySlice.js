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
            return slug; 
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
            return message_id; 
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
            return response.data.results;
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
            const response = await axiosInstance.post("/community/posts/create/", postData);
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
            return { slug, comment: response.data }; 
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
            const response = await axiosInstance.post(`/community/posts/${slug}/like/`);
            console.log(response);
            return { slug, data: response.data }; 
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
        myPosts: [], 
        currentPost: null, 
        categories: [],
        loading: false,
        detailLoading: false,
        error: null,
    },
    reducers: {
        clearCurrentPost: (state) => {
            state.currentPost = null;
        }
    },
    extraReducers: (builder) => {
        builder
    
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.loading = false;
                state.posts = action.payload;
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
                state.posts.unshift(action.payload);
            })
            .addCase(fetchPostDetail.fulfilled, (state, action) => {
                state.detailLoading = false;
                state.currentPost = action.payload; 
            })
            .addCase(fetchPostComments.fulfilled, (state, action) => {
                state.loading = false;
                if (state.currentPost) {
                    state.currentPost.comments = action.payload; 
                }
            })
            .addCase(createComment.fulfilled, (state, action) => {
                state.loading = false;
                const { comment } = action.payload;
                if (state.currentPost) {
                    state.currentPost.comments.push(comment);
                }
            })
            .addCase(toggleLikePost.fulfilled, (state, action) => {
                state.loading = false;
                const { slug } = action.payload;

                state.posts = state.posts.map(post => 
                    post.slug === slug ? { ...post, ...action.payload.data } : post
                );
                
                if (state.currentPost?.slug === slug) {
                    state.currentPost = { ...state.currentPost, ...action.payload.data };
                }
            })
            .addCase(deletePost.fulfilled, (state, action) => {
                state.loading = false;
                const slugToDelete = action.payload;
                state.posts = state.posts.filter(post => post.slug !== slugToDelete);
                state.myPosts = state.myPosts.filter(post => post.slug !== slugToDelete);
                
                if (state.currentPost?.slug === slugToDelete) {
                    state.currentPost = null;
                }
            })
            .addCase(deleteComment.fulfilled, (state, action) => {
                state.loading = false;
                const messageIdToDelete = action.payload;

                if (state.currentPost) {
                    state.currentPost.comments = state.currentPost.comments.filter(
                        comment => comment.id !== messageIdToDelete
                    );
                }
            })

            .addMatcher(
                (action) => action.type.endsWith('/pending'),
                (state) => {
                    state.loading = true;
                    state.detailLoading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                (action) => action.type.endsWith('/rejected'),
                (state, action) => {
                    state.loading = false;
                    state.detailLoading = false;
                    state.error = action.payload;
                }
            )
    },
});

export const { clearCurrentPost } = communitySlice.actions;
export default communitySlice.reducer;