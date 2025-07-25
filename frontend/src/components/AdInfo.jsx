import React from "react";
import star from '../assets/star.png';
import { useParams } from "react-router-dom";
import { useState, useEffect } from 'react';

function AdInfo({rating, numberReview, description, location}) {

    const {id} = useParams();
    const [ad, setAd] = useState(null);

    useEffect(() => {
        const fetchData = async() => {
            const response = await fetch(`http://localhost:8000/api/skills-public/${id}`);
            const ad = await response.json();
            setAd(ad);
        }

        fetchData();
    }, [id]);

    if(!ad) return <h2>Loading...</h2>

    return (
        <div>
            <img src={ad.user.photo} alt="ad"/>
            <img src={ad.user.photo} alt="photo"/>
            <p>{ad.user.name}</p>
            <p>{ad.title}</p>
            <div>
                <img src={star} alt="Star"/>
                <span>{rating}</span>
                <span>({numberReview})</span>
            </div>
            <p>{description}</p>
            <p>{location}</p>
        </div>
    )
}

export default AdInfo;
