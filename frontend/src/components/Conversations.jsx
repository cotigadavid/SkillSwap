import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Conversations = () => {
    const [conversations, setConversations] = useState([]);

    const navigate = useNavigate();

    const userId = localStorage.getItem('userId');
    useEffect(() =>  {
        const fetchConversations = async () => {
            const response = await fetch(`http://localhost:8000/api/conversations/`, {
                method: 'GET'
            });
            const data = await response.json();
            const filtered = data.filter(convo => 
                convo.sender && convo.sender === (parseInt(userId))
            );
            
            setConversations(filtered);
            console.log(filtered);

        };

        fetchConversations();
    }, []);

    return (
        <div className="max-w-md mx-auto p-4 space-y-3 bg-white rounded shadow-md">
            {conversations.map((convo) => (
                <div key={convo.id} className="border rounded p-3 bg-gray-50">
                    <button
                        onClick={() => navigate(`/conv/${convo.id}`)}
                        className="w-full text-left text-blue-600 hover:underline"
                    >
                        Go to Conversation #{convo.id}
                    </button>
                </div>
            ))}
        </div>
    );

};

export default Conversations;
