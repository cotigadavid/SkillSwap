import React from "react";
import star from '../assets/star.png';
import { useParams } from "react-router-dom";
import { useState, useEffect } from 'react';
import '../styling/AdInfo.css';
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
        <div className="ad-info">
            <img className="profile-picture" src={ad.user.profile} alt="ad"/>
            <img className="skill-picture" src={ad.skill_picture} alt="photo"/>
            <p className="user-name">{ad.user.name}</p>
            <p className="skill-name">{ad.title}</p>
            <div className="rating">
                <img className="star" src={star} alt="Star"/>
                {/* <span>{ad.reviews.rating}</span>
                <span className="number-reviews">({ad.reviews.count})</span> */}
            </div>
            <p className="description">{ad.description}</p>
            <p className="location">{ad.user.location}</p>
        </div>
    )
}

export default AdInfo;
