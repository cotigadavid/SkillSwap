import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import secureAxios from "../secureAxios";
import { useNavigate } from "react-router-dom";

const ChatWindow = () => {
    const [message, setMessage] = useState('');
    const [messageList, setMessageList] = useState([]);
    const [oppositeConv, setOppositeConv] = useState('');
    const [receiver, setReceiver] = useState('');
    const [sender, setSender] = useState('');
    const [filesArray, setFilesArray] = useState([]);
    const [tempFile, setTempFile] = useState(null);
    const [showFileUpload, setShowFileUpload] = useState(false);
    
    const { convId } = useParams();

    const navigate = useNavigate();
    
    const sendMessage = async () => {

        const formData = new FormData();
        formData.append("conversation", parseInt(convId));
        formData.append("text", message);
        formData.append("is_received", false);
        formData.append("is_sent", false);

        for (let file of filesArray) {
            formData.append("attachments", file);
        }

        const response = await secureAxios.post('messages/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
    };

    useEffect(() => {
        const fetchConv = async () => {
            const convRes = await fetch(`http://localhost:8000/api/conversations/${convId}/`);
            const convData = await convRes.json();

            if (convData?.sender && convData?.receiver) {
                const [receiverRes, senderRes] = await Promise.all([
                    fetch(`http://localhost:8000/api/users/${convData.receiver}/`),
                    fetch(`http://localhost:8000/api/users/${convData.sender}/`),
                ]);
                const receiverData = await receiverRes.json();
                const senderData = await senderRes.json();

                setReceiver(receiverData);
                setSender(senderData);
            }
        };

        fetchConv();
    }, [convId]);
    
    useEffect(() => {
        if (!receiver?.id || !sender?.id) return;

        const fetchOppositeConv = async () => {
            const response = await fetch(`http://localhost:8000/api/conversations/`, {
                method: 'GET',
            });
            const data = await response.json();
    
            const filtered = data.find(conv => 
                conv.sender === receiver.id && conv.receiver === sender.id
            );
            setOppositeConv(filtered);
            console.log("opposite: ")
            console.log(filtered);
        };
    
        fetchOppositeConv();
    
    }, [receiver, sender]);

    useEffect(() =>  {
        const fetchMessage = async () => {
            const response = await fetch(`http://localhost:8000/api/messages/`, {
                method: 'GET'
            });
            const data = await response.json();
            const filtered = data.filter(mess => 
                mess.conversation === parseInt(convId) || mess.conversation === parseInt(oppositeConv.id)
            );
            setMessageList(filtered);
            console.log(oppositeConv);
        };
        
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
    
    useEffect(() =>  {
        const markAllAsRead = async () => {
            try {
                await secureAxios.post('/mark-read/', {
                    conversation_id: oppositeConv.id
                });
            } catch (err) {
                console.error("Failed to mark messages as read", err.message);
            }
        };
        
        markAllAsRead();
    }, [oppositeConv]);

    const handleSubmitFile = async () => {
        setFilesArray(f => [...f, tempFile]);
        setShowFileUpload(false);
        console.log(filesArray);
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
            link.download = fileName;
            document.body.appendChild(link);
            link.click();

            window.URL.revokeObjectURL(blobUrl);
            document.body.removeChild(link);
        } catch (error) {
            console.error("File download failed:", error);
        }
    };
    
    return (
        <div className="max-w-3xl mx-auto p-4 space-y-6 bg-white rounded shadow-md">
            {/* Receiver Info */}
            <div className="flex items-center gap-4 bg-gray-100 p-3 rounded">
                <button 
                    onClick={() => navigate(`/profile/${receiver.id}`)} 
                    className="flex items-center gap-3"
                >
                    <img 
                        src={receiver.profile_picture} 
                        width="60" 
                        height="60" 
                        alt="Profile" 
                        className="rounded-full object-cover"
                    />
                    <p className="text-lg font-semibold">{receiver.username}</p>
                </button>
            </div>

            {/* Messages */}
            <div className="space-y-4 max-h-[400px] overflow-y-auto">
                {messageList.map((mess) => (
                    <div
                        key={mess.id}
                        className={`p-3 rounded-lg w-fit max-w-[75%] ${mess.conversation === parseInt(convId)
                            ? "bg-blue-100 self-end ml-auto text-right"
                            : "bg-gray-100 self-start text-left"}`}
                    >
                        <p className="mb-1">{mess.text}</p>
                        <p className="text-xs text-gray-500">{getTime(mess.created_at)}</p>
                        <p className="text-xs text-gray-400 italic">
                            {mess.is_read ? "✓✓ Read" : mess.is_received ? "✓ Delivered" : "⏳ Sent"}
                        </p>

                        {/* Attachments */}
                        {mess.attachments?.length > 0 && (
                            <ul className="mt-2 space-y-1">
                                {mess.attachments.map((att) => (
                                    <li key={att.id} className="flex justify-between items-center">
                                        <span className="truncate">{att.file}</span>
                                        <button
                                            onClick={() => handleDownload(att.file, att.file)}
                                            className="text-blue-600 hover:underline text-sm"
                                        >
                                            Download
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                ))}
            </div>

            {/* Message Input */}
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    sendMessage();
                }}
                className="flex flex-col space-y-3"
            >
                <input
                    type="text"
                    placeholder="Message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="p-2 border rounded w-full"
                />
                <div className="flex gap-3">
                    <button type="button" className="px-3 py-1 bg-gray-300 rounded">+</button>
                    <button
                        type="button"
                        onClick={() => setShowFileUpload(true)}
                        className="px-3 py-1 bg-gray-300 rounded"
                    >
                        File
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Send
                    </button>
                </div>

                {/* File Upload Modal */}
                {showFileUpload && (
                    <div className="bg-gray-50 p-4 rounded shadow-inner space-y-2">
                        <input
                            type="file"
                            onChange={(e) => setTempFile(e.target.files[0])}
                            className="block w-full"
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={handleSubmitFile}
                                className="px-3 py-1 bg-green-500 text-white rounded"
                            >
                                Upload
                            </button>
                            <button
                                onClick={() => setShowFileUpload(false)}
                                className="px-3 py-1 bg-red-400 text-white rounded"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );

};

export default ChatWindow;