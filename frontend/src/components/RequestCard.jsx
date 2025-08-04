import secureAxios from "../secureAxios";
import React, { useEffect, useState } from "react";

const RequestCard = ({request, showActions, handleAccept, handleDecline, handleChat}) => {
    return (
        <div className="border border-gray-300 rounded-lg p-4 mb-3 bg-white shadow-sm">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center mb-2">
                        {request.sender.profile_picture && (
                            <img 
                                src={request.sender.profile_picture} 
                                alt="Profile" 
                                className="w-10 h-10 rounded-full mr-3"
                            />
                        )}
                        <div>
                            <h3 className="font-semibold text-lg">{request.sender.name}</h3>
                            <p className="text-sm text-gray-500">
                                {new Date(request.timestamp).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                    
                    {request.message && (
                        <p className="text-gray-700 mb-3 italic">"{request.message}"</p>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h4 className="font-medium text-green-700 mb-2">Skills Offered:</h4>
                            <ul className="list-disc list-inside text-sm">
                                {request.offered_skill.map((skill) => (
                                    <li key={skill.id} className="text-gray-600">
                                        {skill.title} ({skill.difficulty})
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        <div>
                            <h4 className="font-medium text-blue-700 mb-2">Skills Requested:</h4>
                            <ul className="list-disc list-inside text-sm">
                                {request.requested_skill.map((skill) => (
                                    <li key={skill.id} className="text-gray-600">
                                        {skill.title} ({skill.difficulty})
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
                
                <div className="ml-4 flex flex-col gap-2">
                    {showActions ? (
                        <>
                            <button
                                onClick={() => handleAccept(request.id)}
                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                            >
                                Accept
                            </button>
                            <button
                                onClick={() => handleDecline(request.id)}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                            >
                                Decline
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => handleChat(request.sender.id)}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        >
                            Chat
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default RequestCard;