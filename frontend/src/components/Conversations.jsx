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
        <div>
            { conversations.map(convo => (
                <div key={convo.id}>
                    <button onClick={() => navigate(`/conv/${convo.id}`)}>Next</button>
                </div>
            ))}
        </div>
    );
};

export default Conversations;
