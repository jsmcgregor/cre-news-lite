import React from 'react';
import useCommentStore from '../store/commentStore';
import Link from 'next/link';
import { Comment } from '../types/comment';

const CommentFeed: React.FC = () => {
  const { getAllComments, upvoteComment, downvoteComment, getUserVoteForComment } = useCommentStore();
  const allComments = getAllComments();
  
  // Get the 10 most recent comments
  const recentComments = allComments.slice(0, 10);
  
  // Handle voting
  const handleUpvote = (commentId: string, articleUrl: string) => {
    upvoteComment(commentId, articleUrl);
  };
  
  const handleDownvote = (commentId: string, articleUrl: string) => {
    downvoteComment(commentId, articleUrl);
  };
  
  // Get user's vote for a comment
  const getUserVote = (commentId: string) => {
    return getUserVoteForComment(commentId);
  };
  
  if (recentComments.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-4 mb-6">
        <h2 className="text-lg font-medium text-gray-100 mb-4">Recent Comments</h2>
        <p className="text-gray-400 text-center py-4">No comments yet. Be the first to comment on an article!</p>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-6">
      <h2 className="text-lg font-medium text-gray-100 mb-4">Recent Comments</h2>
      <div className="space-y-3">
        {recentComments.map((comment) => {
          const userVote = getUserVote(comment.id);
          return (
            <div key={comment.id} className="bg-gray-900 p-3 rounded-lg">
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-cyan-400">{comment.username}</span>
                <span className="text-xs text-gray-500">
                  {new Date(comment.timestamp).toLocaleString()}
                </span>
              </div>
              <p className="text-gray-300 text-sm mb-2">{comment.content}</p>
              
              {/* Voting controls */}
              <div className="flex items-center mb-2 text-xs">
                {/* Upvote button */}
                <button 
                  onClick={() => handleUpvote(comment.id, comment.articleUrl)}
                  className={`flex items-center mr-3 ${userVote === 'up' ? 'text-green-500' : 'text-gray-500 hover:text-green-400'}`}
                  aria-label="Upvote"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                  <span className="ml-1">{comment.upvotes}</span>
                </button>
                
                {/* Downvote button */}
                <button 
                  onClick={() => handleDownvote(comment.id, comment.articleUrl)}
                  className={`flex items-center ${userVote === 'down' ? 'text-red-500' : 'text-gray-500 hover:text-red-400'}`}
                  aria-label="Downvote"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  <span className="ml-1">{comment.downvotes}</span>
                </button>
              </div>
              
              <div className="text-xs text-gray-500">
                On: <Link href={comment.articleUrl} className="text-cyan-500 hover:underline truncate inline-block max-w-[250px]">
                  {comment.articleTitle}
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CommentFeed;
