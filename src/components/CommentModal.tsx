import React, { useState } from 'react';
import useCommentStore from '../store/commentStore';
import { Article } from '../types/article';
import { Comment } from '../types/comment';

interface CommentModalProps {
  article: Article;
  isOpen: boolean;
  onClose: () => void;
}

const CommentModal: React.FC<CommentModalProps> = ({ article, isOpen, onClose }) => {
  const [username, setUsername] = useState('');
  const [comment, setComment] = useState('');
  const { addComment, getCommentsByArticle, upvoteComment, downvoteComment, getUserVoteForComment } = useCommentStore();
  
  const comments = getCommentsByArticle(article.url);
  
  // Handle voting
  const handleUpvote = (commentId: string) => {
    upvoteComment(commentId, article.url);
  };
  
  const handleDownvote = (commentId: string) => {
    downvoteComment(commentId, article.url);
  };
  
  // Get user's vote for a comment
  const getUserVote = (commentId: string) => {
    return getUserVoteForComment(commentId);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!comment.trim()) return;
    
    addComment({
      articleUrl: article.url,
      articleTitle: article.title,
      username: username.trim(),
      content: comment.trim()
    });
    
    // Reset form
    setComment('');
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-100">Comments</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Article title */}
        <div className="p-4 border-b border-gray-700 bg-gray-900">
          <h4 className="text-sm text-gray-400">Article</h4>
          <p className="text-gray-200 font-medium">{article.title}</p>
        </div>
        
        {/* Comments list */}
        <div className="flex-grow overflow-y-auto p-4">
          {comments.length === 0 ? (
            <p className="text-gray-400 text-center py-6">No comments yet. Be the first to comment!</p>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => {
                const userVote = getUserVote(comment.id);
                return (
                  <div key={comment.id} className="bg-gray-900 p-3 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-cyan-400">{comment.username}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(comment.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-300 mb-3">{comment.content}</p>
                    
                    {/* Voting controls */}
                    <div className="flex items-center mt-2 text-sm">
                      {/* Upvote button */}
                      <button 
                        onClick={() => handleUpvote(comment.id)}
                        className={`flex items-center mr-4 ${userVote === 'up' ? 'text-green-500' : 'text-gray-500 hover:text-green-400'}`}
                        aria-label="Upvote"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                        <span className="ml-1">{comment.upvotes}</span>
                      </button>
                      
                      {/* Downvote button */}
                      <button 
                        onClick={() => handleDownvote(comment.id)}
                        className={`flex items-center ${userVote === 'down' ? 'text-red-500' : 'text-gray-500 hover:text-red-400'}`}
                        aria-label="Downvote"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                        <span className="ml-1">{comment.downvotes}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        {/* Comment form */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700">
          <input
            type="text"
            placeholder="Username (optional)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 mb-2 bg-gray-700 border border-gray-600 rounded text-gray-200 placeholder-gray-400 focus:outline-none focus:border-cyan-500"
          />
          <div className="flex">
            <textarea
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="flex-grow p-2 bg-gray-700 border border-gray-600 rounded-l text-gray-200 placeholder-gray-400 focus:outline-none focus:border-cyan-500"
              rows={2}
              required
            />
            <button
              type="submit"
              className="px-4 bg-cyan-600 text-white rounded-r hover:bg-cyan-700 focus:outline-none"
            >
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CommentModal;
