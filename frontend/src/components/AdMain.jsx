import React, { useEffect, useState } from "react";
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
        const fetchData = async() => {
            const response = await fetch(`http://localhost:8000/api/skills-public/${id}/`, {
                credentials: 'include',
            });
            const ad = await response.json();
            setAd(ad);
        }

        fetchData();
    }, [id]);

    useEffect(() => {
        const fetchSkills = async() => {
            const response = await secureAxios.get('/skills/');
            setMySkills(response.data);
        }

        fetchSkills();
    }, []);

    const handleSubmit = async (skillIds, message) => {
        
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
        
    };

    return (
        <div>
            <h1>Send request for skill swap</h1>
            <SkillRequestForm mySkills={mySkills} onSubmit={handleSubmit}/>
            {errorMessage && (
                <div>{errorMessage}</div>
            )}
            {successMessage && (
                <div>{successMessage}</div>
            )}
            <AdInfo ad={ad}/>
        </div>
    )
};

export default AdMain;