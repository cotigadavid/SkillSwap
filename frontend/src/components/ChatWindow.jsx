import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import secureAxios from "../secureAxios";
import { useNavigate } from "react-router-dom";

const ChatWindow = () => {
    const inputRef = useRef();
    const messagesEndRef = useRef();
    const [messageList, setMessageList] = useState([]);
    const [oppositeConv, setOppositeConv] = useState('');
    const [receiver, setReceiver] = useState('');
    const [sender, setSender] = useState('');
    const [filesArray, setFilesArray] = useState([]);
    const [tempFile, setTempFile] = useState(null);
    const [showFileUpload, setShowFileUpload] = useState(false);
    const [blocked, setBlocked] = useState(false);
    const [loading, setLoading] = useState(true);
    const [messagesLoading, setMessagesLoading] = useState(true);
    const [initialMessagesLoaded, setInitialMessagesLoaded] = useState(false);

    
    const { convId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messageList]);
    
    const sendMessage = async (message) => {
        if (!message.trim() && filesArray.length === 0) return;

        try {
            const formData = new FormData();
            formData.append("conversation", parseInt(convId));

            if (message.trim()) {
                formData.append("text", message);
            }

            formData.append("is_received", false);
            formData.append("is_sent", false);

            for (let file of filesArray) {
                formData.append("attachments", file);
            }

            const response = await secureAxios.post('messages/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                credentials: 'include',
            });

            console.log(response);
            setFilesArray([]); 
            await fetchMessage();

        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    useEffect(() => {
        const fetchConv = async () => {
            try {
                const convRes = await secureAxios.get(`conversations/${convId}/`);
                const convData = convRes.data;

                if (convData?.sender && convData?.receiver) {
                    const [receiverRes, senderRes] = await Promise.all([
                        secureAxios.get(`users/${convData.receiver}/`),
                        secureAxios.get(`users/${convData.sender}/`),
                    ]);
                    const receiverData = receiverRes.data;
                    const senderData = senderRes.data;
                    setReceiver(receiverData);
                    setSender(senderData);
                }
            } catch (error) {
                if (error.response && error.response.status === 403) {
                    console.error("Access denied to this conversation.");
                    setMessageList([]);
                    setBlocked(true);
                } else {
                    console.error("Error fetching conversation: ", error);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchConv();
    }, [convId]);
    
    useEffect(() => {
        if (!receiver?.id || !sender?.id) return;

        const fetchOppositeConv = async () => {
            try {
                const response = await secureAxios.get(`conversations/`);
                const data = response.data;
        
                const filtered = data.results.find(conv => 
                    conv.sender === receiver.id && conv.receiver === sender.id
                );
                setOppositeConv(filtered);
            } catch (error) {
                console.error("Error fetching opposite conversation: ", error);
            }
        };
    
        fetchOppositeConv();
    }, [receiver, sender]);

    const fetchMessage = async () => {
        try {
            if (!initialMessagesLoaded) {
                setMessagesLoading(true);
            }
            
            const response = await secureAxios.get(`messages/`);
            const data = await response.data;
            const filtered = data.filter(mess => 
                mess.conversation === parseInt(convId) || mess.conversation === parseInt(oppositeConv?.id)
            );
            setMessageList(filtered);
        } catch (error) {
            console.error("Error fetching messages: ", error);
        } finally {
            if (!initialMessagesLoaded) {
                setMessagesLoading(false);
                setInitialMessagesLoaded(true);
            }
        }
    };

    useEffect(() => {
        fetchMessage();
    }, [oppositeConv]);
    
    const getTime = (createdAt) => {
        const time = new Date(createdAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });
        return time;
    };
    
    useEffect(() => {
        const markAllAsRead = async () => {
            try {
                if (oppositeConv && oppositeConv.id) {
                    const response = await secureAxios.post('/mark-read/', {
                        credentials: 'include',
                        conversation_id: oppositeConv.id
                    });
                }
            } catch (err) {
                console.error("Failed to mark messages as read", err.message);
            }
        };
        
        markAllAsRead();
    }, [oppositeConv]);

    const handleSubmitFile = async () => {
        try {
            if (tempFile) {
                setFilesArray(f => [...f, tempFile]);
                setTempFile(null);
                setShowFileUpload(false);
            }
        } catch (error) {
            console.error('Error adding file:', error);
        }
    };

    const removeFile = (index) => {
        setFilesArray(prev => prev.filter((_, i) => i !== index));
    };
    
    const handleDownload = async (fileUrl, fileName) => {
        try {
            const response = await secureAxios.get(fileUrl, {
                responseType: 'blob', 
            });

            const blob = new Blob([response.data]);
            const blobUrl = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = fileName || 'download';
            document.body.appendChild(link);
            link.click();

            window.URL.revokeObjectURL(blobUrl);
            document.body.removeChild(link);
        } catch (error) {
            console.error("File download failed:", error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white py-8 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white border border-gray-200 rounded-[6px] p-8">
                        <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-teal-500 border-solid mr-3"></div>
                            <p className="text-gray-600">Loading conversation...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
    if (blocked) {
        return (
            <div className="min-h-screen bg-white py-8 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white border border-gray-200 rounded-[6px] p-8 text-center">
                        <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h3>
                        <p className="text-gray-600">You do not have access to this conversation.</p>
                        <button
                            onClick={() => navigate('/conv')}
                            className="mt-4 px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-[6px] font-medium transition-all duration-200"
                        >
                            Back to Conversations
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Chat Header */}
                <div className="bg-white border border-gray-200 rounded-[6px] p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <button 
                            onClick={() => navigate(`/profile/${receiver.id}`)} 
                            className="flex items-center gap-4 hover:bg-gray-50 p-2 rounded-[6px] transition-all duration-200"
                        >
                            {receiver.profile_picture ? (
                                <img 
                                    src={receiver.profile_picture} 
                                    width="50" 
                                    height="50" 
                                    alt="Profile" 
                                    className="rounded-full object-cover border border-gray-200"
                                />
                            ) : (
                                <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center">
                                    <span className="text-teal-600 font-medium text-lg">
                                        {receiver.username?.charAt(0).toUpperCase() || '?'}
                                    </span>
                                </div>
                            )}
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">{receiver.username}</h2>
                                <p className="text-sm text-gray-500">Click to view profile</p>
                            </div>
                        </button>
                        
                        <button
                            onClick={() => navigate('/conv')}
                            className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 border border-gray-300 hover:border-gray-400 rounded-[6px] font-medium transition-all duration-200"
                        >
                            Back
                        </button>
                    </div>
                </div>

                {/* Messages Container */}
                <div className="bg-white border border-gray-200 rounded-[6px] mb-6">
                    <div className="h-[500px] overflow-y-auto p-6 space-y-4">
                        {messagesLoading ? (
                            <div className="flex items-center justify-center h-full">
                                <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-teal-500 border-solid"></div>
                            </div>
                        ) : messageList.length === 0 ? (
                            <div className="flex items-center justify-center h-full">
                                <p className="text-gray-500">No messages yet. Start the conversation!</p>
                            </div>
                        ) : (
                            messageList.map((mess) => (
                                <div
                                    key={mess.id}
                                    className={`flex ${mess.conversation === parseInt(convId) ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[75%] p-4 rounded-[6px] ${
                                            mess.conversation === parseInt(convId)
                                                ? "bg-teal-500 text-white"
                                                : "bg-gray-100 text-gray-900"
                                        }`}
                                    >
                                        {mess.text && (
                                            <p className="mb-2 break-words">{mess.text}</p>
                                        )}
                                        
                                        {mess.attachments?.length > 0 && (
                                            <div className="mt-3 space-y-2">
                                                {mess.attachments.map((att) => (
                                                    <div key={att.id} className="flex items-center justify-between bg-black bg-opacity-10 rounded p-2">
                                                        <span className="text-sm truncate flex-1 mr-2">
                                                            📎 {att.file.split('/').pop()}
                                                        </span>
                                                        <button
                                                            onClick={() => handleDownload(att.file, att.file.split('/').pop())}
                                                            className="text-xs underline hover:no-underline"
                                                        >
                                                            Download
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        
                                        <div className="flex items-center justify-between mt-2 text-xs opacity-75">
                                            <span>{getTime(mess.created_at)}</span>
                                            <span>
                                                {mess.is_read ? "✓✓" : mess.is_received ? "✓" : "○"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Message Input */}
                <div className="bg-white border border-gray-200 rounded-[6px] p-6">
                    {filesArray.length > 0 && (
                        <div className="mb-4 space-y-2">
                            <p className="text-sm font-medium text-gray-900">Attached files:</p>
                            {filesArray.map((file, index) => (
                                <div key={index} className="flex items-center justify-between bg-gray-50 rounded-[6px] p-3">
                                    <span className="text-sm text-gray-700 truncate">📎 {file.name}</span>
                                    <button
                                        onClick={() => removeFile(index)}
                                        className="text-red-500 hover:text-red-700 text-sm ml-2"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            const inputValue = inputRef.current.value;
                            sendMessage(inputValue);
                            inputRef.current.value = "";
                        }}
                        className="space-y-4"
                    >
                        <input
                            type="text"
                            placeholder="Type your message..."
                            ref={inputRef}
                            className="w-full px-4 py-3 border border-gray-300 rounded-[6px] focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                        />
                        
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setShowFileUpload(true)}
                                className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 border border-gray-300 hover:border-gray-400 rounded-[6px] font-medium transition-all duration-200"
                            >
                                📎 Attach File
                            </button>
                            
                            <button
                                type="submit"
                                className="px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-[6px] font-medium transition-all duration-200 ml-auto"
                            >
                                Send Message
                            </button>
                        </div>
                    </form>

                    {/* File Upload */}
                    {showFileUpload && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white border border-gray-200 rounded-[6px] p-6 w-full max-w-md mx-4">
                                <h3 className="text-lg font-semibold mb-4 text-gray-900">Attach File</h3>
                                
                                <input
                                    type="file"
                                    onChange={(e) => setTempFile(e.target.files[0])}
                                    className="block w-full text-sm text-gray-500 mb-4 file:mr-4 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded-[6px] file:text-sm file:font-medium file:bg-white file:text-gray-700 hover:file:bg-gray-50 transition-all duration-200"
                                />
                                
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => {
                                            setShowFileUpload(false);
                                            setTempFile(null);
                                        }}
                                        className="flex-1 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 border border-gray-300 hover:border-gray-400 rounded-[6px] font-medium transition-all duration-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSubmitFile}
                                        disabled={!tempFile}
                                        className="flex-1 px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-[6px] font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Add File
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatWindow;