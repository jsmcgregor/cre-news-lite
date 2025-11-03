import { useState } from 'react';
import { Article } from '../../types/article';
import useCommentStore from '../store/commentStore';
import CommentModal from './CommentModal';

interface ArticleCardProps {
    article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
    const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
    const { getCommentCountByArticle } = useCommentStore();
    
    // Format the source name for display
    const sourceDisplay = article.source.replace('Scraper', '');
    
    // Get the comment count for this article
    const commentCount = getCommentCountByArticle(article.url);
    
    // Get a background color class based on the region for dark mode
    const getRegionColorClass = (region: string): string => {
        switch(region) {
            case 'National': return 'bg-blue-900 text-blue-200';
            case 'Northeast': return 'bg-purple-900 text-purple-200';
            case 'Midwest': return 'bg-green-900 text-green-200';
            case 'South': return 'bg-yellow-900 text-yellow-200';
            case 'West': return 'bg-red-900 text-red-200';
            case 'Southwest': return 'bg-orange-900 text-orange-200';
            default: return 'bg-gray-700 text-gray-200';
        }
    };
    
    // Handle comment button click
    const handleCommentClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsCommentModalOpen(true);
    };
    
    return (
        <>
            <div className="h-full bg-gray-800 border border-gray-700 rounded-lg p-5 flex flex-col shadow-md hover:shadow-lg transition-all duration-200 hover:border-cyan-800">
                <div className="flex items-start justify-between mb-3">
                    <span className="text-sm font-medium text-gray-400">{sourceDisplay}</span>
                    <div className="flex items-center space-x-2">
                        <span className="text-xs font-medium text-gray-400">{article.publishedDate}</span>
                        <span className={`text-xs font-medium py-1 px-2 rounded ${getRegionColorClass(article.region)}`}>
                            {article.region}
                        </span>
                    </div>
                </div>
                
                <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group"
                >
                    <h3 className="text-lg font-semibold text-gray-200 mb-3 group-hover:text-cyan-400 transition-colors">
                        {article.title}
                    </h3>
                </a>
                
                <div className="text-sm text-gray-400 mt-auto flex justify-between items-center">
                    <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{article.publishedDate}</span>
                    </div>
                    
                    <button 
                        onClick={handleCommentClick}
                        className="flex items-center text-gray-400 hover:text-cyan-400 transition-colors"
                        aria-label="Comments"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        {commentCount > 0 && (
                            <span className="ml-1 text-xs font-medium">{commentCount}</span>
                        )}
                    </button>
                </div>
            </div>
            
            {/* Comment Modal */}
            <CommentModal 
                article={article}
                isOpen={isCommentModalOpen}
                onClose={() => setIsCommentModalOpen(false)}
            />
        </>
    );
}
