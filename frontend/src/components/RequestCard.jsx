import secureAxios from "../secureAxios";
import React, { useEffect, useState } from "react";

const RequestCard = ({request, showActions, handleAccept, handleDecline, handleChat}) => {
    console.log('request.sender:', request.sender);
    return (
        <div className="border border-gray-200 rounded-[6px] p-6 mb-4 bg-white hover:border-gray-400 transition-all duration-200">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center mb-4">
                        {request.sender.profile_picture && (
                            <img 
                                src={`https://skillswap-bucket.s3.eu-north-1.amazonaws.com/${request.sender.profile_picture}`} 
                                alt="Profile" 
                                className="w-12 h-12 rounded-full mr-4 border border-gray-200"
                            />
                        )}
                        <div>
                            <h3 className="font-semibold text-xl text-gray-900">{request.sender.name}</h3>
                            <p className="text-sm text-gray-500 mt-1">
                                {new Date(request.timestamp).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                    
                    {request.message && (
                        <p className="text-gray-700 mb-4 italic">"{request.message}"</p>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-medium text-gray-900 mb-3">Skills Offered</h4>
                            <div className="space-y-2">
                                {request.offered_skill.map((skill) => (
                                    <div key={skill.id} className="text-sm text-gray-600">
                                        <span className="font-medium text-gray-900">{skill.title}</span>
                                        <span className="text-gray-500 ml-2">({skill.difficulty})</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div>
                            <h4 className="font-medium text-gray-900 mb-3">Skills Requested</h4>
                            <div className="space-y-2">
                                {request.requested_skill.map((skill) => (
                                    <div key={skill.id} className="text-sm text-gray-600">
                                        <span className="font-medium text-gray-900">{skill.title}</span>
                                        <span className="text-gray-500 ml-2">({skill.difficulty})</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="ml-6 flex flex-col gap-3">
                    {showActions ? (
                        <>
                            <button
                                onClick={() => handleAccept(request.id)}
                                className="px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-[6px] font-medium transition-all duration-200"
                            >
                                Accept
                            </button>
                            <button
                                onClick={() => handleDecline(request.id)}
                                className="px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 border border-gray-300 hover:border-gray-400 rounded-[6px] font-medium transition-all duration-200"
                            >
                                Decline
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => handleChat(request.sender.id)}
                            className="px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-[6px] font-medium transition-all duration-200"
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