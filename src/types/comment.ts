export interface Comment {
  id: string;
  articleUrl: string;
  articleTitle: string;
  username: string;
  content: string;
  timestamp: string;
  upvotes: number;
  downvotes: number;
  // Track which users have voted (by browser fingerprint/session)
  voterIds: {
    [userId: string]: 'up' | 'down' | null;
  };
}

export interface CommentStore {
  comments: { [articleUrl: string]: Comment[] };
  allComments: Comment[];
  userId: string; // Browser fingerprint/session ID to track votes
  
  addComment: (comment: Omit<Comment, 'id' | 'timestamp' | 'username' | 'upvotes' | 'downvotes' | 'voterIds'> & { username?: string }) => void;
  getCommentsByArticle: (articleUrl: string) => Comment[];
  getCommentCountByArticle: (articleUrl: string) => number;
  getAllComments: () => Comment[];
  
  // Voting methods
  upvoteComment: (commentId: string, articleUrl: string) => void;
  downvoteComment: (commentId: string, articleUrl: string) => void;
  getUserVoteForComment: (commentId: string) => 'up' | 'down' | null;
}
