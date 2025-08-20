import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import secureAxios from "../secureAxios";

const Conversations = () => {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const userId = parseInt(localStorage.getItem('userId'));

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const response = await secureAxios.get(`conversations/`);
                const data = response.data;
                
                const filtered = data.results.filter(convo =>
                    convo.sender === userId
                );
                
                const conversationsWithUsers = await Promise.all(
                    filtered.map(async (convo) => {
                        try {
                            const otherUserId = convo.sender === userId ? convo.receiver : convo.sender;
                            
                            const userResponse = await secureAxios.get(`users/${otherUserId}/`);
                            
                            return {
                                ...convo,
                                otherUser: userResponse.data
                            };
                        } catch (error) {
                            console.error(`Error fetching user ${convo.sender === userId ? convo.receiver : convo.sender}:`, error);
                            return {
                                ...convo,
                                otherUser: { 
                                    username: 'Unknown User',
                                    profile_picture: null 
                                }
                            };
                        }
                    })
                );
                
                setConversations(conversationsWithUsers);
            } catch (error) {
                console.error("Error fetching conversations: ", error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchConversations();
    }, [userId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white py-8 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white border border-gray-200 rounded-[6px] p-8 flex flex-col items-center justify-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-teal-500 border-solid mb-4"></div>
                        <p className="text-center text-gray-600">Loading conversations...</p>
                    </div>
                </div>
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-white py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-[6px] p-6 mb-8">
                    <h1 className="text-2xl font-semibold text-gray-900 mb-6">Your Conversations</h1>
                    
                    {conversations.length === 0 ? (
                        <div className="text-center py-12">
                            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.959 8.959 0 01-4.906-1.456L3 21l2.456-5.094A8.959 8.959 0 013 12a8 8 0 018-8c4.418 0 8 3.582 8 8z" />
                            </svg>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No conversations yet</h3>
                            <p className="text-gray-500">Start connecting with other users to see your conversations here.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {conversations.map((convo) => (
                                <div 
                                    key={convo.id} 
                                    className="border border-gray-200 rounded-[6px] p-4 hover:border-gray-400 transition-all duration-200 cursor-pointer"
                                    onClick={() => navigate(`/conv/${convo.id}`)}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="flex-shrink-0">
                                            {convo.otherUser.profile_picture ? (
                                                <img
                                                    src={`https://skillswap-bucket.s3.eu-north-1.amazonaws.com/${convo.otherUser.profile_picture}`}
                                                    alt={convo.otherUser.username}
                                                    className="w-12 h-12 rounded-full object-cover border border-gray-200"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center">
                                                    <span className="text-teal-600 font-medium text-lg">
                                                        {convo.otherUser.username?.charAt(0).toUpperCase() || '?'}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-lg font-medium text-gray-900 truncate">
                                                {convo.otherUser.username || 'Unknown User'}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                Conversation #{convo.id}
                                            </p>
                                        </div>
                                        
                                        <div className="flex-shrink-0">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Conversations;