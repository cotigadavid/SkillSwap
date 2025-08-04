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
        <div>
            <div className="Receiver">
                <button onClick={() => navigate(`/profile/${receiver.id}`)}>
                    <p>{receiver.username}</p>
                    <img src={`${receiver.profile_picture}`} width="100" height="100" alt="Profile"/>
                </button>
            </div>

            <div>
                { messageList.map(mess => (
                    <div 
                        key={mess.id}
                        className={
                            mess.conversation === parseInt(convId)
                            ? "my-message"
                            : "other-message"
                        }
                        >
                        <p>{mess.text}</p>
                        <p>{getTime(mess.created_at)}</p>
                        <p>{mess.is_read ? "✓✓ Read" : mess.is_received ? "✓ Delivered" : "⏳ Sent"}</p>
                        <ul> {mess.attachments && mess.attachments.map(att => (
                            <div>
                            <li key={att.id}> {att.file}</li>
                            <button onClick={() => handleDownload(att.file, att.file)}>
                                Download {att.file}
                            </button>    
                            </div>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <form onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
            }}>
                <input
                    type="text"
                    placeholder="Message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button type="button">+</button>
                <button type="button" onClick={() => setShowFileUpload(true)}>File</button>
                <div className="modal-overlays">
                    <input type="file" onChange={(e) => setTempFile(e.target.files[0])} />
                    <button onClick={handleSubmitFile}>Upload</button>
                    <button onClick={() => setShowFileUpload(false) }>Cancel</button>
                </div>
                <button type="submit" className='submitButton'>Send</button>
            </form>
        </div>
    );
};

export default ChatWindow;