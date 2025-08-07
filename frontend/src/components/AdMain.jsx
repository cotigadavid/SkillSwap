import React, { useEffect, useState, useCallback, useMemo } from "react";
import SkillRequestForm from "./SkillRequestForm";
import AdInfo from "./AdInfo";
import { useParams } from "react-router-dom";
import secureAxios from "../secureAxios";

function AdMain() {

    const { id } = useParams();
    const [mySkills, setMySkills] = useState([]);
    const [ad, setAd] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [adResponse, skillsResponse] = await Promise.all([
                    secureAxios.get(`/skills-public/${id}/`),
                    secureAxios.get('/skills/')
                ]);

                setAd(adResponse.data);
                setMySkills(skillsResponse.data.results);

            } catch (error) {
                console.error('Error fetching data:', error);
                setErrorMessage('Failed to load data. Please try again.');
            }
        }

        fetchData();
    }, [id]);


    const handleSubmit = useCallback(async (skillIds, message) => {
        

        setErrorMessage(null);
        setSuccessMessage(null);

        try {
            const response = await secureAxios.post("/requests/", {
                receiver: ad.user.id,
                offered_skill: skillIds,
                requested_skill: [ad.id],
                message: message,
            });
            setSuccessMessage("The request was sent successfully!")

        } catch(error) {
            if (error.response && error.response.data) {
                const errorMessage = error.response.data.detail || error.response.data.message || JSON.stringify(error.response.data);
                setErrorMessage(errorMessage);
            }
            else {
                setErrorMessage("Unknown error from the server. We're sorry!");
            }
        }
        
    }, [ad]);

    return (
        <div className="min-h-screen bg-white py-8 px-4">
            <div className="max-w-7xl mx-auto space-y-6">

                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Skill Swap Request</h1>
                    <p className="text-gray-600">Connect and learn from each other</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                        <AdInfo ad={ad} />
                    </div>
                    
                    <div className="space-y-6">
                        <SkillRequestForm mySkills={mySkills} onSubmit={handleSubmit} />

                        {errorMessage && (
                        <div className="bg-red-50 border border-red-300 rounded p-4">
                            <div className="flex items-center gap-3">
                            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-red-700 font-medium">{errorMessage}</p>
                            </div>
                        </div>
                        )}

                        {successMessage && (
                        <div className="bg-green-50 border border-green-300 rounded p-4">
                            <div className="flex items-center gap-3">
                            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-green-700 font-medium">{successMessage}</p>
                            </div>
                        </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdMain;