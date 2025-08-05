import React from "react";
import star from '../assets/star.png';
import { useParams } from "react-router-dom";
import { useState, useEffect } from 'react';
//import '../styling/AdInfo.css';
import secureAxios from "../secureAxios";

function AdInfo() {

    const {id} = useParams();
    const [ad, setAd] = useState(null);

    useEffect(() => {
        const fetchData = async() => {
            const response = await secureAxios.get(`/skills/${id}/`);
            const ad = await response.data;
            setAd(ad);
        }

        fetchData();
    }, [id]);

    if(!ad) return <h2>Loading...</h2>

    return (
    <div className="bg-white shadow-md rounded-md p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <img
        className="w-16 h-16 rounded-full object-cover border"
        src={ad.user.profile}
        alt="Profile"
        />
        <img
        className="w-24 h-24 object-cover rounded-md"
        src={ad.skill_picture}
        alt="Skill"
        />

        <div className="flex-1">
        <p className="text-lg font-semibold text-gray-800">{ad.user.name}</p>
        <p className="text-md text-gray-600">{ad.title}</p>

        <div className="flex items-center gap-1 mt-1">
            <img className="w-5 h-5" src={star} alt="Star" />
            {/* <span>{ad.reviews.rating}</span>
            <span className="text-sm text-gray-500">({ad.reviews.count})</span> */}
        </div>

        <p className="mt-2 text-sm text-gray-700 line-clamp-3">{ad.description}</p>
        <p className="text-sm text-gray-500">{ad.user.location}</p>
        </div>
    </div>
    );

}

export default AdInfo;
