import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Comment, CommentStore } from '../types/comment';

// Generate a simple user ID for vote tracking
const generateUserId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Create a store to manage comments
const useCommentStore = create<CommentStore>()(
  persist(
    (set, get) => ({
      comments: {},
      allComments: [],
      userId: typeof window !== 'undefined' ? localStorage.getItem('comment-user-id') || generateUserId() : generateUserId(),
      
      addComment: (comment) => {
        const id = Math.random().toString(36).substring(2, 15);
        const timestamp = new Date().toISOString();
        const newComment: Comment = {
          ...comment,
          id,
          timestamp,
          username: comment.username || 'Anonymous',
          upvotes: 0,
          downvotes: 0,
          voterIds: {}
        };
        
        set((state) => {
          // Update comments by article
          const articleComments = state.comments[comment.articleUrl] || [];
          const updatedComments = {
            ...state.comments,
            [comment.articleUrl]: [...articleComments, newComment]
          };
          
          // Update all comments list (sorted by timestamp, newest first)
          const updatedAllComments = [...state.allComments, newComment]
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
          
          return {
            comments: updatedComments,
            allComments: updatedAllComments
          };
        });
      },
      
      getCommentsByArticle: (articleUrl) => {
        return get().comments[articleUrl] || [];
      },
      
      getCommentCountByArticle: (articleUrl) => {
        return (get().comments[articleUrl] || []).length;
      },
      
      getAllComments: () => {
        return get().allComments;
      },
      
      // Voting methods
      upvoteComment: (commentId, articleUrl) => {
        const userId = get().userId;
        
        // Store user ID in localStorage for persistence
        if (typeof window !== 'undefined') {
          localStorage.setItem('comment-user-id', userId);
        }
        
        set((state) => {
          // Find the comment in the article comments
          const articleComments = [...(state.comments[articleUrl] || [])];
          const commentIndex = articleComments.findIndex(c => c.id === commentId);
          
          if (commentIndex === -1) return state;
          
          const comment = articleComments[commentIndex];
          const userVote = comment.voterIds[userId];
          
          // Update the comment with the new vote
          const updatedComment = { ...comment };
          
          // Remove previous vote if exists
          if (userVote === 'up') {
            updatedComment.upvotes -= 1;
          } else if (userVote === 'down') {
            updatedComment.downvotes -= 1;
          }
          
          // Add new vote if not already upvoted
          if (userVote !== 'up') {
            updatedComment.upvotes += 1;
            updatedComment.voterIds = { ...updatedComment.voterIds, [userId]: 'up' };
          } else {
            // If already upvoted, remove the vote
            updatedComment.voterIds = { ...updatedComment.voterIds, [userId]: null };
          }
          
          // Update the comment in the article comments
          articleComments[commentIndex] = updatedComment;
          
          // Update all comments list
          const updatedAllComments = state.allComments.map(c => 
            c.id === commentId ? updatedComment : c
          );
          
          return {
            comments: {
              ...state.comments,
              [articleUrl]: articleComments
            },
            allComments: updatedAllComments
          };
        });
      },
      
      downvoteComment: (commentId, articleUrl) => {
        const userId = get().userId;
        
        // Store user ID in localStorage for persistence
        if (typeof window !== 'undefined') {
          localStorage.setItem('comment-user-id', userId);
        }
        
        set((state) => {
          // Find the comment in the article comments
          const articleComments = [...(state.comments[articleUrl] || [])];
          const commentIndex = articleComments.findIndex(c => c.id === commentId);
          
          if (commentIndex === -1) return state;
          
          const comment = articleComments[commentIndex];
          const userVote = comment.voterIds[userId];
          
          // Update the comment with the new vote
          const updatedComment = { ...comment };
          
          // Remove previous vote if exists
          if (userVote === 'up') {
            updatedComment.upvotes -= 1;
          } else if (userVote === 'down') {
            updatedComment.downvotes -= 1;
          }
          
          // Add new vote if not already downvoted
          if (userVote !== 'down') {
            updatedComment.downvotes += 1;
            updatedComment.voterIds = { ...updatedComment.voterIds, [userId]: 'down' };
          } else {
            // If already downvoted, remove the vote
            updatedComment.voterIds = { ...updatedComment.voterIds, [userId]: null };
          }
          
          // Update the comment in the article comments
          articleComments[commentIndex] = updatedComment;
          
          // Update all comments list
          const updatedAllComments = state.allComments.map(c => 
            c.id === commentId ? updatedComment : c
          );
          
          return {
            comments: {
              ...state.comments,
              [articleUrl]: articleComments
            },
            allComments: updatedAllComments
          };
        });
      },
      
      getUserVoteForComment: (commentId) => {
        const userId = get().userId;
        const comment = get().allComments.find(c => c.id === commentId);
        
        if (!comment) return null;
        
        return comment.voterIds[userId] || null;
      }
    }),
    {
      name: 'cre-news-comments',
      // Save to localStorage with proper type handling
      storage: {
        getItem: (name) => {
          if (typeof window === 'undefined') return null;
          const str = localStorage.getItem(name);
          if (!str) return null;
          return JSON.parse(str);
        },
        setItem: (name, value) => {
          if (typeof window !== 'undefined') {
            localStorage.setItem(name, JSON.stringify(value));
          }
        },
        removeItem: (name) => {
          if (typeof window !== 'undefined') {
            localStorage.removeItem(name);
          }
        }
      }
    }
  )
);

export default useCommentStore;
