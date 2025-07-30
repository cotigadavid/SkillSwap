import React, { useEffect, useState } from "react";
import SkillRequestForm from "./SkillRequestForm";
import AdInfo from "./AdInfo";
import { useParams } from "react-router-dom";
import secureAxios from "../secureAxios";

function AdMain() {

    const { id } = useParams();
    const [mySkills, setMySkills] = useState([]);
    const [ad, setAd] = useState(null);

    useEffect(() => {
        const fetchData = async() => {
            const response = await fetch(`http://localhost:8000/api/skills-public/${id}`);
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

    const handleSubmit = async (skillIds) => {
        try {
            const response = await secureAxios.post("/requests/", {
            receiver: ad.user.id,
            offered_skill: skillIds,
            requested_skill: [ad.id],
            message: "Salut! Hai sa facem schimb de skill-uri!"
        });
        } catch(error) {
            console.error("SERVER ERROR:", error.response?.data);
        }
        
    };

    return (
        <div>
            <h1>Send request for skill swap</h1>
            <SkillRequestForm mySkills={mySkills} onSubmit={handleSubmit}/>
            <AdInfo ad={ad}/>
        </div>
    )
};

export default AdMain;