import secureAxios from "../secureAxios";
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import RequestCard from "./RequestCard";

function RequestList() {
    const [pendingRequests, setPendingRequests] = useState([]);
    const [acceptedRequests, setAcceptedRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        fetchUserId();
    }, []);

    useEffect(() => {
        if (currentUser) {
            fetchRequests();
        }
    }, [currentUser]);


    const fetchUserId = async () => {
        try {
            const response = await secureAxios.get('/users/me/');
            setCurrentUser(response.data);
        } catch(err) {
            console.error("Error fetching the current user:", err);
        }
    };


    const fetchRequests = async () => {
        try {
            setLoading(true);
            
            const pendingResponse = await secureAxios.get('/requests/received/');
            setPendingRequests(pendingResponse.data);
            
            const allRequestsResponse = await secureAxios.get('/requests/');
            const acceptedReqs = allRequestsResponse.data.results.filter(req => 
                req.status === 'accepted' && req.receiver === currentUser.id
            );
            setAcceptedRequests(acceptedReqs);
            
        } catch (err) {
            setError('Failed to fetch requests');
            console.error('Error fetching requests:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async (requestId) => {
        try {
            await secureAxios.patch(`/requests/${requestId}/accept/`);
            fetchRequests();
        } catch (err) {
            console.error('Error accepting request:', err);
            alert('Failed to accept request');
        }
    };

    const handleDecline = async (requestId) => {
        try {
            await secureAxios.patch(`/requests/${requestId}/decline/`);
            fetchRequests();
        } catch (err) {
            console.error('Error declining request:', err);
            alert('Failed to decline request');
        }
    };

    const handleChat = async (userId) => {
    try {
        console.log(userId);
        const response = await secureAxios.post('/conversations/create_conversation/', {
            receiver_id: userId,
        });

        const conversation = response.data;
        navigate(`/conv/${conversation.id}`);
    } catch (error) {
        console.error("Error creating conversation:", error);
        alert('Failed to open chat.');
    }
};



    if (loading) {
    return (
            <div className="min-h-screen bg-white py-8 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white border border-gray-200 rounded-[6px] p-8 flex flex-col items-center justify-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-teal-500 border-solid mb-4"></div>
                        <p className="text-center text-gray-600">Loading requests...</p>
                    </div>
                </div>
            </div>
        );
    }


    if (error) {
        return (
            <div className="text-red-500 text-center p-4">
                {error}
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">My Skill Swap Requests</h1>

            <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-orange-600">
                Pending Requests ({pendingRequests.length})
            </h2>

            {pendingRequests.length === 0 ? (
                <div className="text-gray-500 text-center p-8 border border-gray-200 rounded-lg">
                No pending requests
                </div>
            ) : (
                <div>
                {pendingRequests.map((request) => (
                    <RequestCard 
                    key={request.id} 
                    request={request} 
                    showActions={true}
                    handleAccept={handleAccept}
                    handleDecline={handleDecline}
                    handleChat={handleChat}
                    />
                ))}
                </div>
            )}
            </div>

            <div>
            <h2 className="text-xl font-semibold mb-4 text-green-600">
                Accepted Requests ({acceptedRequests.length})
            </h2>

            {acceptedRequests.length === 0 ? (
                <div className="text-gray-500 text-center p-8 border border-gray-200 rounded-lg">
                No accepted requests yet
                </div>
            ) : (
                <div>
                {acceptedRequests.map((request) => (
                    <RequestCard 
                    key={request.id} 
                    request={request} 
                    showActions={false}
                    handleChat={handleChat}
                    />
                ))}
                </div>
            )}
            </div>
        </div>
    ) ;
}

export default RequestList;